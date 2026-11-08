export type RoutineKey = "flare" | "dry" | "texture" | "new";
export type Routine = { note: string; am: string[][]; pm: string[][]; buy: string[] };
export const routines: Record<RoutineKey, Routine> = {
    flare: {
      note: 'Keep it to three gentle products while skin is reactive. Skip the oil cleanser, acids and retinol until it settles.',
      am: [['gentle-cream-cleanser', 'Lukewarm water, 30 seconds, pat dry'], ['centella-calming-serum', 'Press into damp skin'], ['barrier-repair-cream', 'Within 3 minutes, then sunscreen']],
      pm: [['gentle-cream-cleanser', 'Lukewarm water, pat dry'], ['centella-calming-serum', 'Keep it in the fridge for extra cooling'], ['barrier-repair-cream', 'A thicker layer on dry patches']],
      buy: ['gentle-cream-cleanser', 'centella-calming-serum', 'barrier-repair-cream']
    },
    dry: {
      note: 'Rebuild the lipids your barrier is missing, then seal them in. The four-step set covers all of this and saves S$16.',
      am: [['gentle-cream-cleanser', 'Lukewarm water, pat dry'], ['ceramide-recovery-serum', '3 to 4 drops on damp skin'], ['barrier-repair-cream', 'Then sunscreen']],
      pm: [['barrier-cleansing-oil', 'On dry skin, massage 60 seconds'], ['gentle-cream-cleanser', 'Second cleanse'], ['ceramide-recovery-serum', 'On damp skin'], ['barrier-repair-cream', 'Within 3 minutes']],
      buy: ['barrier-reset-routine']
    },
    texture: {
      note: 'Your barrier routine stays the same. Add one active on two evenings a week each, never on the same night, and stop if skin flares.',
      am: [['gentle-cream-cleanser', 'Lukewarm water, pat dry'], ['ceramide-recovery-serum', 'On damp skin'], ['barrier-repair-cream', 'Then SPF, every day']],
      pm: [['gentle-cream-cleanser', 'Cleanse'], ['pha-gentle-exfoliant', 'Mon and Thu only'], ['night-renew-retinol', 'Tue and Fri only'], ['barrier-repair-cream', 'Every night']],
      buy: ['gentle-cream-cleanser', 'ceramide-recovery-serum', 'barrier-repair-cream', 'pha-gentle-exfoliant', 'night-renew-retinol']
    },
    'new': {
      note: 'Use the five minis morning and evening for 14 days. Your parcel includes S$19 off your first full-size order.',
      am: [['gentle-cream-cleanser', 'Mini, 30 ml'], ['ceramide-recovery-serum', 'Mini, 5 ml'], ['barrier-repair-cream', 'Mini, 15 ml']],
      pm: [['barrier-cleansing-oil', 'Mini, 20 ml'], ['centella-calming-serum', 'Mini, 5 ml'], ['barrier-repair-cream', 'Mini, 15 ml']],
      buy: ['discovery-kit']
    }
  };
