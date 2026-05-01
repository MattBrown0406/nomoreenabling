import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Privacy Policy"
        description="No More Enabling privacy policy - how we collect, use, and protect your personal information including newsletter signups and analytics data."
        canonicalUrl="https://nomoreenabling.com/privacy"
        keywords="privacy policy, data protection, newsletter signup, analytics, no more enabling"
      />
      <Header />
      
      <main className="flex-grow" role="main">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                How we collect, use, and protect your personal information
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Last updated: February 26, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                
                <h2>Introduction</h2>
                <p>
                  No More Enabling ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you visit our website nomoreenabling.com or subscribe to our 
                  newsletter.
                </p>

                <h2>Information We Collect</h2>
                
                <h3>Information You Provide Directly</h3>
                <ul>
                  <li><strong>Newsletter Signup:</strong> Email address and optionally your name when you subscribe to our newsletter</li>
                  <li><strong>Contact Forms:</strong> Email address, name, and any message content when you contact us</li>
                  <li><strong>Comments or Feedback:</strong> Any information you provide when leaving feedback or comments</li>
                </ul>

                <h3>Information Collected Automatically</h3>
                <ul>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on site, browser type, device information</li>
                  <li><strong>Analytics Data:</strong> Website traffic patterns, user behavior, and performance metrics via Google Analytics</li>
                  <li><strong>Cookies:</strong> Small data files stored on your device to improve your browsing experience</li>
                  <li><strong>IP Address:</strong> Your internet protocol address for security and analytics purposes</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ul>
                  <li>To send you our newsletter and educational content (only if you've subscribed)</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To improve our website content and user experience</li>
                  <li>To analyze website traffic and usage patterns</li>
                  <li>To detect and prevent fraud or abuse</li>
                  <li>To comply with legal obligations</li>
                </ul>

                <h2>Data Storage and Security</h2>
                <p>
                  Your personal information is stored securely using Supabase, a cloud-based database service. 
                  We implement appropriate technical and organizational security measures to protect your data 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  While we strive to use commercially acceptable means to protect your personal information, 
                  we cannot guarantee absolute security.
                </p>

                <h2>Third-Party Services</h2>
                <p>We work with several third-party services that may collect information:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> Tracks website usage and performance</li>
                  <li><strong>Supabase:</strong> Stores newsletter subscriber information and user data</li>
                  <li><strong>Owned Brand Placements:</strong> We may measure clicks to Freedom Interventions, Family Bridge, and The Party Wreckers Podcast</li>
                </ul>
                <p>
                  These third parties have their own privacy policies. We encourage you to review their 
                  privacy practices.
                </p>

                <h2>Your Rights and Choices</h2>
                <p>You have the following rights regarding your personal information:</p>
                <ul>
                  <li><strong>Unsubscribe:</strong> You can unsubscribe from our newsletter at any time using the link in our emails</li>
                  <li><strong>Access:</strong> Request information about what personal data we have about you</li>
                  <li><strong>Correction:</strong> Request that we correct any inaccurate personal information</li>
                  <li><strong>Deletion:</strong> Request that we delete your personal information (subject to legal requirements)</li>
                  <li><strong>Data Portability:</strong> Request a copy of your personal data in a structured format</li>
                </ul>

                <h2>Cookies and Similar Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our website. 
                  For detailed information about our cookie usage, please see our 
                  <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
                </p>

                <h2>Children's Privacy</h2>
                <p>
                  Our website is not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If you believe we have collected 
                  information from a child under 13, please contact us immediately.
                </p>

                <h2>Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  You are advised to review this Privacy Policy periodically for any changes.
                </p>

                <h2>Contact Information</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please contact us:
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

export default PrivacyPolicy;
