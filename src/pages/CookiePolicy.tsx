import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Cookie Policy"
        description="Learn about the cookies and tracking technologies used on No More Enabling, including analytics cookies, advertising cookies, and localStorage preferences."
        canonicalUrl="https://nomoreenabling.com/cookies"
        keywords="cookie policy, cookies, tracking, analytics, advertising, local storage"
      />
      <Header />
      
      <main className="flex-grow" role="main">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Cookie Policy
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                How we use cookies and similar technologies on our website
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Last updated: February 26, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                
                <h2>What Are Cookies?</h2>
                <p>
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                  when you visit a website. They help websites remember information about your visit, such 
                  as your preferences and actions, which can make your next visit easier and the site more 
                  useful to you.
                </p>

                <h2>How We Use Cookies</h2>
                <p>
                  No More Enabling uses cookies and similar technologies to improve your browsing experience, 
                  analyze website traffic, and provide relevant content and advertisements. We use both 
                  first-party cookies (set by us) and third-party cookies (set by other companies).
                </p>

                <h2>Types of Cookies We Use</h2>

                <h3>Essential Cookies</h3>
                <p>
                  These cookies are necessary for the website to function properly and cannot be disabled 
                  in our systems. They are usually only set in response to actions made by you which 
                  amount to a request for services.
                </p>
                <ul>
                  <li><strong>Session cookies:</strong> Keep you logged in and remember your preferences during your visit</li>
                  <li><strong>Security cookies:</strong> Help protect against fraudulent use of login credentials</li>
                </ul>

                <h3>Analytics Cookies</h3>
                <p>
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. We use Google Analytics to track:
                </p>
                <ul>
                  <li>Pages visited and time spent on each page</li>
                  <li>How you found our website</li>
                  <li>Which content is most popular</li>
                  <li>General geographic location (country/city level)</li>
                  <li>Browser and device information</li>
                </ul>

                <h3>Advertising Cookies</h3>
                <p>
                  These cookies are set by our advertising partners (including BetterHelp and other third-party 
                  advertisers) and may be used to build a profile of your interests and show you relevant 
                  advertisements on other websites. They work by uniquely identifying your browser and device.
                </p>
                <ul>
                  <li>Retargeting pixels to show relevant ads on other websites</li>
                  <li>Conversion tracking to measure ad effectiveness</li>
                  <li>Interest-based advertising based on your browsing behavior</li>
                </ul>

                <h3>Functionality Cookies</h3>
                <p>
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences and settings.
                </p>
                <ul>
                  <li>Dark/light mode preferences</li>
                  <li>Font size and accessibility settings</li>
                  <li>Newsletter subscription preferences</li>
                </ul>

                <h2>Local Storage and Similar Technologies</h2>
                <p>
                  In addition to cookies, we also use local storage and session storage to store certain 
                  information locally on your device:
                </p>
                <ul>
                  <li><strong>Local Storage:</strong> Saves your preferences (like theme settings) between visits</li>
                  <li><strong>Session Storage:</strong> Temporarily stores information during your browsing session</li>
                  <li><strong>Web Beacons:</strong> Small transparent images used to track email opens in our newsletters</li>
                </ul>

                <h2>Third-Party Cookies</h2>
                <p>Some of our pages contain content from third-party services that may set their own cookies:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                  <li><strong>Google Tag Manager:</strong> Managing marketing and analytics tags</li>
                  <li><strong>Social Media Platforms:</strong> If you share our content on social media</li>
                  <li><strong>Advertising Networks:</strong> Various ad partners for targeted advertising</li>
                  <li><strong>YouTube/Vimeo:</strong> Video content embedding (if applicable)</li>
                </ul>

                <h2>Managing Your Cookie Preferences</h2>
                
                <h3>Browser Settings</h3>
                <p>
                  You can control and manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul>
                  <li>View which cookies are stored on your device</li>
                  <li>Delete cookies individually or all at once</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block third-party cookies</li>
                  <li>Set your browser to notify you when cookies are being set</li>
                </ul>

                <h3>Browser-Specific Instructions</h3>
                <ul>
                  <li><strong>Chrome:</strong> Settings > Privacy and security > Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Settings > Privacy & Security > Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences > Privacy > Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings > Cookies and site permissions > Cookies and site data</li>
                </ul>

                <h3>Opt-Out Tools</h3>
                <p>You can also opt out of certain tracking:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> Use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                  <li><strong>Advertising cookies:</strong> Visit <a href="http://optout.aboutads.info/" target="_blank" rel="noopener" className="text-primary hover:underline">Digital Advertising Alliance</a> or <a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener" className="text-primary hover:underline">Network Advertising Initiative</a></li>
                </ul>

                <h2>Impact of Disabling Cookies</h2>
                <p>
                  If you choose to disable cookies, some features of our website may not function properly:
                </p>
                <ul>
                  <li>Your preferences may not be saved between visits</li>
                  <li>Some pages may load more slowly</li>
                  <li>You may see less relevant advertising</li>
                  <li>Analytics data may be incomplete</li>
                </ul>
                <p>
                  Essential cookies cannot be disabled as they are necessary for the website to function.
                </p>

                <h2>Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in technology, 
                  legislation, or our practices. We will notify you of any significant changes by 
                  updating the "Last updated" date at the top of this policy.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Cookie Policy or our use of cookies, please contact us:
                </p>
                <ul>
                  <li><strong>Email:</strong> matt@nomoreenabling.com</li>
                  <li><strong>Company:</strong> No More Enabling</li>
                </ul>

                <h2>Related Policies</h2>
                <p>
                  For more information about how we handle your personal data, please see our:
                </p>
                <ul>
                  <li><a href="/privacy" className="text-primary hover:underline">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-primary hover:underline">Terms of Service</a></li>
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

export default CookiePolicy;