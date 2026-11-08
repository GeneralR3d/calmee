"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { config } from '@/lib/config';

export function WhatsAppSupport() {
  const [open, setOpen] = useState(false);
  const [demoClicked, setDemoClicked] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const businessUrl = /^https:\/\/wa\.me\//.test(config.whatsappUrl) ? config.whatsappUrl : '';

  const close = () => { setOpen(false); launcher.current?.focus(); };

  useEffect(() => { setOpen(false); setDemoClicked(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); launcher.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissEscape);
    };
  }, [open]);

  return <div className="whatsapp-support" ref={root}>
    {open && <section className="whatsapp-panel" id="whatsapp-panel" aria-labelledby="whatsapp-heading">
      <div className="whatsapp-panel-heading">
        <h2 id="whatsapp-heading">Contact Le Calme</h2>
        <button ref={closeButton} className="icon-btn" type="button" aria-label="Close support panel" onClick={close}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </div>
      <p>For enquiries and support, contact Le Calme on WhatsApp Business.</p>
      {businessUrl ? <a className="pill whatsapp-action" href={businessUrl} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        : <button className="pill whatsapp-action" type="button" onClick={() => setDemoClicked(true)}>Chat on WhatsApp (demo)</button>}
      {!businessUrl && <p className="whatsapp-demo" role="status">{demoClicked ? 'This contact link is a placeholder. No message has been sent. WhatsApp Business support will be available when a business link is added.' : 'Demo contact link — no message will be sent.'}</p>}
    </section>}
    <button ref={launcher} className="whatsapp-launcher" type="button" aria-label={open ? 'Close WhatsApp support' : 'Open WhatsApp support'} aria-expanded={open} aria-controls="whatsapp-panel" onClick={() => { if (open) close(); else { setDemoClicked(false); setOpen(true); } }}>
      <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.6 4.2 1.6 6L.1 24l6.2-1.6a11.8 11.8 0 0 0 5.7 1.5h.1c6.5 0 11.9-5.3 11.9-11.9 0-3.2-1.3-6.2-3.5-8.5ZM12.1 21.9a9.9 9.9 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 0 1-1.5-5.3C2.2 6.5 6.6 2 12.1 2c2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.5 10-9.9 10Zm5.4-7.4c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z" /></svg>
    </button>
  </div>;
}
