import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landingWrapper}>
      {/* NAV */}
      <nav className={styles.landingNav}>
        <Link to="/" className={styles.navLogo}>HANDLED.</Link>
        <Link to="/dashboard" className={styles.navCta}>Get Access Now</Link>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>For Life Insurance Agents</p>
        <h1 className={styles.heroTitle}>HANDLED<span className={styles.heroPeriod}>.</span></h1>
        <p className={styles.heroTagline}>Every objection. Under control.</p>
        <p className={styles.heroDesc}>The app that gives you the exact words to say when a prospect pushes back — built by a salesperson, for salespeople.</p>
        <div className={styles.heroCtaGroup}>
          <Link to="/dashboard" className={styles.btnPrimary}>Get Access Now</Link>
          <a href="#how-it-works" className={styles.btnSecondary}>See how it works</a>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>100</span>
            <span className={styles.heroStatLabel}>Objections</span>
          </div>
          <div className={styles.heroStatDivider}></div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>13</span>
            <span className={styles.heroStatLabel}>Categories</span>
          </div>
          <div className={styles.heroStatDivider}></div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>4</span>
            <span className={styles.heroStatLabel}>Study Modes</span>
          </div>
          <div className={styles.heroStatDivider}></div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>AI</span>
            <span className={styles.heroStatLabel}>Coach Included</span>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={styles.section}>
        <span className={styles.sectionLabel}>The Problem</span>
        <h2 className={styles.sectionTitle}>You went blank.<br/>They got away.</h2>
        <p className={styles.sectionBody}>Most new agents learn objection handling the hard way — on live calls, in front of real prospects, with no script and no backup. A weekly team call and an Excel spreadsheet isn't training. It's hope.</p>

        <div className={styles.soundFamiliar}>
          <p className={styles.sfTitle}>Sound familiar?</p>
          <div className={styles.sfGrid}>
            <div className={styles.sfItem}>
              <span className={styles.sfQuote}>"</span>
              <span className={styles.sfText}>I need to think about it.</span>
            </div>
            <div className={styles.sfItem}>
              <span className={styles.sfQuote}>"</span>
              <span className={styles.sfText}>My spouse handles the finances.</span>
            </div>
            <div className={styles.sfItem}>
              <span className={styles.sfQuote}>"</span>
              <span className={styles.sfText}>I already have coverage through work.</span>
            </div>
            <div className={styles.sfItem}>
              <span className={styles.sfQuote}>"</span>
              <span className={styles.sfText}>It's too expensive right now.</span>
            </div>
            <div className={styles.sfItem}>
              <span className={styles.sfQuote}>"</span>
              <span className={styles.sfText}>I don't remember filling anything out.</span>
            </div>
            <div className={styles.sfItem}>
              <span className={styles.sfQuote}>"</span>
              <span className={styles.sfText}>Just give me the quote.</span>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className={styles.tickerSection}>
        <p className={styles.tickerLabel}>What's inside</p>
        <div style={{ overflow: 'hidden' }}>
          <div className={styles.tickerTrack}>
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span className={`${styles.tickerPill} ${styles.gold}`}>Price Objections</span>
                <span className={styles.tickerPill}>Delay Tactics</span>
                <span className={`${styles.tickerPill} ${styles.green}`}>Spouse Objections</span>
                <span className={styles.tickerPill}>Trust Issues</span>
                <span className={`${styles.tickerPill} ${styles.blue}`}>Skepticism</span>
                <span className={`${styles.tickerPill} ${styles.gold}`}>Urgency Plays</span>
                <span className={styles.tickerPill}>Health Concerns</span>
                <span className={`${styles.tickerPill} ${styles.green}`}>Confusion Closes</span>
                <span className={`${styles.tickerPill} ${styles.blue}`}>Comparison Handles</span>
                <span className={styles.tickerPill}>Process Objections</span>
                <span className={`${styles.tickerPill} ${styles.gold}`}>Self-Reliance</span>
                <span className={styles.tickerPill}>Product Questions</span>
                <span className={`${styles.tickerPill} ${styles.green}`}>No Need Pivots</span>
                <span className={`${styles.tickerPill} ${styles.blue}`}>AI Coach</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className={styles.appPreview} id="how-it-works">
        <div className={styles.appPreviewInner}>
          <span className={styles.sectionLabel}>How it works</span>
          <h2 className={styles.sectionTitle}>Four modes.<br/>One app. Zero hesitation.</h2>
          <div className={styles.modesGrid}>
            <div className={`${styles.modeCard} ${styles.study}`}>
              <span className={styles.modeIcon}>◎</span>
              <p className={styles.modeName}>Study</p>
              <p className={styles.modeDesc}>Deep dive into every objection. Learn the psychology behind why prospects say it, the exact words to say back, and what to do if they push further.</p>
            </div>
            <div className={`${styles.modeCard} ${styles.live}`}>
              <span className={styles.modeIcon}>●</span>
              <p className={styles.modeName}>Live</p>
              <p className={styles.modeDesc}>Prospect on the phone right now? Tap the objection you're hearing and get the response instantly. No scrolling. No fumbling. Just the answer.</p>
            </div>
            <div className={`${styles.modeCard} ${styles.quiz}`}>
              <span className={styles.modeIcon}>◈</span>
              <p className={styles.modeName}>Quiz</p>
              <p className={styles.modeDesc}>Flashcard-style practice that drills objection responses until they're second nature. Train before your shift. Get sharp. Stay sharp.</p>
            </div>
            <div className={`${styles.modeCard} ${styles.ai}`}>
              <span className={styles.modeIcon}>✦</span>
              <p className={styles.modeName}>AI Coach</p>
              <p className={styles.modeDesc}>Heard something that's not in the library? Type any objection and get an expert response with the psychology behind it — instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.pricingSection} id="pricing">
        <div className={styles.pricingInner}>
          <span className={styles.sectionLabel}>Pricing</span>
          <h2 className={styles.sectionTitle}>Simple, transparent pricing.<br/>Cancel anytime.</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <p className={styles.pricingPlan}>Monthly</p>
              <p className={styles.pricingPrice}>$14<span>.99/mo</span></p>
              <p className={styles.pricingPeriod}>Billed monthly</p>
              <div className={styles.pricingDivider}></div>
              <ul className={styles.pricingFeatures}>
                <li>All 100 objections + responses</li>
                <li>Study, Live, Quiz modes</li>
                <li>AI Coach — unlimited queries</li>
                <li>Personal notes per objection</li>
                <li>Favorites for quick access</li>
                <li>Cloud sync across devices</li>
              </ul>
              <Link to="/dashboard" className={`${styles.pricingBtn} ${styles.secondary}`}>Get Access Now</Link>
            </div>

            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <div className={styles.pricingBadge}>Best Value</div>
              <p className={styles.pricingPlan}>Annual</p>
              <p className={styles.pricingPrice}>$99<span>/yr</span></p>
              <p className={styles.pricingPeriod}>Billed annually</p>
              <p className={styles.pricingSavings}>Save $80.88 vs monthly</p>
              <div className={styles.pricingDivider}></div>
              <ul className={styles.pricingFeatures}>
                <li>Everything in Monthly</li>
                <li>All 100 objections + responses</li>
                <li>Study, Live, Quiz modes</li>
                <li>AI Coach — unlimited queries</li>
                <li>Personal notes per objection</li>
                <li>Favorites for quick access</li>
                <li>Cloud sync across devices</li>
                <li>All future objection updates</li>
              </ul>
              <Link to="/dashboard" className={`${styles.pricingBtn} ${styles.primary}`}>Get Access Now</Link>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--cream-faint)', marginTop: '28px', textAlign: 'center' }}>No contracts. No setup fees. Cancel anytime.</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>The next objection you hear — you'll be ready.</h2>
        <p className={styles.finalCtaSub}>Join agents who have stopped going blank on calls and started closing with confidence.</p>
        <Link to="/dashboard" className={styles.btnPrimary}>Get Access Now</Link>
      </section>

      {/* FOOTER */}
      <footer className={styles.landingFooter}>
        <div>
          <p className={styles.footerLogo}>HANDLED.</p>
          <p className={styles.footerTagline}>Every objection. Under control.</p>
        </div>
        <div className={styles.footerRight}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '8px', justifyContent: 'center' }}>
            <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none', fontSize: '12px' }}>Terms</Link>
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', fontSize: '12px' }}>Privacy</Link>
            <Link to="/refunds" style={{ color: 'inherit', textDecoration: 'none', fontSize: '12px' }}>Refunds</Link>
          </div>
          © 2026 HANDLED. · handled.coach
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
