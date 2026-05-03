import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Plus, Send, Users } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
}

interface Campaign {
  id: string;
  subject: string;
  recipients: string[];
  sent_count: number;
  failed_count: number;
  campaign_type: string;
  sent_at: string | null;
  created_at: string;
}

export const AdminCrmPanel = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // new contact form
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", tags: "", notes: "" });

  // email form
  const [mode, setMode] = useState<"single" | "campaign">("single");
  const [singleTo, setSingleTo] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tagFilter, setTagFilter] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    const [c, k] = await Promise.all([
      supabase.from("crm_contacts").select("*").order("created_at", { ascending: false }),
      supabase.from("email_campaigns").select("*").order("created_at", { ascending: false }).limit(25),
    ]);
    if (c.data) setContacts(c.data as Contact[]);
    if (k.data) setCampaigns(k.data as Campaign[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    contacts.forEach((c) => c.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    if (!tagFilter) return contacts;
    return contacts.filter((c) => c.tags?.includes(tagFilter));
  }, [contacts, tagFilter]);

  const addContact = async () => {
    if (!newContact.name || !newContact.email) {
      toast({ title: "Name and email required", variant: "destructive" });
      return;
    }
    const tags = newContact.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase.from("crm_contacts").insert({
      name: newContact.name,
      email: newContact.email.toLowerCase().trim(),
      phone: newContact.phone || null,
      tags,
      notes: newContact.notes || null,
    });
    if (error) {
      toast({ title: "Could not add contact", description: error.message, variant: "destructive" });
      return;
    }
    setNewContact({ name: "", email: "", phone: "", tags: "", notes: "" });
    toast({ title: "Contact added" });
    load();
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await supabase.from("crm_contacts").delete().eq("id", id);
    load();
  };

  const toggleSelect = (id: string) => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  const selectAllVisible = () => {
    setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const sendEmail = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: "Subject and body required", variant: "destructive" });
      return;
    }
    let recipients: string[] = [];
    if (mode === "single") {
      const e = singleTo.trim().toLowerCase();
      if (!e) { toast({ title: "Recipient required", variant: "destructive" }); return; }
      recipients = [e];
    } else {
      recipients = contacts.filter((c) => selectedIds.has(c.id)).map((c) => c.email);
      if (recipients.length === 0) { toast({ title: "Select at least one contact", variant: "destructive" }); return; }
    }

    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-admin-email", {
      body: { subject, body, recipients },
    });
    setSending(false);

    if (error) {
      toast({ title: "Send failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Sent to ${data?.sent ?? 0} recipient(s)`, description: data?.failed ? `${data.failed} failed` : undefined });
    setSubject(""); setBody(""); setSingleTo(""); clearSelection();
    load();
  };

  return (
    <div className="space-y-8">
      {/* Email composer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" /> Compose Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant={mode === "single" ? "default" : "outline"} onClick={() => setMode("single")}>Single</Button>
            <Button size="sm" variant={mode === "campaign" ? "default" : "outline"} onClick={() => setMode("campaign")}>
              <Users className="w-4 h-4 mr-1" /> Campaign
            </Button>
          </div>

          {mode === "single" ? (
            <div>
              <Label>Recipient email</Label>
              <Input type="email" value={singleTo} onChange={(e) => setSingleTo(e.target.value)} placeholder="person@example.com" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Label className="m-0">Recipients ({selectedIds.size} selected)</Label>
                <Button size="sm" variant="ghost" onClick={selectAllVisible}>Select all visible</Button>
                <Button size="sm" variant="ghost" onClick={clearSelection}>Clear</Button>
                <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="ml-auto text-sm border border-border rounded px-2 py-1 bg-background">
                  <option value="">All tags</option>
                  {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="max-h-48 overflow-y-auto border border-border rounded-md divide-y">
                {filteredContacts.map((c) => (
                  <label key={c.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40">
                    <Checkbox checked={selectedIds.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} />
                    <span className="flex-1 text-sm">{c.name} <span className="text-muted-foreground">· {c.email}</span></span>
                    <span className="flex gap-1">{c.tags?.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</span>
                  </label>
                ))}
                {filteredContacts.length === 0 && <p className="px-3 py-4 text-sm text-muted-foreground">No contacts.</p>}
              </div>
            </div>
          )}

          <div>
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <Label>Message (paragraphs separated by blank lines)</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder="Write your message here..." />
            <p className="text-xs text-muted-foreground mt-1">Sent with the No More Enabling branded template (logo, colors, footer).</p>
          </div>
          <Button onClick={sendEmail} disabled={sending}>
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Sending..." : mode === "single" ? "Send Email" : `Send Campaign (${selectedIds.size})`}
          </Button>
        </CardContent>
      </Card>

      {/* Add contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
            <Input type="email" placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} />
            <Input placeholder="Phone (optional)" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
            <Input placeholder="Tags (comma separated)" value={newContact.tags} onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })} />
            <Textarea className="md:col-span-2" placeholder="Notes" value={newContact.notes} onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })} />
          </div>
          <Button className="mt-4" onClick={addContact}><Plus className="w-4 h-4 mr-2" />Add Contact</Button>
        </CardContent>
      </Card>

      {/* Contacts list */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b border-border">
                  <tr><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Email</th><th className="py-2 pr-3">Phone</th><th className="py-2 pr-3">Tags</th><th className="py-2 pr-3">Notes</th><th></th></tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b border-border/50">
                      <td className="py-2 pr-3 font-medium">{c.name}</td>
                      <td className="py-2 pr-3">{c.email}</td>
                      <td className="py-2 pr-3">{c.phone || "—"}</td>
                      <td className="py-2 pr-3"><div className="flex flex-wrap gap-1">{c.tags?.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div></td>
                      <td className="py-2 pr-3 max-w-xs truncate text-muted-foreground">{c.notes}</td>
                      <td className="py-2 text-right"><Button size="sm" variant="ghost" onClick={() => deleteContact(c.id)}><Trash2 className="w-4 h-4" /></Button></td>
                    </tr>
                  ))}
                  {contacts.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No contacts yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign history */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sends</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? <p className="text-sm text-muted-foreground">No emails sent yet.</p> : (
            <div className="space-y-2">
              {campaigns.map((k) => (
                <div key={k.id} className="flex items-start justify-between border border-border rounded-md p-3">
                  <div>
                    <p className="font-medium">{k.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(k.sent_at || k.created_at).toLocaleString()} · {k.campaign_type} · {k.recipients.length} recipient(s)
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <Badge variant="secondary">{k.sent_count} sent</Badge>
                    {k.failed_count > 0 && <Badge variant="destructive" className="ml-1">{k.failed_count} failed</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
