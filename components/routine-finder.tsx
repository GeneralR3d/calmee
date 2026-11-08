"use client";

import Link from 'next/link';
import { useState } from 'react';
import { routines, type RoutineKey } from '@/lib/routines';
import { byHandle } from '@/lib/products';
import { money } from '@/lib/cart';
import { emit } from '@/lib/analytics';
import { useStore } from './store-provider';

const options: { key: RoutineKey; title: string; text: string }[] = [
  { key: 'flare', title: 'Flaring now', text: 'Hot, red, itchy or tight patches.' },
  { key: 'dry', title: 'Dry and tight', text: 'Uncomfortable after washing.' },
  { key: 'texture', title: 'Calm, but rough', text: 'Ready for a gentle acid or retinol.' },
  { key: 'new', title: 'Just curious', text: 'Try before you commit.' },
];
export function RoutineFinder() {
  const [selected, setSelected] = useState<RoutineKey>('dry');
  const { add, ready } = useStore();
  const routine = routines[selected];
  const picks = routine.buy.map(handle => byHandle[handle]);
  const total = picks.reduce((sum, p) => sum + p.variants[0].price, 0);
  return <section className="band grey" id="c-routine" aria-labelledby="c-rb-h"><div className="wrap">
    <div className="sec-intro"><p className="eyebrow">Routine Finder</p><h2 className="h-lg" id="c-rb-h">Which routine is right for you?</h2><p>Tell us how your skin feels today. We&apos;ll lay out a morning and evening routine from the Calme range.</p></div>
    <div className="rb-opts" role="radiogroup" aria-label="How your skin feels today">{options.map(option => <label key={option.key}><input type="radio" name="c-skin" value={option.key} checked={selected === option.key} onChange={() => { setSelected(option.key); emit('routine_result', { concern: option.key }); }} /><b>{option.title}</b><span>{option.text}</span></label>)}</div>
    <div className="rb-out" aria-live="polite"><p className="rb-note">{routine.note}</p>
      <div className="rb-cols">{[['Morning', routine.am], ['Evening', routine.pm]].map(([title, steps]) => <div className="rb-col" key={title as string}><h3>{title as string}</h3><ol>{(steps as string[][]).map(([handle, note], index) => <li key={`${handle}-${index}`}><span><Link href={`/products/${handle}`}>{byHandle[handle].title}</Link><small>{note}</small></span></li>)}</ol></div>)}</div>
      <div className="rb-picks">{picks.map(p => <Link className="rb-pick" href={`/products/${p.handle}`} key={p.handle}><img src={p.image} alt="" width="60" height="60" /><span><b>{p.title}</b><br />{money(p.variants[0].price)}{p.variants.length > 1 ? ` · ${p.variants[0].title}` : ''}</span></Link>)}</div>
      <div className="rb-foot"><span className="rb-total">{money(total)} <span className="muted" style={{ fontSize: 14, fontWeight: 400 }}>for {picks.length} {picks.length === 1 ? 'item' : 'items'}</span></span><button className="pill solid" disabled={!ready} onClick={() => add(picks.map(p => ({ id: p.variants[0].id, qty: 1 })), 'Routine added to bag')}>Add Routine to Bag</button></div>
    </div>
  </div></section>;
}
