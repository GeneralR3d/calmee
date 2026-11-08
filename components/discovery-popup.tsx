"use client";

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { emit } from '@/lib/analytics';
import { readStorage, writeStorage } from '@/lib/storage';
import styles from './discovery-popup.module.css';

const seenKey = 'calme-discovery-offer-seen';

export function DiscoveryPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const continueButton = useRef<HTMLButtonElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (readStorage(seenKey) === true) return;
    const popup = dialog.current;
    let timer: ReturnType<typeof setTimeout>;
    const open = () => {
      if (!popup?.isConnected || readStorage(seenKey) === true) return;
      // Let visitors finish another dialog before showing the offer.
      if (document.hidden || document.querySelector('dialog[open]')) {
        timer = setTimeout(open, 500);
        return;
      }
      popup.showModal();
      writeStorage(seenKey, true);
    };
    timer = setTimeout(open, 10000);
    return () => { clearTimeout(timer); popup?.close(); };
  }, []);

  useEffect(() => { if (submitted) continueButton.current?.focus(); }, [submitted]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Match the storefront's demo newsletter: never persist or transmit the email.
    emit('lead', { method: 'discovery_kit_popup', demo: true });
    event.currentTarget.reset();
    setSubmitted(true);
  };

  return <dialog ref={dialog} className={styles.popup} aria-labelledby="discovery-heading" aria-describedby="discovery-description"
    onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <button className={styles.close} type="button" aria-label="Close discovery offer" onClick={() => dialog.current?.close()}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M18 6 6 18" /></svg>
    </button>
    <div className={styles.layout}>
      <div className={styles.image}>
        <img src="/img/discovery-kit.webp" width="800" height="800" loading="lazy" decoding="async" alt="Five Le Calme travel-size skincare products in the Discovery Kit" />
      </div>
      <div className={styles.content}>
        <h2 id="discovery-heading">Your free Discovery Kit</h2>
        {submitted ? <>
          <p id="discovery-description" role="status">Thanks for trying our demo signup. No email has been sent or kit reserved.</p>
          <button ref={continueButton} className="pill solid" type="button" onClick={() => dialog.current?.close()}>Continue exploring</button>
        </> : <>
          <p id="discovery-description">A little introduction to calmer care. Leave your email for a free Discovery Kit and find your gentle favourites.</p>
          <form className={styles.form} onSubmit={submit}>
            <label htmlFor="discovery-email">Email address</label>
            <input id="discovery-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            <button className="pill solid" type="submit">Get my free discovery kit</button>
          </form>
          <p className={styles.note}>By signing up, you agree to receive emails from Le Calme. Unsubscribe any time.</p>
          <p className={styles.note}>Demo signup only. No emails are sent or kits reserved.</p>
          <button className={styles.dismiss} type="button" onClick={() => dialog.current?.close()}>No thanks, I’ll keep exploring</button>
        </>}
      </div>
    </div>
  </dialog>;
}
