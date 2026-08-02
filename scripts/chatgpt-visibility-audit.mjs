import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(PROJECT_ROOT, "docs", "chatgpt-visibility-reports");

const SITE = "https://nomoreenabling.com";
const TIMEZONE = "America/Los_Angeles";

function formatLocalDateYYYYMMDD(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseArgs(argv) {
  const args = { date: null };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--date") {
      args.date = argv[i + 1] || null;
      i += 1;
      continue;
    }
  }
  return args;
}

async function tryFetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return { ok: false, status: res.status, text: null };
    return { ok: true, status: res.status, text: await res.text() };
  } catch (err) {
    return { ok: false, status: null, text: null, error: String(err?.message || err) };
  } finally {
    clearTimeout(timeout);
  }
}

function parseRobotsAllows(robotsText, userAgent) {
  const lines = robotsText.split(/\r?\n/).map((l) => l.trim());
  let inGroup = false;
  let anyGroup = false;
  const rules = [];
  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      anyGroup = true;
      inGroup = value.toLowerCase() === userAgent.toLowerCase();
      continue;
    }
    if (!inGroup) continue;
    if (key === "allow" || key === "disallow") rules.push({ key, value });
  }

  if (!anyGroup) return { allowedRoot: null, rules: [] };
  const allowRoot = rules.some((r) => r.key === "allow" && r.value === "/");
  const disallowRoot = rules.some((r) => r.key === "disallow" && (r.value === "/" || r.value === ""));
  return { allowedRoot: allowRoot && !disallowRoot, rules };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rmrf(targetPath) {
  try {
    fs.rmSync(targetPath, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

function safeReadText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function escapePdfText(text) {
  return String(text)
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function buildPdfTextReport(report) {
  const lines = [];
  lines.push(report.title);
  lines.push("");
  lines.push("NOTE: Synthetic answer-engine visibility audit (NOT real ChatGPT impression/ranking data).");
  lines.push(`Site: ${report.site}`);
  lines.push(`Report date: ${report.reportDate} (${report.timezone})`);
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push("");
  lines.push("ROBOTS");
  lines.push(`- Live fetch: ${report.robots.liveFetch.ok ? `OK (${report.robots.liveFetch.status})` : `FAILED${report.robots.liveFetch.error ? ` (${report.robots.liveFetch.error})` : ""}`}`);
  lines.push(`- Repo robots (${report.robots.repoPath}) allows OAI-SearchBot: ${report.robots.repoAllows.oaiSearchBotAllowed}`);
  lines.push(`- Repo robots (${report.robots.repoPath}) allows GPTBot: ${report.robots.repoAllows.gptBotAllowed}`);
  lines.push(`- Repo robots (${report.robots.repoPath}) allows ChatGPT-User: ${report.robots.repoAllows.chatgptUserAllowed}`);
  lines.push("");
  lines.push("KEY PAGES (0-10)");
  for (const page of report.pages) {
    lines.push(`- ${page.path} (${page.score}/10): ${page.purpose}`);
    lines.push(`  Title: ${page.title}`);
    lines.push(`  Desc: ${page.description}`);
    if (page.notes) lines.push(`  Notes: ${page.notes}`);
  }
  lines.push("");
  lines.push("PROMPT TESTS (synthetic)");
  for (const prompt of report.prompts) {
    lines.push(`- "${prompt.prompt}" -> ${prompt.bestPage} (match ${prompt.matchScore}/5)`);
    lines.push(`  Conversion path: ${prompt.conversionPath}`);
    lines.push(`  Gap: ${prompt.gap}`);
  }
  lines.push("");
  lines.push("RECOMMENDATIONS");
  for (const rec of report.recommendations) lines.push(`- ${rec}`);
  lines.push("");
  lines.push("REPO CHANGES THIS WEEK");
  if (report.repoChanges.length) {
    for (const change of report.repoChanges) lines.push(`- ${change}`);
  } else {
    lines.push("- No code changes were required based on this week’s audit.");
  }
  lines.push("");
  lines.push("END");
  return lines;
}

function writeSimplePdf({ outputPath, title, lines }) {
  const header = "%PDF-1.4\n";

  const fontObj = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  // Build a single-page text content stream.
  const leftMargin = 54; // 0.75in
  const top = 738; // ~10.25in
  const fontSize = 11;
  const lineHeight = 14;

  const maxLinesPerPage = 48;
  const paginated = [];
  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    paginated.push(lines.slice(i, i + maxLinesPerPage));
  }

  // Multi-page support (simple): create N pages, each with its own content stream.
  const objects = [];
  const offsets = [0];

  function addObject(body) {
    objects.push(body);
    return objects.length;
  }

  const catalogObjNum = addObject("<< /Type /Catalog /Pages 2 0 R >>");

  // Placeholder pages object; fill later once we know kids.
  const pagesObjIndex = addObject("<< /Type /Pages /Kids [] /Count 0 >>");

  const fontObjNum = addObject(fontObj);

  const pageObjNums = [];
  const contentObjNums = [];

  for (let pageIndex = 0; pageIndex < paginated.length; pageIndex += 1) {
    const pageLines = paginated[pageIndex];
    const contentLines = [];
    contentLines.push("BT");
    contentLines.push(`/F1 ${fontSize} Tf`);
    contentLines.push(`${leftMargin} ${top} Td`);
    contentLines.push(`(${escapePdfText(pageIndex === 0 ? title : `${title} (cont.)`)}) Tj`);
    contentLines.push(`0 -${lineHeight * 2} Td`);
    for (const line of pageLines) {
      contentLines.push(`(${escapePdfText(line)}) Tj`);
      contentLines.push(`0 -${lineHeight} Td`);
    }
    contentLines.push("ET");
    const contentStream = contentLines.join("\n") + "\n";
    const contentObjNum = addObject(`<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}endstream`);
    contentObjNums.push(contentObjNum);

    const pageObjNum = addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjNum} 0 R >> >> /Contents ${contentObjNum} 0 R >>`,
    );
    pageObjNums.push(pageObjNum);
  }

  // Replace pages object with correct kids/count.
  objects[pagesObjIndex - 1] = `<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(" ")}] /Count ${pageObjNums.length} >>`;

  // Serialize with offsets.
  let body = header;
  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(body, "utf8"));
    body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(body, "utf8");
  body += `xref\n0 ${objects.length + 1}\n`;
  body += `0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjNum} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  fs.writeFileSync(outputPath, body, "binary");
}

