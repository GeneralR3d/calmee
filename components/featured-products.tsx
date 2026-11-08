import Link from "next/link";
import { AddToBag } from "./store-provider";
export function FeaturedProducts() { return (
<section className="tiles" aria-label="Featured products">
  <div className="tile">
    <h2>Ceramide Recovery Serum</h2>
    <p className="sub">Rebuild what your barrier is missing.</p>
    <div className="cta-row"><AddToBag className="pill solid sm" handle="ceramide-recovery-serum">Buy</AddToBag><Link className="pill sm" href="/products/ceramide-recovery-serum">Learn more</Link></div>
    <img src="/img/ceramide-recovery-serum.webp" loading="lazy" decoding="async" width="800" height="800" alt="Ceramide Recovery Serum glass dropper bottle" />
  </div>
  <div className="tile" id="c-kit">
    <h2>Discovery Kit</h2>
    <p className="sub">Try the routine for 14 days.</p>
    <p className="price-note"><span id="c-kit-price">S$19</span>, with S$19 back on your first full-size order.</p>
    <div className="cta-row"><AddToBag className="pill solid sm" handle="discovery-kit">Buy</AddToBag><Link className="pill sm" href="/products/discovery-kit">What&apos;s inside</Link></div>
    <img src="/img/discovery-kit.webp" loading="lazy" decoding="async" width="800" height="800" alt="Five Calme travel-size products" />
  </div>
  <div className="tile">
    <h2>Barrier Repair Cream</h2>
    <p className="sub">Seal it in, within three minutes.</p>
    <div className="cta-row"><Link className="pill solid sm" href="/products/barrier-repair-cream">Buy</Link><Link className="pill sm" href="/products/barrier-repair-cream">Learn more</Link></div>
    <img src="/img/barrier-repair-cream-50ml.webp" loading="lazy" decoding="async" width="800" height="800" alt="Barrier Repair Cream jar" />
  </div>
  <div className="tile">
    <h2>Centella Calming Serum</h2>
    <p className="sub">For the hot, red days.</p>
    <div className="cta-row"><AddToBag className="pill solid sm" handle="centella-calming-serum">Buy</AddToBag><Link className="pill sm" href="/products/centella-calming-serum">Learn more</Link></div>
    <img src="/img/centella-calming-serum.webp" loading="lazy" decoding="async" width="800" height="800" alt="Centella Calming Serum glass dropper bottle" />
  </div>
</section>
); }
