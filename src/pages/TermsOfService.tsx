import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Terms of Service"
        description="Terms of service for No More Enabling - educational content disclaimers, user responsibilities, and limitations of liability for our addiction and family resources."
        canonicalUrl="https://nomoreenabling.com/terms"
        keywords="terms of service, disclaimers, educational content, addiction resources, family support"
      />
      <Header />
      
      <main className="flex-grow" role="main">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Terms and conditions for using No More Enabling resources
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Last updated: February 26, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                
                <h2>Acceptance of Terms</h2>
                <p>
                  By accessing and using the No More Enabling website (nomoreenabling.com), you accept 
                  and agree to be bound by the terms and provision of this agreement. If you do not 
                  agree to abide by these Terms of Service, you are not authorized to use or access 
                  this website.
                </p>

                <h2>Educational Purpose and Medical Disclaimer</h2>
                <p>
                  <strong>No More Enabling is an educational resource only.</strong> The content provided 
                  on this website, including articles, guides, and other materials, is for informational 
                  and educational purposes only and is not intended as a substitute for professional 
                  medical, mental health, or legal advice, diagnosis, or treatment.
                </p>
                <p>
                  <strong>We are not medical or mental health professionals.</strong> Always seek the 
                  advice of your physician, therapist, or other qualified healthcare provider with any 
                  questions you may have regarding a medical or mental health condition. Never disregard 
                  professional medical advice or delay seeking it because of something you have read on 
                  No More Enabling.
                </p>
                <p>
                  <strong>If you or someone you know is in immediate danger or experiencing a mental 
                  health emergency, please contact emergency services (911) or the National Suicide 
                  Prevention Lifeline at 988.</strong>
                </p>

                <h2>No Professional Relationship</h2>
                <p>
                  Use of this website does not create a professional relationship between you and 
                  No More Enabling, Matt Brown, or any contributors to the site. We do not provide 
                  personalized advice, treatment recommendations, or intervention services through 
                  this website.
                </p>

                <h2>User Responsibilities</h2>
                <p>As a user of No More Enabling, you agree to:</p>
                <ul>
                  <li>Use the website and its content responsibly and in accordance with applicable laws</li>
                  <li>Not use the content for any unlawful or prohibited purpose</li>
                  <li>Respect the intellectual property rights of No More Enabling and its contributors</li>
                  <li>Not attempt to gain unauthorized access to any part of the website</li>
                  <li>Not transmit any viruses, malware, or other harmful code</li>
                  <li>Provide accurate information when subscribing to newsletters or contacting us</li>
                </ul>

                <h2>Email Communications</h2>
                <p>
                  By subscribing to our newsletter or contacting us via email, you consent to receive 
                  communications from us. You can unsubscribe from our newsletter at any time using 
                  the unsubscribe link provided in our emails.
                </p>
                <p>
                  Any emails you send to us may be retained for record-keeping purposes. Please do 
                  not include sensitive personal health information in your emails.
                </p>

                <h2>Intellectual Property Rights</h2>
                <p>
                  All content on No More Enabling, including but not limited to text, graphics, logos, 
                  images, and software, is the property of No More Enabling and is protected by copyright, 
                  trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works from, publicly 
                  display, or commercially exploit any content from this website without our express 
                  written permission, except as permitted by fair use or other applicable law.
                </p>

                <h2>Third-Party Content and Links</h2>
                <p>
                  Our website may contain links to third-party websites, advertisements, or services. 
                  We do not control or endorse these third-party resources and are not responsible 
                  for their content, privacy practices, or terms of service.
                </p>
                <p>
                  Third-party advertisements (including but not limited to BetterHelp and other partners) 
                  are not endorsements of specific products or services. We encourage you to research 
                  any services before engaging with them.
                </p>

                <h2>Limitation of Liability</h2>
                <p>
                  <strong>To the fullest extent permitted by law, No More Enabling, its owners, 
                  contributors, and affiliates shall not be liable for any direct, indirect, 
                  incidental, special, consequential, or punitive damages resulting from your use 
                  of this website or its content.</strong>
                </p>
                <p>
                  This includes but is not limited to damages for loss of profits, data, or other 
                  intangibles, even if we have been advised of the possibility of such damages.
                </p>

                <h2>Disclaimer of Warranties</h2>
                <p>
                  This website and its content are provided "as is" without any warranties, express 
                  or implied. We do not warrant that the website will be uninterrupted, error-free, 
                  or free of viruses or other harmful components.
                </p>

                <h2>Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless No More Enabling and its 
                  contributors from any claims, damages, losses, costs, or expenses (including 
                  reasonable attorneys' fees) arising from your use of the website or violation 
                  of these Terms of Service.
                </p>

                <h2>Privacy</h2>
                <p>
                  Your privacy is important to us. Please review our 
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> 
                  to understand how we collect, use, and protect your information.
                </p>

                <h2>Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. Changes will 
                  be effective immediately upon posting on this website. Your continued use of the 
                  website after changes have been posted constitutes your acceptance of the revised terms.
                </p>

                <h2>Governing Law</h2>
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the 
                  laws of the United States and the state in which No More Enabling operates, 
                  without regard to conflict of law principles.
                </p>

                <h2>Severability</h2>
                <p>
                  If any provision of these Terms of Service is found to be unenforceable or invalid, 
                  that provision shall be limited or eliminated to the minimum extent necessary so 
                  that these terms shall otherwise remain in full force and effect.
                </p>

                <h2>Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul>
                  <li><strong>Email:</strong> matt@nomoreenabling.com</li>
                  <li><strong>Company:</strong> No More Enabling</li>
                </ul>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;