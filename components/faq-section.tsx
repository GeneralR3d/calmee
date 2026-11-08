import { PrivacyButton, CookieButton } from "./store-provider";
export function FaqSection() { return (
<section className="band grey" id="c-faq" aria-labelledby="c-faq-h">
  <div className="wrap">
    <div className="sec-intro"><h2 className="h-lg" id="c-faq-h">Questions? Answers.</h2></div>
    <div className="faq">
      <details open><summary>Will Calme treat my eczema?</summary><p>No skincare can promise that. Calme supports a healthy skin barrier and comforts dryness. Keep using anything your doctor prescribes, and see a doctor for flare-ups that don&apos;t settle.</p></details>
      <details><summary>Can I use acids and retinol on eczema-prone skin?</summary><p>Only when skin is calm. Use PHA Gentle Exfoliant and Night Renew Retinol on two evenings a week each, never on the same night and never during a flare. Patch test first.</p></details>
      <details><summary>How do I pay?</summary><p>PayNow or bank transfer at checkout. We ship as soon as payment is confirmed.</p></details>
      <details><summary>How fast is delivery?</summary><p>1 to 2 working days in Singapore. Free on orders over S$60, otherwise S$4.90.</p></details>
      <details><summary>How does the S$19 Discovery Kit voucher work?</summary><p>Every kit includes a code for S$19 off your first full-size order of S$38 or more, valid for 60 days.</p></details>
      <details><summary>What does Calme do with my data?</summary><p>We use your details to deliver orders and, if you subscribe, to send routine tips. With your permission we also use cookies to measure our ads on Instagram, Facebook and TikTok. <PrivacyButton>Read the privacy notice</PrivacyButton> or <CookieButton>change cookie choices</CookieButton>.</p></details>
    </div>
  </div>
</section>
); }
