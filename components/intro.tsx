"use client";
import { emit } from "@/lib/analytics";
import { useEffect } from "react";
import { mountIntro } from "@/lib/intro-animation";
export function Intro() {
useEffect(() => mountIntro(), []);
return (
<section className="intro" id="c-intro" aria-label="Introducing Calme">
  <div className="intro-stick">
    <canvas id="c-3d" aria-hidden="true"></canvas>
    <div className="beats">
      <div className="beat center" data-beat="0">
        <p className="eyebrow">Introducing Calme</p>
        <h2 className="h-xl">Skincare for skin that reacts.</h2>
        <p className="sub muted">Fragrance-free, barrier-first care for eczema-prone skin, made in Singapore.</p>
        <p className="cue" aria-hidden="true">Scroll to see how it works <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg></p>
      </div>
      <div className="beat" data-beat="1"><p className="eyebrow">The skin barrier</p><h2>Healthy skin holds on to water.</h2><p>The top layer of skin is a seal of flattened cells. Beneath it, water and lipids keep skin cushioned, supple and calm.</p></div>
      <div className="beat" data-beat="2"><p className="eyebrow">Eczema-prone skin</p><h2>When the barrier cracks, moisture escapes.</h2><p>Gaps open between skin cells. Water drains away and irritants <span className="dot irr"></span> like sweat and fragrance get in, so skin turns tight, hot and itchy.</p></div>
      <div className="beat" data-beat="3"><p className="eyebrow">What Calme does</p><h2>Calme helps seal it back.</h2><p>Ceramides, cholesterol and fatty acids in a 3:1:1 ratio, the same ratio healthy skin uses, fill the gaps so skin can hold water again.</p></div>
      <div className="beat center" data-beat="4"><p className="eyebrow">Barrier-first skincare</p><h2 className="h-xl">This is Calme.</h2></div>
    </div>
    <a className="skip" href="#c-hero" id="c-skip" onClick={() => emit("intro_skip")}>Skip intro</a>
    <div className="progress" aria-hidden="true"><i></i></div>
  </div>
</section>
);
}
