import Link from "next/link";
import { AddToBag } from "./store-provider";
export function Hero() { return (
<section className="hero" id="c-hero" aria-labelledby="c-hero-h">
  <div className="wrap">
    <p className="eyebrow">For eczema-prone skin</p>
    <h1 className="h-xl" id="c-hero-h">Barrier Reset Routine</h1>
    <p className="sub">Calm, from the barrier up.</p>
    <div className="cta-row">
      <AddToBag className="pill solid" handle="barrier-reset-routine">Buy</AddToBag>
      <Link className="pill" href="/products/barrier-reset-routine">Learn more</Link>
    </div>
    <p className="hero-note">Four fragrance-free steps. S$128, or S$16 less than buying separately.</p>
  </div>
  <img className="hero-img" src="/img/hero-routine.webp" loading="lazy" decoding="async" width="1600" height="800" alt="Barrier Cleansing Oil, Gentle Cream Cleanser, Ceramide Recovery Serum and Barrier Repair Cream in Calme frosted glass bottles" />
  <ul className="trust wrap" aria-label="Shopping with Calme">
    <li><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"></path><circle cx="7" cy="17.5" r="1.5"></circle><circle cx="17" cy="17.5" r="1.5"></circle></svg><span><b>Free delivery over S$60</b>1 to 2 working days in Singapore</span></li>
    <li><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="6" width="18" height="13" rx="2"></rect><path d="M3 10h18M7 15h4"></path></svg><span><b>PayNow or bank transfer</b>Try our demo checkout</span></li>
    <li><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3c4 4.5 6.5 8 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 11 8 7.5 12 3z"></path><path d="M5 5l14 14"></path></svg><span><b>Fragrance-free, every product</b>No essential oils or drying alcohol</span></li>
    <li><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 12l5 5L20 6"></path></svg><span><b>Try first for S$19</b>Five minis, S$19 back later</span></li>
  </ul>
</section>
); }