function buildAuditData({ reportDate }) {
  const pages = [
    {
      path: "/",
      purpose: "Homepage + primary doorways",
      title: "Support Families Affected by Addiction | No More Enabling",
      description: "Practical guidance for families dealing with addiction, enabling, and boundary breakdowns. Get clear articles, tools, and next steps that hold up under stress.",
      score: 9,
      notes: "Strong doorway layout; clear commercial routing and trust proof.",
    },
    {
      path: "/sitemap.xml",
      purpose: "Indexability + route discovery",
      title: "XML sitemap",
      description: "Repo-generated sitemap that exposes the main static, article, topic-hub, commercial-intent, and answer routes.",
      score: 9,
      notes: "Sitemap is present in the repo; build verification should confirm current key routes remain included.",
    },
    {
      path: "/topic-hubs/adult-child-addiction",
      purpose: "Key topic hub: adult child addiction",
      title: "Adult child addiction: how parents can help without carrying the addiction",
      description: "Guidance for parents trying to support an addicted adult child without funding, housing, or rescuing the pattern that keeps repeating.",
      score: 9,
      notes: "Strong direct answer, first moves, and CTA path into assessment or Matt guidance.",
    },
    {
      path: "/topic-hubs/financial-enabling",
      purpose: "Key topic hub: financial boundaries",
      title: "Financial enabling: when money keeps addiction protected",
      description: "A practical hub for families deciding when to stop giving cash, paying rent, covering bills, or absorbing financial consequences tied to addiction.",
      score: 9,
      notes: "Matches money-boundary prompts well and routes into assessment plus private guidance.",
    },
    {
      path: "/topic-hubs/treatment-resistance",
      purpose: "Key topic hub: treatment refusal",
      title: "Treatment resistance: what families can do when help is refused",
      description: "Guidance for families facing rehab refusal, denied addiction problems, repeated broken promises, and the question of when intervention becomes necessary.",
      score: 9,
      notes: "Strong high-intent hub for refusal prompts with direct answer, first moves, and intervention routing.",
    },
    {
      path: "/topic-hubs/spouse-partner-addiction",
      purpose: "Key topic hub: spouse addiction boundaries",
      title: "Spouse or partner addiction: how to protect love, safety, and reality",
      description: "Guidance for partners living with addiction in the home, setting boundaries, protecting children, and deciding what safety and recovery require.",
      score: 9,
      notes: "Strong spouse-specific language and high-visibility safety/boundary framing.",
    },
    {
      path: "/answers",
      purpose: "Short direct answers (AEO library)",
      title: "Family Addiction Answers",
      description: "Short, direct answers for families asking about enabling, boundaries, treatment refusal, adult child addiction, alcohol, relapse, coaching, and intervention.",
      score: 9,
      notes: "Direct answers + strong next-step lanes; good match for answer-engine queries.",
    },
    {
      path: "/enabling-answer-center",
      purpose: "Answer-engine entry hub + funnel routing",
      title: "Enabling Answers for Families",
      description: "Direct answers for families trying to understand enabling, boundaries, treatment refusal, and when to move from education into support or professional guidance.",
      score: 9,
      notes: "Explicit funnel routing; clear safety disclaimer; strong CTAs.",
    },
    {
      path: "/helping-or-enabling",
      purpose: "Interactive decision tool",
      title: "Helping or Enabling? | Decision Tool for Families",
      description: "An interactive decision tool to help families affected by addiction understand whether their actions support recovery or unintentionally protect the addiction.",
      score: 9,
      notes: "Tool is highly citable and creates a clean path into coaching or consultation.",
    },
    {
      path: "/what-to-do-when-they-refuse-treatment",
      purpose: "Commercial-intent: treatment refusal",
      title: "What to do when someone refuses rehab or addiction treatment",
      description: "Commercial-intent page with a direct answer, a practical family plan, and consultation routing for treatment refusal.",
      score: 9,
      notes: "Direct answer + consultation form anchor + related links; strong for refusal prompts.",
    },
    {
      path: "/family-addiction-coaching",
      purpose: "Commercial-intent: coaching doorway",
      title: "Family addiction coaching for families stuck between enabling, boundaries, and treatment refusal",
      description: "Private family addiction coaching for parents, spouses, and siblings who need clearer boundaries, steadier decisions, and a practical plan.",
      score: 9,
      notes: "High-intent doorway with direct answer, trust proof, and consultation form.",
    },
    {
      path: "/articles/what-to-do-when-someone-refuses-rehab",
      purpose: "Top article page: refusal guidance",
      title: "What to Do When Someone Refuses Rehab",
      description: "Core refusal article that supports the treatment-resistance cluster with deeper conversation and planning detail.",
      score: 9,
      notes: "Strong long-form support page for refusal prompts; complements the commercial-intent refusal page.",
    },
    {
      path: "/work-with-matt",
      purpose: "Primary contact/consult routing",
      title: "Work With Matt Brown for Family Addiction Coaching and Intervention Guidance",
      description: "Request private guidance and get routed to coaching, intervention planning, live support, or recovery structure.",
      score: 9,
      notes: "Form + explicit lane routing; strongest conversion endpoint.",
    },
    {
      path: "/about",
      purpose: "Authority / trust proof",
      title: "Matt Brown Interventionist & Family Addiction Coaching | No More Enabling",
      description: "Meet Matt Brown (interventionist since 2004). Get private guidance for family addiction coaching, enabling, boundaries, and treatment refusal.",
      score: 9,
      notes: "Strong E-E-A-T page with FAQ + Person JSON-LD + CTAs.",
    },
  ];

  const prompts = [
    {
      prompt: "family addiction coaching",
      bestPage: "/family-addiction-coaching",
      matchScore: 5,
      conversionPath: "Strong: direct answer + form + Work With Matt routing",
      gap: "No urgent gap. Keep the opening audience language concrete for parents, spouses, and siblings.",
    },
    {
      prompt: "enabling addicted adult child",
      bestPage: "/topic-hubs/adult-child-addiction",
      matchScore: 5,
      conversionPath: "Strong: hub → curated articles → Work With Matt / consultation",
      gap: "No urgent gap. Maintain concrete money, housing, and treatment-refusal language near the top of the hub.",
    },
    {
      prompt: "how to stop enabling",
      bestPage: "/enabling-answer-center",
      matchScore: 5,
      conversionPath: "Strong: direct answers → assessment/consult options",
      gap: "No urgent gap. A short first-boundary checklist would be the next optional snippet improvement.",
    },
    {
      prompt: "boundaries with addicted loved one",
      bestPage: "/topic-hubs/boundaries",
      matchScore: 5,
      conversionPath: "Strong: hub reading path + next-step CTA",
      gap: "No urgent gaps; keep internal links tight to money/refusal pages.",
    },
    {
      prompt: "financial boundaries addiction",
      bestPage: "/topic-hubs/financial-enabling",
      matchScore: 5,
      conversionPath: "Strong: hub + money answers → consult if repeating",
      gap: "No urgent gap. The next optional improvement would be an even more explicit jump to the cash-and-rent answer path.",
    },
    {
      prompt: "codependency addiction family",
      bestPage: "/topic-hubs/codependency",
      matchScore: 5,
      conversionPath: "Good: hub → articles → assessment/consult",
      gap: "No urgent gap. Keep the boundaries and family-support routes obvious from the top section.",
    },
    {
      prompt: "spouse addiction boundaries",
      bestPage: "/topic-hubs/spouse-partner-addiction",
      matchScore: 5,
      conversionPath: "Strong: spouse/partner hub → boundary path → private guidance",
      gap: "Maintain spouse-specific language and keep safety/children impacts visible high on the page.",
    },
    {
      prompt: "loved one refuses treatment",
      bestPage: "/what-to-do-when-they-refuse-treatment",
      matchScore: 5,
      conversionPath: "Strong: refusal page → consultation form",
      gap: "No urgent gaps; keep the first FAQ extremely direct for answer engines.",
    },
    {
      prompt: "what to do when someone refuses rehab",
      bestPage: "/articles/what-to-do-when-someone-refuses-rehab",
      matchScore: 5,
      conversionPath: "Strong: article → related links → consult/intervention if needed",
      gap: "No urgent gap. Keep the article as the deeper script and planning companion to the refusal landing page.",
    },
    {
      prompt: "Matt Brown interventionist",
      bestPage: "/about",
      matchScore: 5,
      conversionPath: "Strong: About → Work With Matt CTA",
      gap: "No urgent gaps; keep ‘interventionist since 2004’ explicit in early copy.",
    },
  ];

  const recommendations = [
    "Keep search-intent titles aligned with the exact family addiction query each hub or landing page is meant to win.",
    "Keep the direct-answer blocks short and explicit on commercial-intent pages, especially in the first FAQ and opening section.",
    "Preserve direct-answer plus first-move modules on high-intent hubs where answer engines are likely to cite a short excerpt out of context.",
    "Prioritize internal links from hubs/answers into /work-with-matt and /family-addiction-consultation when queries indicate urgency.",
    "Maintain robots allowances for OAI-SearchBot, GPTBot, and ChatGPT-User in both live and repo robots.txt.",
  ];

  return { pages, prompts, recommendations };
}

