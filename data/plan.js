// ============================================================
// data/plan.js — all skill drill + phase content.
// Copy transcribed VERBATIM from soccer-the-build.html, with the
// spec's structural additions (Phase 2 split into 2a/2b; the
// red-light drill builds from ~50% speed, not 70%).
//
// Content strings use backticks and may contain trusted inline
// <b>/<em> markup — render layers insert them as innerHTML.
// ============================================================

// App identity (header)
export const META = {
  eyebrow: 'Adult beginner · built in phases · ease into each one',
  title: 'The Build',
  lede:
    'A daily companion for the phase-by-phase program. It builds today’s session from where you are, how much time you’ve got, and the conditions — then tracks what you did. It never bumps you up a phase on its own. It suggests; you confirm.',
};

// ------------------------------------------------------------
// DRILL CATALOG
// Each drill carries the verbatim teaching copy AND the flags the
// session generator needs. `phase` ties it to a phase; `state`
// defaults live in state.js (drillStates).
// ------------------------------------------------------------
export const DRILLS = {
  // ---- Phase 1 · Feel ----
  toeTaps: {
    id: 'toeTaps', phase: 'p1', num: 1,
    name: 'Toe taps', tagline: 'Rhythm and comfort on top of the ball',
    flags: { stationary: true },
    startHere: `<b>Start here (can't-fail):</b> don't tap at all yet. Just rest the sole of one foot lightly on top of the still ball, take it off, then rest the other foot on top. Slow, almost like marching in place on the ball. Look down the whole time. Once that feels easy, add a light tap so it's a quick touch instead of a rest.`,
    full: `The full version: stand over a still ball and tap the top lightly, alternating feet, right, left, right, left. The ball stays roughly in place while your feet do the work.`,
    cues: [
      `<b>Weight on the balls of your feet,</b> not flat-footed. Stay light.`,
      `<b>Just the sole brushes the top of the ball.</b> You're tapping, not standing on it.`,
      `<b>Start slow.</b> Speed comes only after the rhythm is smooth.`,
    ],
    addLast: { label: 'Add last', text: `<b>Add last:</b> once the rhythm is steady, glance up for a split second between taps. Build up to longer looks. If the ball gets away when you look up, you're not ready for that layer yet, and that's fine.` },
    cue: 'Stay light on the balls of your feet; the sole just brushes the top.',
    tags: [{ type: 'goal', text: 'Goal: 3 rounds of 30 sec, steady rhythm' }, { type: 'miss', text: 'Miss: ball drifts = touches too hard' }],
  },
  foundations: {
    id: 'foundations', phase: 'p1', num: 2,
    name: 'Foundations (side-to-side)', tagline: 'The core touch of the whole sport',
    flags: { stationary: true, foundation: true },
    startHere: `<b>Start here (can't-fail):</b> push the ball <em>once</em> from the inside of one foot to the other and just stop it there. One slow touch at a time, looking down, no rhythm. Then a second touch back. Only once single touches are reliable do you link them into a back-and-forth pendulum.`,
    full: `The full version: tap the ball between the insides of your two feet like a pendulum. Right foot pushes it to the left, left pushes it back. Small, controlled taps.`,
    cues: [
      `<b>Use the inside of the foot,</b> the flat area by the arch. Same surface you'll pass with.`,
      `<b>Keep the ball in front of you,</b> within a half-stride, not drifting forward.`,
      `<b>Knees slightly bent, light on your feet,</b> gently bouncing between touches.`,
      `<b>Cushion it</b> so it doesn't ricochet off. Soft contact.`,
    ],
    addLast: { label: 'Add last', text: `<b>Add last:</b> when the side-to-side is smooth and the ball isn't escaping, start lifting your eyes between touches. Looking up is a separate skill stacked on top, not a starting requirement.` },
    cue: 'Inside of the foot, ball within a half-stride, soft cushioned touches.',
    tags: [{ type: 'goal', text: 'Goal: 60 sec smooth, ball staying close' }, { type: 'miss', text: 'Miss: stabbing at it stiff-legged' }],
  },
  soleRolls: {
    id: 'soleRolls', phase: 'p1', num: 3,
    name: 'Sole rolls', tagline: 'Learning the bottom of the foot',
    flags: { stationary: true },
    startHere: `<b>Start here (can't-fail):</b> this is the gentlest drill, so it's a great confidence builder. Just rest your sole on the ball and roll it a few inches forward, then pull it back. Tiny movements. Hold the ball with your sole between rolls if it helps.`,
    full: `The full version: roll the ball forward and back with the sole of one foot, then side to side. Switch feet. This wakes up the part of the foot you use to stop and drag the ball.`,
    cues: [
      `<b>Light pressure with the sole,</b> just enough to grip and guide. Don't stamp on it.`,
      `<b>Ankle relaxed but controlled,</b> rolling from the front of the foot.`,
      `<b>Keep your standing leg bent</b> for balance, arms out a little.`,
    ],
    addLast: null,
    cue: 'Light sole pressure, standing leg bent for balance.',
    tags: [{ type: 'goal', text: 'Goal: 30 sec each foot, controlled' }],
  },
  juggling: {
    id: 'juggling', phase: 'p1', num: 4,
    name: 'Juggling (the stretch skill)', tagline: 'Touch and softness — hardest one here',
    flags: { stationary: true, stretchSkill: true },
    startHere: `<b>Start here (can't-fail):</b> hold the ball, drop it, let it bounce, catch it. That's it. Next, drop, let it bounce, give it <em>one</em> soft tap with your laces, then catch. One tap and catch. Don't chase a streak yet. This is the hardest Phase 1 skill, so being slow here is normal and expected.`,
    full: `Build up one tap at a time: drop, bounce, two taps, catch. Bounces between taps are completely fine for a long while.`,
    cues: [
      `<b>Contact with the laces,</b> the flat hard top of the foot, not the toe.`,
      `<b>Lock the ankle, foot roughly level,</b> toes slightly up, so the ball pops straight up.`,
      `<b>Small, soft pops</b> to about knee height. Cushion, don't kick.`,
      `<b>Both feet,</b> even now. Don't let the weak foot sit out.`,
    ],
    addLast: { label: "Don't stress this one", text: `<b>Don't stress this one.</b> Juggling is the slowest skill to come for everyone. It's here to build soft touch, not to gate your progress. You do <em>not</em> need big juggling numbers to move to Phase 2.` },
    cue: 'Laces, locked ankle, soft pops to knee height — both feet.',
    tags: [{ type: 'goal', text: 'Goal: 5 in a row, bounces allowed' }, { type: 'miss', text: 'Miss: toe-poking sends it spinning' }],
  },

  // ---- Phase 2a · Move (straight-line) ----
  dribbleLaces: {
    id: 'dribbleLaces', phase: 'p2a', num: 1,
    name: 'Dribble with laces (straight line)', tagline: 'How you actually carry the ball',
    flags: { movement: true, straightLine: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    full: `Walk, then jog, pushing the ball ahead with the laces part of your foot. Many small touches over 15–20 yards, then turn and come back.`,
    cues: [
      `<b>Push with the laces, toe pointing down,</b> never the toe-tip. Toe-poking kills control.`,
      `<b>Ball stays within one stride.</b> If you have to reach for it, your touch was too big.`,
      `<b>Look up between touches,</b> down only for the touch itself. Build this now.`,
      `<b>Both feet.</b> Push some touches with the left even on a right-foot lap.`,
    ],
    addLast: null,
    cue: 'Laces, toe down; ball always within one stride.',
    tags: [{ type: 'goal', text: 'Goal: 20 yds, ball always within reach' }, { type: 'miss', text: 'Miss: ball running 3+ feet ahead' }],
  },
  coneWeave: {
    id: 'coneWeave', phase: 'p2a', num: 2,
    name: 'Cone weave', tagline: 'Inside-outside close control',
    flags: { movement: true, cut: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    full: `Set 5–6 cones (or shoes, bottles) in a line about 1.5 yards apart. Weave through using the inside of the foot one way and the outside the next, keeping the ball close the whole way.`,
    cues: [
      `<b>Cut the ball across your body,</b> not too far in front. Tight little touches.`,
      `<b>Use both surfaces:</b> inside to bring it across, outside to push it back out.`,
      `<b>Slightly lowered center of gravity,</b> knees bent, ready to change direction.`,
      `<b>Master it slow first.</b> Speed through sloppy touches just trains bad habits.`,
    ],
    addLast: null,
    cue: 'Inside then outside; master it slow before adding pace.',
    tags: [{ type: 'goal', text: 'Goal: clean run, both feet involved' }, { type: 'miss', text: 'Miss: clipping cones, ball escaping' }],
  },

  // ---- Phase 2b · Move (turns) ----
  pullBack: {
    id: 'pullBack', phase: 'p2b', num: 1,
    name: 'Pull-back turn', tagline: 'Your first way out of pressure',
    flags: { movement: true, cut: true, turn: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    full: `Dribble toward a cone at moderate speed, plant one foot beside the ball, and use the sole of the other foot to drag the ball back. Turn 180° and dribble away. This is the first change-of-direction move every beginner should own.`,
    cues: [
      `<b>Sole on top of the ball,</b> drag it back toward you as you pivot.`,
      `<b>Plant foot stays balanced</b> beside the ball, knee bent.`,
      `<b>Turn your body with the ball,</b> then push off the other way with the next touch.`,
      `<b>Slow until it's clean,</b> then add speed. Rushing the pull-back is the usual mistake.`,
    ],
    addLast: null,
    cue: 'Sole drags the ball back; plant foot balanced, turn with the ball.',
    tags: [{ type: 'goal', text: 'Goal: smooth 180 both feet, no fumble' }],
  },
  redLight: {
    id: 'redLight', phase: 'p2b', num: 2,
    name: 'Red light / green light (stops)', tagline: 'Control at pace',
    flags: { movement: true, cut: true, stop: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    // Structural change: builds from ~50% speed, not 70%.
    full: `Dribble forward at ~50% speed, then stop the ball dead under your sole, then go again. If you can, have someone call "stop" and "go" at random so you react instead of planning.`,
    cues: [
      `<b>Stop it dead with the sole,</b> ball frozen in one second, not rolling on.`,
      `<b>Keep it close enough to stop fast.</b> A loose touch can't be stopped quickly.`,
      `<b>Stay balanced on the stop,</b> ready to accelerate the other way.`,
    ],
    addLast: null,
    cue: 'Build from ~50% speed; stop dead under the sole within a second.',
    tags: [{ type: 'goal', text: 'Goal: dead stop within 1 sec, every time' }],
  },

  // ---- Phase 3 · Pass ----
  pushPass: {
    id: 'pushPass', phase: 'p3', num: 1,
    name: 'The push pass, broken all the way down', tagline: 'Read this one slowly',
    flags: { stationary: true, passing: true, checklist: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    full: `This is the full form for an inside-foot pass, the exact checklist coaches use. Walk through it slowly with a still ball before you ever do it at the wall. Picture each step.`,
    cues: [
      `<b>Plant foot beside the ball,</b> about 6 inches to the side, toes pointed straight at your target. Your plant foot aims the pass. Where it points is where the ball goes.`,
      `<b>Knee of the standing leg slightly bent,</b> body weight balanced over it. Lean very slightly forward at the waist.`,
      `<b>Open your hip</b> so your kicking leg rotates out and the inside of your foot faces the target, at a 90° angle to your plant foot.`,
      `<b>Lock the ankle by pulling your toes up</b> toward your shin (think: pull your toes up through the roof of your shoe). Done right you feel a slight stress on the outside of your shin. A floppy ankle is the #1 cause of bad passes.`,
      `<b>Contact the center of the ball</b> with the inside of your foot, the hard flat area just below the ankle bone. Strike through the middle, not the top or bottom.`,
      `<b>Body over the ball, head steady, eyes down on the ball</b> at contact. Arms out a little for balance.`,
      `<b>Follow through toward the target.</b> The pass isn't done at contact. Your foot continues through the ball toward where you want it to go.`,
    ],
    addLast: null,
    cue: 'Plant foot aims it; lock the ankle; follow through to target.',
    tags: [{ type: 'miss', text: 'Miss: leaning back lifts the ball into a bouncer' }, { type: 'miss', text: 'Miss: floppy ankle = no accuracy' }],
  },
  wallClose: {
    id: 'wallClose', phase: 'p3', num: 2,
    name: 'Wall passing, close (errorless start)', tagline: 'Build the rep, fail-proof',
    flags: { stationary: true, passing: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    full: `Stand close to a wall, about 5 feet. Pass into it with the inside of your foot, let it come back, control it, pass again. Stay close on purpose so you focus on clean contact, not power. Alternate feet: right, then left.`,
    cues: [
      `<b>Run the full checklist from drill 1 on every pass</b> at first. Plant foot, locked ankle, center of ball, follow through.`,
      `<b>Soft, controlled pace.</b> Close to the wall means you can't muscle it. Good.`,
      `<b>Two touches to start:</b> control the rebound with one touch, pass with the next.`,
      `<b>Check your plant foot every few reps.</b> Is it actually pointing where you aimed?`,
    ],
    addLast: null,
    cue: 'Close to the wall, full checklist every pass, alternate feet.',
    tags: [{ type: 'goal', text: 'Goal: 40 clean passes, no heavy touch' }],
  },
  firstTouch: {
    id: 'firstTouch', phase: 'p3', num: 3,
    name: 'First touch off the wall', tagline: 'Receiving into space',
    flags: { stationary: true, passing: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    full: `Same wall, but now the focus is the receiving touch. As the ball returns, cushion it with the inside of your foot and push it slightly to the side into space, ready for your next pass, instead of stopping it dead under you.`,
    cues: [
      `<b>Meet the ball with a relaxed foot</b> and "give" with it slightly on contact so it doesn't bounce off. Cushion, don't block.`,
      `<b>Direct the touch into space</b> beside you, half a stride, where you can play the next ball, not back under your body.`,
      `<b>Decide where the touch is going before the ball arrives.</b> That decision is the real skill.`,
    ],
    addLast: null,
    cue: 'Cushion and push into space beside you, not dead underfoot.',
    tags: [{ type: 'goal', text: 'Goal: control + repass in 2 touches, smooth' }, { type: 'miss', text: 'Miss: trapping it dead under you, then scrambling' }],
  },
  wallStepped: {
    id: 'wallStepped', phase: 'p3', num: 4,
    name: 'Wall passing, stepped back + weak foot', tagline: 'Add difficulty the right way',
    flags: { stationary: true, passing: true, weakFootFinish: true },
    lockReason: 'Opens with the Phase 2a promotion',
    startHere: null,
    full: `Once close passing is clean, step back to 8–10 feet so the pass needs more weight and a truer strike. Vary the angle you stand at. Then do a full set using only your weak foot.`,
    cues: [
      `<b>More distance needs a firmer strike,</b> but the form doesn't change. Same locked ankle, same follow-through.`,
      `<b>Change angles</b> so you're not grooving one identical rep. Game passes never repeat exactly.`,
      `<b>Weak foot gets its own set every session.</b> A one-footed player is easy to defend. This is the fastest gap you can close.`,
    ],
    addLast: null,
    cue: 'Step back for a truer strike; finish with a weak-foot set.',
    tags: [{ type: 'goal', text: 'Goal: weak foot hits the same target as strong' }],
  },

  // ---- Phase 4 · Play ----
  smallSided: {
    id: 'smallSided', phase: 'p4', num: 1,
    name: 'Small-sided games (3v3 to 5v5)', tagline: 'The highest-value thing you can do',
    flags: { movement: true, cut: true, game: true },
    lockReason: 'Opens with Phase 3/4',
    startHere: null,
    full: `Find pickup, futsal, or rec games on small fields with few players. Smaller games mean you touch the ball constantly and face 1v1s over and over, which is exactly the pressure that builds real skill. You will be bad at first. Play anyway. That's the cost of entry and everyone paid it.`,
    cues: [
      `<b>Use your Phase 1–3 stuff on purpose.</b> Try your pull-back turn, force your weak foot, take the first touch into space.`,
      `<b>Keep your head up.</b> All that "look up between touches" work pays off here.`,
      `<b>Don't hide.</b> Ask for the ball, lose it, ask again. Reps under pressure are the whole point.`,
    ],
    addLast: null,
    cue: 'Use your skills on purpose, head up, don’t hide.',
    tags: [{ type: 'goal', text: 'Goal: get into a game every week, then more' }],
  },
  soloUpkeep: {
    id: 'soloUpkeep', phase: 'p4', num: 2,
    name: 'Keep your solo work as upkeep', tagline: 'Don’t drop the base',
    flags: { stationary: true, mixed: true },
    lockReason: 'Opens with Phase 3/4',
    startHere: null,
    full: `Now that games are the main event, shrink solo work to about 15 minutes of maintenance, weighted toward whatever's weakest, which for almost everyone is weak foot and first touch.`,
    cues: [
      `<b>Mix skills instead of block-drilling now.</b> Pass, then a move, then a touch, then weak-foot pass. Looping different skills retains better than 50 of one.`,
      `<b>Quick wall passing and a few turns</b> keeps the grooved patterns from growing over.`,
    ],
    addLast: null,
    cue: 'Loop skills instead of block-drilling; weight to your weakest.',
    tags: [],
  },
  feint: {
    id: 'feint', phase: 'p4', num: 3,
    name: 'Start a simple feint (when ready)', tagline: 'Beating someone 1v1',
    flags: { movement: true, cut: true },
    lockReason: 'Opens with Phase 3/4',
    startHere: null,
    full: `Once close control is reliable, add one beginner-friendly fake. The body feint (drop of the shoulder): while dribbling at someone, dip your shoulder and bend your knees to "sell" going one way, then push the ball with the outside of the opposite foot the other way.`,
    cues: [
      `<b>Sell the fake with your whole body,</b> shoulders and knees, not just a foot wiggle.`,
      `<b>Take the ball away with the outside of the far foot,</b> into the space the defender left.`,
      `<b>Learn one move well</b> before collecting more. One reliable move beats five sloppy ones.`,
    ],
    addLast: null,
    cue: 'Sell it with the whole body; take it with the outside of the far foot.',
    tags: [{ type: 'goal', text: 'Goal: pull it off once in a real game' }],
  },
};

// Drill display order (used by generator rotation & Plan view)
export const DRILL_ORDER = [
  'toeTaps', 'foundations', 'soleRolls', 'juggling',
  'dribbleLaces', 'coneWeave',
  'pullBack', 'redLight',
  'pushPass', 'wallClose', 'firstTouch', 'wallStepped',
  'smallSided', 'soloUpkeep', 'feint',
];

// ------------------------------------------------------------
// PHASES — ordered. Intro copy + gate checklists (verbatim).
// gate.items marked optional:true are excluded from promotion.
// ------------------------------------------------------------
export const PHASES = [
  {
    id: 'p1', order: 0, next: 'p2a',
    eyebrow: 'Phase 1 · Feel',
    title: 'Get the ball comfortable under your feet',
    wk: 'Roughly weeks 1–3 · ball mastery, no pressure',
    sub: `Before you pass or dribble anywhere, your feet need to stop treating the ball like a stranger. These drills need a ball and a few feet of space. They look too simple. Do them anyway. This is the base every academy starts on.`,
    intros: [
      { kind: 'note', html: `<b>Day 1 is just getting familiar.</b> Before any drill below, spend your first session or two simply messing with the ball. Roll it around with both feet, tap it, nudge it, feel the inside, outside, and sole. No reps to hit, no rhythm to keep. The point is only to make the ball feel less foreign. Every drill here starts from a version you basically can't fail, then you add difficulty. <b>Looking up is the last thing you add, never the first.</b> Stare at the ball as much as you need at the start.` },
      { kind: 'real', html: `<b>Surface:</b> do this stationary work on something flat and hard, a driveway, garage, or gym floor. The ball won't bobble, so the only thing you're feeling is your own foot, which is exactly what you want. Wear cushioned trainers, not cleats, and keep it short to spare your shins. Save grass for Phase 2 once you're moving, cutting, and turning.` },
    ],
    drills: ['toeTaps', 'foundations', 'soleRolls', 'juggling'],
    gate: {
      label: 'Ready for Phase 2 when',
      items: [
        { id: 'g_foundations', text: 'Foundations for 60 seconds with the ball staying close (looking up is a bonus, not required)' },
        { id: 'g_toetaps', text: 'Toe taps feel like a rhythm, not a fight' },
        { id: 'g_solerolls', text: 'Sole rolls are controlled with both feet' },
        { id: 'g_juggling', optional: true, text: 'Juggling: you can do a few with bounces. Don’t wait on big numbers, this skill lags for everyone' },
      ],
      note: `No deadline. Some clear this in a week, some in three. The real test is simple: does the ball feel less like a stranger? Moving up before that just means a wobbly Phase 2.`,
    },
  },
  {
    id: 'p2a', order: 1, next: 'p2b',
    eyebrow: 'Phase 2a · Move',
    title: 'Carry the ball in a straight line',
    wk: 'Roughly weeks 3–4 · dribbling, walking → jogging pace',
    sub: `Now the ball travels with you. The whole job here is small touches with the ball within a stride. Beginners dribble with their head down and the ball too far ahead, so you train the opposite, but in order: get the touches tight first, then start lifting your eyes. Both 2a drills start at walking pace and build to a jog. This is where you move to grass or turf, both for realistic ball roll and to spare your joints.`,
    intros: [
      { kind: 'note', html: `<b>Pace comes last.</b> Straight-line dribbling and the cone weave both begin at a walk. Only once the touches are tight and the ball stays within a stride do you build up to a jog. Speed through sloppy touches just trains bad habits.` },
    ],
    drills: ['dribbleLaces', 'coneWeave'],
    gate: {
      label: 'Ready for Phase 2b when',
      items: [
        { id: 'g_weave', text: 'You can weave the cones cleanly with both feet, head coming up between touches' },
        { id: 'g_dribble5', text: 'You can dribble 5 minutes in a tight space (or imagined traffic) without the ball escaping' },
      ],
      note: `2b adds your first turns. The hip does not gate this — PT has confirmed the turning drills are fine; it’s the 2a skill that unlocks them.`,
    },
  },
  {
    id: 'p2b', order: 2, next: 'p3',
    eyebrow: 'Phase 2b · Move',
    title: 'Turn and stop the ball under control',
    wk: 'Roughly weeks 4–6 · change of direction',
    sub: `Your first change-of-direction work. The pull-back turn is the move every beginner should own, and red light / green light trains stopping the ball dead at pace. Slow and clean first, then add speed — red light / green light builds from about half pace, not full.`,
    intros: [
      { kind: 'note', html: `<b>Unlocked by the Phase 2a skill gate, not the hip.</b> PT has cleared these turning drills. Keep them clean and unhurried before adding any speed.` },
    ],
    drills: ['pullBack', 'redLight'],
    gate: {
      label: 'Ready for Phase 3 when',
      items: [
        { id: 'g_pullback', text: 'Your pull-back turn works both directions without looking down the whole time' },
        { id: 'g_redlight', text: 'Red light / green light: you can stop the ball dead within a second, staying balanced to go again' },
      ],
      note: `Phase 3 is passing at the wall. The wall drills have been open since 2a — clearing this just makes them your main work.`,
    },
  },
  {
    id: 'p3', order: 3, next: 'p4',
    eyebrow: 'Phase 3 · Pass',
    title: 'Pass and receive with real form',
    wk: 'Roughly weeks 5–10 · the wall is your partner',
    sub: `This is the phase that makes you look like a player. The inside-foot push pass is the most-used pass in the game, and a wall lets you do hundreds of reps alone. Get the form right early. It's much harder to fix a sloppy pass later than to build a clean one now.`,
    intros: [],
    drills: ['pushPass', 'wallClose', 'firstTouch', 'wallStepped'],
    gate: {
      label: 'Ready for Phase 4 when',
      items: [
        { id: 'g_40passes', text: '40 wall passes in a row without a heavy first touch' },
        { id: 'g_weakfoot', text: 'Your weak foot can hit a target on the wall, not just poke at it' },
        { id: 'g_firsttouch', text: 'Your first touch puts the ball into space beside you, ready for the next play' },
      ],
      note: `Reality: you'll never fully "finish" this phase. Wall work stays in your routine forever as maintenance. You're just clearing the bar to add real games.`,
    },
  },
  {
    id: 'p4', order: 4, next: null,
    eyebrow: 'Phase 4 · Play',
    title: 'Put it under real pressure',
    wk: 'Weeks 8+ · games become the main event',
    sub: `Here's something the research is loud about: the players who got good didn't only drill. They racked up huge hours of informal games as kids, pickup and street soccer, and the higher performers logged more of that free play, not less. Games are where touch turns into actual skill, because only a game teaches you to decide fast and read what's happening.`,
    intros: [],
    drills: ['smallSided', 'soloUpkeep', 'feint'],
    gate: null,
    outro: { kind: 'note', html: `<b>Why games matter this much:</b> drills build the technique, but a static drill can't teach you to read a moving defender or decide in half a second. Decision-making and creativity come from many hours of real, unpredictable play. That's the part of elite players' childhoods people forget: not just coaching, but endless pickup.` },
  },
];

export const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p]));

// ------------------------------------------------------------
// STATIC REFERENCE SECTIONS (verbatim) — rendered in Plan view.
// ------------------------------------------------------------
export const HOW_IT_WORKS = {
  kick: 'How this works',
  h2: 'Why it’s built in phases',
  answer: `Every skill in soccer sits on top of the one before it. A clean pass needs a settled touch. A settled touch needs comfort with the ball at your feet. Stack them in the wrong order and the whole thing wobbles.`,
  intro: `This follows the order national coaching programs actually teach: get the ball comfortable under your feet, then move with it, then pass it, then use all of it in games. Each phase has drills with full form instructions, the mistakes to watch for, and a clear test that tells you when you've earned the next phase. No guessing.`,
  miniTitle: 'The four ideas behind every drill',
  edges: [
    { h3: '1. Start so easy you can’t fail, then nudge it harder', p: `When a skill is brand new, set it up so you almost can't miss. Close to the wall, slow through the cones. Once it's clean, make it slightly harder. New research on beginners is clear that starting clean grooves the right pattern and makes it hold up later under pressure.` },
    { h3: '2. Keep every rep a little past comfortable', p: `Once a skill isn't new, a rep that's easy stops teaching you. You want to miss sometimes. Never missing means make it harder; missing constantly means back off a step.` },
    { h3: '3. Spaced repetition is how it sticks', p: `One coach puts it well: a skill is a path through a forest. The first time is a fight through the brush. Travel it again before it grows over and it becomes a footpath, then a road. Come back to each skill often instead of cramming it once.` },
    { h3: '4. Become your own coach', p: `After each rep, ask what was off before you check. Did the plant foot point at the target? Was the ankle locked? Catching your own mistakes is what turns a drill into a skill you own. Filming yourself once a week makes the invisible stuff obvious.` },
  ],
  note: `<b>The daily shape, every phase:</b> a few minutes of warm-up touches, the bulk on that phase's drills, then finish on your weak foot. Each phase gives you a 20, 30, and 45-minute version. Pick by the day you've got. The one rule that matters most: do it <em>most days</em>, with sleep between sessions. That spacing is not a nice-to-have, it's the fastest way the brain locks in a motor skill (the science tab has the numbers).`,
};

export const CATCHUP = {
  kick: 'Catch-up strategy',
  h2: 'If the goal is making a high school team',
  sub: `You won't out-skill years of touches in a year, and you don't need to. A coach who trains new high schoolers put it plainly: a new player is usually a good athlete who lacks the touch, so the gap closes quickly with reps. Lean on what you've already got.`,
  edges: [
    { lbl: 'Edge 1 · Volume', h3: 'Bank far more reps than they do', p: `Most players only touch a ball at team practice. Your daily phase work on top of games piles up reps several times faster. Over a year that's a real gap, and it's the part you fully control.` },
    { lbl: 'Edge 2 · Your athletic base', h3: 'You’re already fitter than most of them', p: `As a 400 and 800 runner you've got speed, an engine, and recovery that take years to build and most players lack. A fast, relentless player who's only okay technically is still useful. Earn a spot on that, let skill catch up.` },
    { lbl: 'Edge 3 · Position fit', h3: 'Pick a spot that hides the gaps', p: `Skip playmaker for now. It's the most technical spot, where missing years show most. Outside back or wide midfield rewards pace, fitness, and solid defending while your touch develops.` },
    { lbl: 'Edge 4 · The on-ramp', h3: 'Treat JV as the front door', p: `JV exists for players not ready for varsity yet, at a slower learning pace. Making JV first is a realistic year-one goal that gets you into the program.` },
  ],
  blocks: [
    { kind: 'note', html: `<b>Train what running didn't give you:</b> side-to-side movement, slowing down fast, cutting. You're quick in a straight line and soccer mostly isn't. A bit of agility work makes the fitness transfer.` },
    { kind: 'real', html: `<b>Scout your own school first.</b> A weaker program is doable in a year. A powerhouse in a soccer-heavy town is more like two years. Roster spots and coach preferences are things you can't fully control.` },
    { kind: 'note', html: `<b>The "four years" myth, corrected:</b> you may have heard it took Didier Drogba (who started late) four years before he could train daily and play weekly. True, but that measured his <em>body</em> learning to survive a professional schedule, daily full-contact training plus a match every week, and his early pro years were wrecked by injuries. It was a durability ceiling at the pro level. It says nothing about how long skill takes, and nothing about making a high school team. Don't let that number anchor you. Also: most "late bloomer" lists mislead. Vardy and Kanté started as kids and just turned pro late, which is a different thing entirely.` },
  ],
};

export const TIMELINE = {
  kick: 'Timeline',
  h2: 'The honest schedule',
  sub: `Corrected for what you're actually chasing: <em>competence and a roster spot</em>, not pro-level polish. Those are very different timelines, and the difference is the whole point. The phases overlap; you don't fully leave one to start the next.`,
  rows: [
    { w: 'Wks 1–6', h4: 'Phases 1–2: feel and movement', p: `Ball mastery and dribbling get comfortable. Noticeable control gains show up around the 4–6 week mark with near-daily sessions. The ball stops feeling foreign fast.` },
    { w: 'Wks 5–12', h4: 'Phase 3 + first games', p: `Clean passing and first touch come online. Dribbling in traffic starts clicking around 8–12 weeks. Start light pickup. By here you're competent: not embarrassing, can keep up.` },
    { w: 'Mo 3–6', h4: 'Phase 4 + athletic transfer', p: `Games become the main event. Add agility so your running base becomes soccer movement. Weak foot turns trustworthy. You're a useful contributor in pickup.` },
    { w: 'Mo 6–12', h4: 'JV-ready at a normal program', p: `With consistency and the right position, JV is a realistic year-one target, especially at a program that isn't stacked. Your athletic base is doing real work here.` },
    { w: 'Yr 1.5–2', h4: 'On par in a real role, pushing varsity', p: `Where your technique pulls even with longtime players in an actual position. This is the dependable window for the full goal, not four-plus years.` },
  ],
  blocks: [
    { kind: 'note', html: `<b>Why this is faster than you were told:</b> becoming <em>competent</em> at a motor skill is a "fast phase" event, measured in weeks and tens of hours. The years-long timelines apply only to <em>expert</em>, automatic, never-think-about-it polish (the 6,000+ hour tail). A high school role lives in the fast phase, and your athletic base shortens it further. The science tab breaks down the numbers.` },
    { kind: 'real', html: `<b>Still true, so plan for it:</b> matching a longtime player's <em>expert</em> touch in 12 months isn't happening, because that polish is the slow phase. You don't need it. Competence plus your fitness, work rate, and a smart position is enough to start over someone more skilled but slower. And a powerhouse program in a soccer-heavy town is a tougher, longer climb than a smaller one, so scout yours honestly.` },
  ],
};

export const SCIENCE = {
  kick: 'The science',
  h2: 'What’s actually under all this',
  sub: `Plain-language version of the research the whole program rests on, with the numbers that matter to you. No jargon for its own sake.`,
  answer: `The big idea: getting <em>good enough</em> at a motor skill is fast. Getting <em>perfect</em> is slow. The years-long timelines you've heard apply to perfect. You're chasing good enough.`,
  blocks: [
    { type: 'q', text: 'How a skill is learned: two stages' },
    { type: 'p', html: `Brain studies of motor learning find skill comes in two phases. A <b>fast phase</b>, big visible gains within and across your early sessions, then a <b>slow phase</b>, small refinements that trickle in over months and years. How long the fast phase lasts depends on the skill: a simple movement can near its ceiling in weeks, while violin-level mastery keeps improving for years. Soccer competence sits near the fast end. Expert polish is the slow tail.` },
    { type: 'q', text: 'The numbers worth knowing' },
    { type: 'stats', items: [
      { big: '~20', unit: ' hrs', cap: 'Focused practice to reach basic competence at a skill. Past the clumsy stage, confident with the basics.' },
      { big: '~500', unit: ' hrs', cap: 'Solid intermediate. You can apply it in real, messy situations, like an actual game.' },
      { big: '~1,000', unit: ' hrs', cap: 'Genuinely proficient (call it 7 out of 10). Reliable, but not yet expert.' },
      { big: '6,000+', unit: ' hrs', cap: 'National / professional level. This is the multi-year tail, and it’s not your goal.' },
    ] },
    { type: 'small', html: `These are rough consensus figures across skill-acquisition research, not exact laws. But the shape is solid: the first stretch buys the most, and the curve flattens hard near the top.` },
    { type: 'q', text: 'Where a high school role actually sits' },
    { type: 'levels', items: [
      { hrs: '~20 hrs', pct: 14, lbl: '<b>Competent.</b> Keep up in pickup, not embarrassing.' },
      { hrs: '~150–300 hrs', pct: 33, lbl: '<b>JV-ready</b> at a normal program. This is your near-term target.' },
      { hrs: '~500+ hrs', pct: 55, lbl: '<b>On par in a real role,</b> pushing varsity.' },
      { hrs: '6,000+ hrs', pct: 100, lbl: '<b>Expert polish.</b> Not needed to make a team.' },
    ] },
    { type: 'small', html: `At ~30–45 focused minutes most days, you bank roughly 150–250 hours in a year. That lands you squarely in roster range, which is exactly why one to two years is realistic and four-plus is not.` },
    { type: 'q', text: 'Why daily-with-sleep is the actual accelerator' },
    { type: 'p', html: `Studies that pit <b>spaced practice</b> (sessions with sleep between them) against <b>cramming</b> find spacing wins, both for learning the skill and for keeping it. Sleep is when your brain consolidates the reps into a lasting pattern. So short daily sessions aren't the budget option, they're the optimized one. Cramming a week's work into one long Saturday is genuinely slower. This is the closest thing to a real "cheat code," and it's free.` },
    { type: 'q', text: 'Why your running background is a real head start' },
    { type: 'p', html: `The hour figures above assume an average beginner. You're not one. A big chunk of a normal beginner's early hours goes into building coordination, balance, and fitness, things a 400/800 runner already owns. Coaches who train new high schoolers say the same: a new player is usually a good athlete who just lacks the touch, so the gap closes quickly with reps. You get to spend almost all your hours on the touch itself.` },
    { type: 'q', text: 'The four practice rules, and why they’re in here' },
    { type: 'p', html: `<b>Start errorless</b> because reducing early mistakes grooves the correct pattern and helps low-experience learners most. <b>Then push ~10% past comfortable</b> because a rep you can't fail stops teaching. <b>Mix skills once grooved</b> because varied practice feels worse but retains far better than drilling one thing. <b>Self-correct every rep</b> because feedback is what turns repetition into learning, repetition without it just bakes in whatever you're doing wrong. Every drill in this program is built on those four.` },
    { type: 'note', html: `<b>The one-line summary:</b> the research says competence is weeks-to-months of the right daily reps, not years. Years is for perfection, which a roster spot doesn't require. Space your sessions, attack the few highest-value skills, lean on your athleticism, and the timeline genuinely compresses.` },
  ],
};

export const FOOTER_TEXT = `Built from motor-learning and skill-acquisition research (deliberate practice, errorless learning, contextual interference, distributed vs. massed practice, the fast/slow stages of motor learning, and the deliberate-play studies on how elite players actually developed) and from coaching form guides for the push pass, ball mastery, and dribbling, cross-checked across multiple sources, June 2026. Drill targets and timelines are typical ranges, not exact numbers, and shift with the person, the program, and effort. The teaching order (ball mastery → dribbling → passing → play) follows national governing-body skill progressions.`;
