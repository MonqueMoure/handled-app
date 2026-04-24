import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Legal.module.css';

const Refunds = () => {
  return (
    <div style={{ background: '#0a0a0a' }}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLogo}>HANDLED.</Link>
        <Link to="/" className={styles.navBack}>← Back to home</Link>
      </nav>

      <div className={styles.container}>
        <span className={styles.docLabel}>Legal</span>
        <h1 className={styles.title}>Refund Policy</h1>
        <p className={styles.lastUpdated}>Last updated: April 2026</p>

        <div className={styles.highlight}>
          <p>We want you to feel confident subscribing to HANDLED. This policy outlines exactly when and how refunds are handled — no fine print, no runaround.</p>
        </div>

        <h2 className={styles.h2}>Our General Policy</h2>
        <p className={styles.p}>Because HANDLED. provides immediate access to digital content upon subscription, we generally do not offer refunds for completed billing periods. When you subscribe, you gain instant access to the full objection library, all study modes, and the AI Coach — and that access begins immediately.</p>
        <p className={styles.p}>That said, we believe in fairness and we review refund requests on a case-by-case basis with your satisfaction genuinely in mind.</p>

        <h2 className={styles.h2}>7-Day Satisfaction Window</h2>
        <p className={styles.p}>If you subscribe to HANDLED. and feel within the first 7 days that it is not right for you, contact us at <a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a> and we will issue a full refund — no questions asked.</p>
        <p className={styles.p}>This 7-day window applies to your first subscription period only and is available once per customer.</p>

        <h2 className={styles.h2}>Common Scenarios</h2>

        <div className={styles.scenario}>
          <p className={styles.scenarioTitle}>Monthly Subscriber — Cancels Mid-Month</p>
          <p>You will retain access through the end of your current billing period. No partial refund is issued for unused days. Your subscription will not renew after cancellation.</p>
        </div>

        <div className={styles.scenario}>
          <p className={styles.scenarioTitle}>Annual Subscriber — Cancels Mid-Year</p>
          <p>You will retain access through the end of your annual period. We do not issue prorated refunds for the unused portion of an annual subscription unless you are within the 7-day satisfaction window or there are exceptional circumstances.</p>
        </div>

        <div className={styles.scenario}>
          <p className={styles.scenarioTitle}>Charged After Cancellation</p>
          <p>If you were charged after properly canceling your subscription, contact us immediately at <a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a>. We will investigate and issue a full refund for any erroneous charges within 5 business days.</p>
        </div>

        <div className={styles.scenario}>
          <p className={styles.scenarioTitle}>Technical Issues Prevented Access</p>
          <p>If a verified technical issue on our end prevented you from accessing the service for a significant portion of your billing period, we will offer either a prorated refund or an extended subscription period at our discretion.</p>
        </div>

        <div className={styles.scenario}>
          <p className={styles.scenarioTitle}>Duplicate Charges</p>
          <p>If you were charged more than once for the same billing period, contact us at <a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a> and we will refund the duplicate charge immediately.</p>
        </div>

        <h2 className={styles.h2}>How to Request a Refund</h2>
        <p className={styles.p}>To request a refund, email us at <a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a> with the following information:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>The email address associated with your HANDLED. account</li>
          <li className={styles.li}>The date of the charge you are requesting a refund for</li>
          <li className={styles.li}>A brief description of the reason for your request</li>
        </ul>
        <p className={styles.p}>We respond to all refund requests within 2 business days. Approved refunds are processed through Stripe and typically appear on your statement within 5–10 business days depending on your bank.</p>

        <h2 className={styles.h2}>Chargebacks</h2>
        <p className={styles.p}>We ask that you contact us directly before initiating a chargeback with your bank or card issuer. Most issues can be resolved quickly and directly. Chargebacks that are initiated without first contacting us may result in account suspension.</p>

        <h2 className={styles.h2}>Changes to This Policy</h2>
        <p className={styles.p}>We may update this Refund Policy from time to time. Any changes will be posted on this page with an updated date. For active subscribers, material changes will be communicated by email with at least 14 days notice.</p>

        <h2 className={styles.h2}>Contact Us</h2>
        <p className={styles.p}>Questions about a charge or refund? We're here to help.</p>
        <p className={styles.p}><a href="mailto:hello@handled.coach" className={styles.a}>hello@handled.coach</a></p>
        <p className={styles.p}>We typically respond within one business day.</p>
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

export default Refunds;