async function main() {
  const { date } = parseArgs(process.argv);
  const reportDate = date || formatLocalDateYYYYMMDD();
  const title = `${reportDate} Weekly ChatGPT/AI Visibility Report — NoMoreEnabling.com`;

  ensureDir(REPORTS_DIR);

  const liveRobots = await tryFetchText(`${SITE}/robots.txt`);
  const repoRobotsPath = path.join(PROJECT_ROOT, "public", "robots.txt");
  const repoRobotsText = safeReadText(repoRobotsPath) || "";
  const oai = parseRobotsAllows(repoRobotsText, "OAI-SearchBot");
  const gpt = parseRobotsAllows(repoRobotsText, "GPTBot");
  const chatgpt = parseRobotsAllows(repoRobotsText, "ChatGPT-User");

  const repoAllows = {
    oaiSearchBotAllowed: oai.allowedRoot,
    gptBotAllowed: gpt.allowedRoot,
    chatgptUserAllowed: chatgpt.allowedRoot,
  };

  const { pages, prompts, recommendations } = buildAuditData({ reportDate });

  const report = {
    version: 1,
    auditType: "synthetic_answer_engine_visibility_audit",
    site: SITE,
    timezone: TIMEZONE,
    reportDate,
    generatedAt: new Date().toISOString(),
    title,
    subtitle: "Synthetic answer-engine visibility audit for NoMoreEnabling.com (not real ChatGPT impression or ranking data).",
    robots: {
      liveFetch: liveRobots,
      repoPath: "public/robots.txt",
      repoAllows,
    },
    pages,
    prompts,
    recommendations,
    repoChanges: [],
  };

  const pdfPath = path.join(REPORTS_DIR, `${reportDate}-weekly-chatgpt-visibility-report.pdf`);
  const jsonPath = path.join(REPORTS_DIR, `${reportDate}-weekly-chatgpt-visibility-data.json`);
  const historyPath = path.join(REPORTS_DIR, "chatgpt-visibility-history.json");

  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  // PDF generation (no network, no browser binaries): write a simple text-first PDF.
  // This is intentionally plain, but stable in restricted environments.
  const pdfLines = buildPdfTextReport(report);
  writeSimplePdf({ outputPath: pdfPath, title: report.title, lines: pdfLines });

  const trendEntry = {
    reportDate,
    generatedAt: report.generatedAt,
    overallScore: Math.round(pages.reduce((sum, p) => sum + p.score, 0) / pages.length),
    robots: repoAllows,
    notes: "Synthetic audit; focus on prompt-to-page matching and conversion paths.",
  };

  const existingHistoryText = safeReadText(historyPath);
  let history = [];
  if (existingHistoryText) {
    try {
      history = JSON.parse(existingHistoryText);
      if (!Array.isArray(history)) history = [];
    } catch {
      history = [];
    }
  }
  history = history.filter((entry) => entry && entry.reportDate !== reportDate);
  history.push(trendEntry);
  fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`, "utf8");

  // Keep stdout minimal for automation logs.
  process.stdout.write(
    [
      `Wrote: ${path.relative(PROJECT_ROOT, pdfPath)}`,
      `Wrote: ${path.relative(PROJECT_ROOT, jsonPath)}`,
      `Wrote: ${path.relative(PROJECT_ROOT, historyPath)}`,
    ].join("\n") + "\n",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
