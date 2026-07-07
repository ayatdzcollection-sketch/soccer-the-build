// ============================================================
// data/transfer.js — "Running → Soccer" speedwork carryover.
//
// The Speed module from the original spec is intentionally NOT
// built here. Instead this is a static reference section so that
// if/when speedwork is added to the running-base plan, it is
// clear how to point it at soccer. Grounded in this program's own
// athletic-transfer notes (Catch-up / Science) and the shape of
// the running-base block (an aerobic, easy-HR-governed mileage
// plan with long runs and down weeks — it builds the engine, not
// lateral quickness). This is general guidance, not medical or
// PT advice; anything sharp in the hip means stop and ask PT.
// ============================================================

export const TRANSFER = {
  kick: 'Running → soccer',
  h2: 'Turning your running base into soccer speed',
  sub: `Your running plan is an aerobic block — easy-pace mileage, long runs, down weeks. It builds an engine and straight-line speed. Soccer asks for something the engine alone doesn’t cover: repeated short sprints, hard acceleration, fast deceleration, and cutting. This is how you point speedwork at that gap without wrecking the running block or the hip.`,

  // What each side gives you
  gives: {
    running: {
      title: 'What the running base already gives you',
      items: [
        'A big aerobic engine — you recover between efforts faster than most beginners.',
        'Straight-line speed and a high top gear from the 400/800 background.',
        'Durable, governed volume: easy-HR mileage, a weekly long-run ceiling, built-in down weeks.',
      ],
    },
    soccer: {
      title: 'What soccer adds on top',
      items: [
        'Acceleration over 5–15 yards, from a standstill and off a plant foot.',
        'Deceleration — stopping fast and under control is a skill, and it’s where hips and groins get hurt when it’s untrained.',
        'Lateral movement and change of direction: side shuffles, crossovers, cuts, backpedals.',
        'Repeated-sprint ability: short bursts with short rest, over and over, the way a game actually feels.',
      ],
    },
  },

  // How to slot speedwork in
  edges: [
    {
      lbl: 'Rule 1 · Keep it separate at first',
      h3: 'Don’t bolt speed onto a hard running day',
      p: `Sharp, cutting speedwork and a long run are different stresses. Put speed on an easy or short day, or its own short session — never stacked on the week’s long run or a peak day. Respect the running block’s own caps: a hard speed session counts as load, so it comes out of an easy day’s budget, not on top of it.`,
    },
    {
      lbl: 'Rule 2 · Warm up longer than you think',
      h3: 'Acceleration and cutting need a primed body',
      p: `Before any speed or agility work, do the dynamic warm-up the skill sessions use — leg swings both planes, walking lunges, easy skips, then two or three easy build-ups. Cold cutting is exactly how a hip flexor or groin goes. In cold weather (under ~35°F) extend it and keep moving; nothing maximal until you’re warm.`,
    },
    {
      lbl: 'Rule 3 · Quality over quantity',
      h3: 'Short, sharp, full recovery',
      p: `Speed is a nervous-system skill, not a conditioning grind. A few crisp reps with near-full rest beats many tired ones — tired sprints just train slow mechanics and raise injury risk. When the reps stop being sharp, you’re done for the day.`,
    },
    {
      lbl: 'Rule 4 · Earn deceleration before top speed',
      h3: 'Learn to stop before you learn to fly',
      p: `Decel and change-of-direction are the protective skills. Groove braking mechanics — sink the hips, short choppy steps, absorb the stop — at low speed first, then let the speed climb. This is the same “slow and clean, then add pace” rule the red light / green light drill uses.`,
    },
  ],

  // A simple starter template
  template: {
    title: 'A simple starter speed session (~20–25 min)',
    note: `Do this on an easy running day or as a standalone. Everything sub-maximal until the warm-up is done. Stop any rep the moment form gets sloppy.`,
    blocks: [
      { m: '0–6', body: `<b>Dynamic warm-up.</b> Leg swings (both planes), walking lunges, easy skips, two or three easy 10-yd build-ups.` },
      { m: '6–12', body: `<b>Accelerations.</b> 4–6 × 15–20 yd build-ups from a walk to about ¾ speed, walk back to recover fully between them.` },
      { m: '12–18', body: `<b>Change of direction.</b> Easy side shuffles, a few 5-10-5 shuttles at controlled speed, crossover steps. Sink the hips, choppy steps into each stop.` },
      { m: '18–25', body: `<b>Repeated short sprints (optional, only when the above feels easy).</b> 4–6 × 10-yd near-max sprints with 30–45 sec walk-back rest. Cut it short the moment they stop being crisp.` },
    ],
  },

  // Safety, tied to this program's rules
  safety: [
    { kind: 'real', html: `<b>The pain rule still governs everything.</b> Sharp or pinching pain — especially in the front of the hip on a knee drive, cut, or stop — means stop that movement, finish easy, and tell your PT. Dull next-day soreness is normal; a sharp catch is not.` },
    { kind: 'note', html: `<b>Ramp it in.</b> Add one short speed session a week before two. First day back after a break runs about 20% lighter, and there are no make-up sessions. On a smooth floor or driveway, cushioned trainers only — never cleats, never socks.` },
    { kind: 'real', html: `<b>This is general carryover, not a prescription.</b> It’s here so that if you add speedwork to the running plan later, you know where to aim it. Clear the hip with your PT before any hard cutting or maximal sprinting.` },
  ],
};
