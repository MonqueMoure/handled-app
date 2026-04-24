import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Legal.module.css';

const Terms = () => {
  return (
    <div style={{ background: '#0a0a0a' }}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLogo}>HANDLED.</Link>
        <Link to="/" className={styles.navBack}>← Back to home</Link>
      </nav>

      <div className={styles.container}>
        <span className={styles.docLabel}>Legal</span>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: April 2026</p>

        <div className={styles.highlight}>
          <p>Please read these Terms of Service carefully before using HANDLED. By accessing or using our service, you agree to be bound by these terms.</p>
        </div>

        <h2 className={styles.h2}>1. About HANDLED.</h2>
        <p className={styles.p}>HANDLED. ("we," "us," or "our") is a subscription-based sales training application designed for life insurance agents. The app provides objection handling resources, response scripts, study tools, quiz modes, and an AI-powered coaching feature to help agents improve their sales effectiveness.</p>
        <p className={styles.p}>HANDLED. is operated by its founder and is headquartered in Long Beach, California.</p>

        <h2 className={styles.h2}>2. Acceptance of Terms</h2>
        <p className={styles.p}>By creating an account, subscribing to our service, or using any part of the HANDLED. platform, you agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.</p>
        <p className={styles.p}>You must be at least 18 years old to use HANDLED. By using the service, you represent that you meet this requirement.</p>

        <h2 className={styles.h2}>3. Subscriptions and Billing</h2>
        <p className={styles.p}>HANDLED. offers the following subscription plans:</p>
        <ul className={styles.ul}>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Monthly Plan:</strong> $14.99 per month, billed monthly</li>
          <li className={styles.li}><strong style={{ color: '#f0ece3' }}>Annual Plan:</strong> $99.00 per year, billed annually</li>
        </ul>
        <p className={styles.p}>All subscriptions are processed securely through Stripe. By subscribing, you authorize HANDLED. to charge your payment method on a recurring basis according to your chosen plan until you cancel.</p>
        <p className={styles.p}>Subscription fees are charged at the beginning of each billing period. You will not receive a refund for the current billing period if you cancel mid-cycle, but you will retain access through the end of your paid period.</p>
        <p className={styles.p}>We reserve the right to change subscription pricing with 30 days advance notice to existing subscribers.</p>

        <h2 className={styles.h2}>4. Account Registration</h2>
        <p className={styles.p}>To access HANDLED., you must create an account through our authentication system powered by Clerk. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.</p>
        <p className={styles.p}>You agree to provide accurate and complete information when creating your account and to update that information as necessary. You may not share your account with others or allow others to access the service using your credentials.</p>

        <h2 className={styles.h2}>5. Permitted Use</h2>
        <p className={styles.p}>HANDLED. grants you a limited, non-exclusive, non-transferable license to access and use the service for your personal professional development as a licensed or aspiring insurance agent.</p>
        <p className={styles.p}>You may not:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>Copy, reproduce, screenshot, or distribute the objection library or any content from HANDLED. for commercial purposes</li>
          <li className={styles.li}>Share your login credentials with others</li>
          <li className={styles.li}>Use the service to train AI systems or compile competitive datasets</li>
          <li className={styles.li}>Attempt to reverse engineer, scrape, or extract the content of the platform</li>
          <li className={styles.li}>Use the service for any unlawful purpose</li>
        </ul>

        <h2 className={styles.h2}>6. Intellectual Property</h2>
        <p className={styles.p}>All content within HANDLED. — including but not limited to objection responses, psychological frameworks, coaching scripts, AI-generated responses, brand identity, and design — is the intellectual property of HANDLED. and is protected by copyright law.</p>
        <p className={styles.p}>Your subscription grants you access to use this content for personal professional development only. It does not grant you any ownership rights or the right to reproduce, distribute, or commercially exploit any content from the platform.</p>

        <h2 className={styles.h2}>7. AI Coach Feature</h2>
        <p className={styles.p}>HANDLED. includes an AI Coach feature powered by Anthropic's Claude API. This feature generates sales coaching responses based on user input. Please be aware that:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>AI-generated responses are for educational and training purposes only</li>
          <li className={styles.li}>AI responses should not be construed as legal, financial, or professional advice</li>
          <li className={styles.li}>HANDLED. is not responsible for outcomes resulting from the use of AI Coach responses in real sales situations</li>
          <li className={styles.li}>AI responses may occasionally be inaccurate or inappropriate — always use professional judgment</li>
        </ul>

        <h2 className={styles.h2}>8. Disclaimers</h2>
        <p className={styles.p}>HANDLED. is a sales training tool. It is not a licensed insurance provider, financial advisor, or legal counsel. The objection responses and coaching content provided are for educational purposes and represent general best practices in sales — they are not guarantees of sales success.</p>
        <p className={styles.p}>Results will vary based on individual skill, market conditions, carrier guidelines, and other factors outside our control. HANDLED. makes no warranties about income outcomes or sales performance.</p>

        <h2 className={styles.h2}>9. Limitation of Liability</h2>
        <p className={styles.p}>To the maximum extent permitted by law, HANDLED. shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to lost profits, lost sales, or business interruption.</p>
        <p className={styles.p}>Our total liability to you for any claims arising from these terms or your use of the service shall not exceed the amount you paid to us in the three months preceding the claim.</p>

        <h2 className={styles.h2}>10. Cancellation</h2>
        <p className={styles.p}>You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period. You will retain access to HANDLED. through the end of your paid period.</p>
        <p className={styles.p}>We reserve the right to suspend or terminate accounts that violate these Terms of Service without refund.</p>

        <h2 className={styles.h2}>11. Changes to These Terms</h2>
        <p className={styles.p}>We may update these Terms of Service from time to time. We will notify active subscribers of material changes via email at least 14 days before they take effect. Your continued use of HANDLED. after changes take effect constitutes your acceptance of the updated terms.</p>

        <h2 className={styles.h2}>12. Governing Law</h2>
        <p className={styles.p}>These Terms of Service are governed by the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of Los Angeles County, California.</p>

        <h2 className={styles.h2}>13. Contact Us</h2>
        <p className={styles.p}>If you have any questions about these Terms of Service, please contact us at:</p>
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

export default Terms;
