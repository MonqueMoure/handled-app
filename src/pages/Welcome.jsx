import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.welcomeWrapper}>
            <div className={styles.content}>
                <h1 className={styles.headline}>
                    Every objection.<br />
                    Under control.
                </h1>
                
                <h2 className={styles.subheadline}>Welcome to HANDLED.</h2>
                
                <div className={styles.description}>
                    <p style={{ marginBottom: '24px' }}>You just gave yourself an unfair advantage.</p>
                    <p>From here, every objection you hear on a call has an answer waiting for you.</p>
                </div>

                <p className={styles.readyText}>
                    You're ready. Let's go.
                </p>

                <button 
                    className={styles.btnPrimary}
                    onClick={() => navigate('/dashboard')}
                >
                    Take me to the app
                </button>
            </div>
        </div>
    );
};

export default Welcome;
