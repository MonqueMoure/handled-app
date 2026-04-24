import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Legal.module.css';

const Privacy = () => {
  return (
    <div style={{ background: '#0a0a0a' }}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLogo}>HANDLED.</Link>
        <Link to="/" className={styles.navBack}>← Back to home</Link>
      </nav>

      <div className={styles.container}>
        <span className={styles.docLabel}>Legal</span>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: April 2026</p>

        <div className={styles.highlight}>
          <p>Your privacy matters to us. This policy explains what information we collect, how we use it, and how we protect it. We will never sell your personal information.</p>
        </div>

        <h2 className={styles.h2}>1. Who We Are</h2>
        <p className={styles.p}>HANDLED. is a subscription-based sales training application for life insurance agents, operated from Long Beach, California. When we say "HANDLED.," "we," "us," or "our" in this policy, we mean the HANDLED. platform and its operator.</p>
        <p className={styles.p}>If you have any questions about this Privacy Policy, contact us at <a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a>.</p>

        <h2 className={styles.h2}>2. Information We Collect</h2>
        <p className={styles.p}>We collect the following types of information when you use HANDLED.:</p>

        <p className={styles.p}><strong style={{ color: '#f0ece3' }}>Information you provide directly:</strong></p>
        <ul className={styles.ul}>
          <li className={styles.li}>Email address and password when you create an account</li>
          <li className={styles.li}>Payment information processed securely through Stripe (we never store your full card details)</li>
          <li className={styles.li}>Personal notes you write within the app on individual objections</li>
          <li className={styles.li}>Objections you mark as favorites</li>
          <li className={styles.li}>Objections you type into the AI Coach feature</li>
        </ul>

        <p className={styles.p}><strong style={{ color: '#f0ece3' }}>Information collected automatically:</strong></p>
        <ul className={styles.ul}>
          <li className={styles.li}>Device type and browser information</li>
          <li className={styles.li}>IP address and general location</li>
          <li className={styles.li}>Pages visited and features used within the app</li>
          <li className={styles.li}>Date and time of access</li>
        </ul>

        <h2 className={styles.h2}>3. How We Use Your Information</h2>
        <p className={styles.p}>We use the information we collect to:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>Create and manage your account</li>
          <li className={styles.li}>Process and manage your subscription payments</li>
          <li className={styles.li}>Sync your personal notes and favorites across your devices</li>
          <li className={styles.li}>Provide and improve the AI Coach feature</li>
          <li className={styles.li}>Send important account and service updates</li>
          <li className={styles.li}>Respond to your support requests</li>
          <li className={styles.li}>Analyze usage patterns to improve the app</li>
          <li className={styles.li}>Comply with legal obligations</li>
        </ul>

        <h2 className={styles.h2}>4. How We Share Your Information</h2>
        <p className={styles.p}>We do not sell your personal information. We share your information only with the following trusted service providers who help us operate the platform:</p>
        <ul className={styles.ul}>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Clerk</strong> — handles account authentication and user management</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Stripe</strong> — processes subscription payments securely</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Supabase</strong> — stores your personal notes and favorites in a secure database</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Anthropic</strong> — powers the AI Coach feature (objections you type are processed by their API)</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Vercel</strong> — hosts the application</li>
        </ul>
        <p className={styles.p}>Each of these providers has their own privacy policy and security practices. We only share the minimum information necessary for them to perform their function.</p>
        <p className={styles.p}>We may also disclose your information if required by law, court order, or to protect the rights and safety of HANDLED. or others.</p>

        <h2 className={styles.h2}>5. Data Storage and Security</h2>
        <p className={styles.p}>Your personal notes and favorites are stored securely in Supabase's database infrastructure, hosted in the United States. Your account credentials are managed by Clerk, which uses industry-standard encryption and security practices.</p>
        <p className={styles.p}>We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, or misuse. However, no system is completely secure and we cannot guarantee absolute security.</p>

        <h2 className={styles.h2}>6. AI Coach Data</h2>
        <p className={styles.p}>When you use the AI Coach feature, the objection text you enter is sent to Anthropic's API to generate a response. Anthropic processes this data according to their own privacy policy. We do not permanently store AI Coach inputs or outputs on our servers beyond your current session, though Anthropic may retain data according to their policies.</p>
        <p className={styles.p}>Please do not enter personally identifiable information about your prospects into the AI Coach feature.</p>

        <h2 className={styles.h2}>7. Your Rights and Choices</h2>
        <p className={styles.p}>You have the following rights regarding your personal information:</p>
        <ul className={styles.ul}>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Access:</strong> You can view the personal notes and favorites stored in your account at any time within the app</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Correction:</strong> You can update or delete your personal notes at any time</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Deletion:</strong> You can request deletion of your account and associated data by emailing hello@handled.coach</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Cancellation:</strong> You can cancel your subscription at any time through your account settings</li>
        </ul>
        <p className={styles.p}>California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected and the right to request deletion. To exercise these rights, contact us at <a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a>.</p>

        <h2 className={styles.h2}>8. Cookies</h2>
        <p className={styles.p}>HANDLED. uses essential cookies and similar technologies to keep you logged in and maintain your session. We do not use advertising cookies or third-party tracking cookies. You can control cookies through your browser settings, though disabling essential cookies may affect your ability to use the service.</p>

        <h2 className={styles.h2}>9. Children's Privacy</h2>
        <p className={styles.p}>HANDLED. is intended for adults aged 18 and older. We do not knowingly collect personal information from children under 18. If you believe a child has provided us with personal information, please contact us immediately at <a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a>.</p>

        <h2 className={styles.h2}>10. Changes to This Policy</h2>
        <p className={styles.p}>We may update this Privacy Policy from time to time. We will notify you of material changes by email and by posting the updated policy on this page with a new "Last updated" date. Your continued use of HANDLED. after changes take effect constitutes your acceptance of the updated policy.</p>

        <h2 className={styles.h2}>11. Contact Us</h2>
        <p className={styles.p}>If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:</p>
        <p className={styles.p}><a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a></p>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerLogo}>HANDLED.</span>
        <div className={styles.footerLinks}>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/refunds">Refund Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
