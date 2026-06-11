// Trap data for the Trap Book
// Each trap has: name, side, summary, tags, moves[] with explanation per move,
// trapMove (index of the key trap moment), fallback text, lines as PGN-ish string

const TRAPS = [
  {
    id: "fried-liver",
    name: "Fried Liver Attack",
    side: "white",
    summary: "A vicious sacrificial attack after 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5. White sacrifices on f7 to rip open Black's king.",
    tags: { fun: 5, soundness: 4, difficulty: 3 },
    fallback: "If Black avoids ...Nxd5 with ...Na5, White gets Bb5+ with a crushing attack. The key is that after 4.Ng5 d5 5.exd5, Black has no fully satisfactory reply.",
    moves: [
      { san: "e4",   explanation: "Standard king pawn opening." },
      { san: "e5",   explanation: "Black mirrors — classical e5." },
      { san: "Nf3",  explanation: "Develop the knight, attack e5." },
      { san: "Nc6",  explanation: "Defend e5 with the knight." },
      { san: "Bc4",  explanation: "Italian Game — the bishop eyes f7, Black's weakest square." },
      { san: "Nf6",  explanation: "The Two Knights Defense. Black attacks e4." },
      { san: "Ng5",  explanation: "🔥 The signature move! White targets f7 with both knight and bishop. This is the setup." },
      { san: "d5",   explanation: "Black counterattacks in the center — the only real try." },
      { san: "exd5", explanation: "White captures. Now Black must decide how to continue." },
      { san: "Nxd5", explanation: "⚠️ This looks natural but is the fatal mistake! The knight is undefended on d5." },
      { san: "Nxf7", explanation: "💥 THE FRIED LIVER! White sacrifices the knight on f7. The king is ripped open and White has a devastating attack. This is the trap moment — Black's king is exposed and White follows up with Qf3+ and more." }
    ],
    trapMove: 10
  },
  {
    id: "stafford-gambit",
    name: "Stafford Gambit",
    side: "white",
    summary: "Black sacrifices a pawn with 1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d4. The Stafford is a gambit where Black gives up the e5 pawn for rapid development and tactical chances, especially at club level.",
    tags: { fun: 5, soundness: 2, difficulty: 2 },
    fallback: "White can decline complications with quiet play (d3, Bd3). The Stafford is considered slightly dubious at master level but extremely dangerous for unprepared White players.",
    moves: [
      { san: "e4",   explanation: "King pawn opening." },
      { san: "e5",   explanation: "Black plays classically." },
      { san: "Nf3",  explanation: "Attack e5." },
      { san: "Nf6",  explanation: "Petrov's Defense — the Russian game." },
      { san: "Nxe5", explanation: "White grabs the pawn." },
      { san: "d6",   explanation: "Black attacks the knight — the Stafford begins!" },
      { san: "Nf3",  explanation: "White retreats. (Nxf7?! is the Stafford trap line — but let's see the main gambit.)" },
      { san: "Nxe4", explanation: "Black recovers the pawn with interest — equal material now." },
      { san: "d4",   explanation: "White stakes the center." },
      { san: "d5",   explanation: "Black strikes back in the center." },
      { san: "Bd3",  explanation: "White develops the bishop." },
      { san: "Bc5",  explanation: "Black develops aggressively — aiming at f2. The position is sharp and Black has excellent piece activity for the pawn." }
    ],
    trapMove: 5
  },
  {
    id: "englund-gambit",
    name: "Englund Gambit",
    side: "black",
    summary: "After 1.d4 e5?!, Black offers a pawn for quick development and traps. The main trap line leads to a devastating queen sortie if White gets greedy.",
    tags: { fun: 4, soundness: 1, difficulty: 2 },
    fallback: "The Englund is objectively poor — White can simply return the pawn with a better position (2.dxe5 Nf6 3.Nf3 with a healthy extra pawn). But at club level, the traps are lethal.",
    moves: [
      { san: "d4",   explanation: "Queen's pawn opening." },
      { san: "e5",   explanation: "🎲 The Englund Gambit! Black throws a pawn at White." },
      { san: "dxe5", explanation: "White accepts — the greedy capture." },
      { san: "Nc6",  explanation: "Black attacks e5 and develops." },
      { san: "Nf3",  explanation: "White defends e5 naturally." },
      { san: "Qe7",  explanation: "Black pressures e5 and lines up at the kingside." },
      { san: "Bf4",  explanation: "White defends e5 with the bishop — this looks solid but..." },
      { san: "Qb4+", explanation: "⚡ Check! The queen hits b4 and f4 — the bishop is in trouble." },
      { san: "Nc3",  explanation: "White blocks — forced." },
      { san: "Qxf4", explanation: "💥 Black wins the bishop! The Englund gambit has paid off. Black has recovered the pawn and then some — White's queenside is awkward." }
    ],
    trapMove: 7
  },
  {
    id: "legals-mate",
    name: "Légal's Mate",
    side: "white",
    summary: "A beautiful queen sacrifice leading to a smothered-style checkmate. Arises from the Philidor Defense when Black carelessly pins the knight with ...Bg4.",
    tags: { fun: 5, soundness: 4, difficulty: 2 },
    fallback: "If Black doesn't play ...Bg4 (the greedy pin), White just has a normal Philidor position. The trap requires Black to fall for the pin. If Black declines the queen sacrifice with ...dxe5 instead of ...Bxd1, White is still better.",
    moves: [
      { san: "e4",   explanation: "King pawn opening." },
      { san: "e5",   explanation: "Black plays e5." },
      { san: "Nf3",  explanation: "Develop the knight." },
      { san: "d6",   explanation: "Philidor Defense — solid but passive." },
      { san: "Bc4",  explanation: "White develops the bishop — aiming at f7." },
      { san: "Bg4",  explanation: "⚠️ Black pins the knight to the queen! Looks clever... but it's the setup for the trap." },
      { san: "Nc3",  explanation: "White develops calmly. The knight looks like it's just developing, but it's key to the coming sacrifice." },
      { san: "g6",   explanation: "Black plans ...Bg7 — completely oblivious to the danger." },
      { san: "Nxe5", explanation: "🔥 QUEEN SACRIFICE! White offers the queen. The knight takes e5, apparently hanging the queen to the pin." },
      { san: "Bxd1", explanation: "Black takes the queen — too tempting! But now..." },
      { san: "Bxf7+", explanation: "💥 Bishop checks on f7! The king must move." },
      { san: "Ke7",  explanation: "The only square." },
      { san: "Nd5#", explanation: "🏆 CHECKMATE! Légal's Mate! The knight delivers the final blow — a stunning queen sacrifice leading to mate." }
    ],
    trapMove: 8
  },
  {
    id: "scholars-mate",
    name: "Scholar's Mate",
    side: "white",
    summary: "The classic beginner trap — 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#. Mate in 4 moves. Every beginner falls for this once.",
    tags: { fun: 3, soundness: 1, difficulty: 1 },
    fallback: "Black easily avoids this with 3...Qe7 or 3...g6, defending f7. Once Black knows it, it never works again — but it's a rite of passage!",
    moves: [
      { san: "e4",   explanation: "King pawn." },
      { san: "e5",   explanation: "Black mirrors." },
      { san: "Bc4",  explanation: "The bishop aims at f7 — the weakest square." },
      { san: "Nc6",  explanation: "Black develops, defending e5." },
      { san: "Qh5",  explanation: "🔥 The queen attacks f7 directly! Threatening Qxf7#." },
      { san: "Nf6",  explanation: "⚠️ Black develops the knight... but fails to defend f7 properly! The queen can still take f7." },
      { san: "Qxf7#", explanation: "🏆 CHECKMATE! The queen captures f7 with check — the king has no escape. Scholar's Mate! Game over in 4 moves." }
    ],
    trapMove: 6
  },
  {
    id: "noahs-ark-trap",
    name: "Noah's Ark Trap",
    side: "black",
    summary: "In the Ruy Lopez, after White's bishop gets chased around by ...a6 ...b5 ...c5, Black traps the bishop on b3 with ...c4. A common trap at club level.",
    tags: { fun: 3, soundness: 5, difficulty: 2 },
    fallback: "This isn't really avoidable — it's a natural consequence of the Ruy Lopez structure. White should retreat the bishop to a4 or exchange on c6 early rather than let it get trapped on b3.",
    moves: [
      { san: "e4",   explanation: "King pawn." },
      { san: "e5",   explanation: "Black matches." },
      { san: "Nf3",  explanation: "Ruy Lopez starting." },
      { san: "Nc6",  explanation: "Defending e5." },
      { san: "Bb5",  explanation: "The Ruy Lopez bishop — pinning the knight." },
      { san: "a6",   explanation: "The Morphy defense — chasing the bishop." },
      { san: "Ba4",  explanation: "Bishop retreats — the only good square." },
      { san: "d6",   explanation: "Solid — preparing to bolster the center." },
      { san: "c3",   explanation: "White prepares d4." },
      { san: "b5",   explanation: "Chasing the bishop again!" },
      { san: "Bb3",  explanation: "Bishop retreats to b3 — but it's getting boxed in..." },
      { san: "c5",   explanation: "Black plays c5, staking the queenside." },
      { san: "Nc3",  explanation: "White develops — but doesn't notice the danger." },
      { san: "c4",   explanation: "🐛 TRAPPED! The bishop on b3 has nowhere to go. c4 shuts the door. The bishop is dead — Black wins a whole piece." }
    ],
    trapMove: 13
  },
  {
    id: "mortimer-trap",
    name: "Mortimer Trap",
    side: "black",
    summary: "In the Ruy Lopez, after 1.e4 e5 2.Nf3 Nc6 3.Bb5 Nge7?! — a rare but tricky line. The real trap version: after 1.e4 e5 2.Nf3 Nc6 3.Bc4, Black plays 3...Nge7?? No — actually the Mortimer is 1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O d6 and now if White plays carelessly, ...Bg4 traps can arise.",
    tags: { fun: 2, soundness: 2, difficulty: 3 },
    fallback: "White can avoid complications with careful play. The Mortimer is not seen at top level.",
    moves: [
      { san: "e4",   explanation: "King pawn." },
      { san: "e5",   explanation: "Black responds." },
      { san: "Nf3",  explanation: "Attack e5." },
      { san: "Nc6",  explanation: "Defend e5." },
      { san: "Bb5",  explanation: "Ruy Lopez." },
      { san: "Nge7", explanation: "🎲 The Mortimer! A rare but tricky defense. The knight goes to e7 instead of f6." },
      { san: "c3",   explanation: "White builds a center." },
      { san: "g6",   explanation: "Black fianchettos — aiming for a dark-square strategy." },
      { san: "d4",   explanation: "White opens the center confidently." },
      { san: "exd4", explanation: "Black captures." },
      { san: "cxd4", explanation: "White recaptures." },
      { san: "d5",   explanation: "Black strikes in the center! With the knight on e7 instead of f6, this has different tactical implications." },
      { san: "Nd2",  explanation: "White develops — but the position is tricky." },
      { san: "Bg7",  explanation: "Black fianchettoes — completing development with an unusual but playable setup." }
    ],
    trapMove: 5
  },
  {
    id: "blackburne-shilling",
    name: "Blackburne Shilling Gambit",
    side: "white",
    summary: "A nasty trap in the Italian Game. After 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4??, Black walks into a trap where White plays Nxe5! threatening both the queen and f7.",
    tags: { fun: 5, soundness: 3, difficulty: 1 },
    fallback: "Black simply shouldn't play 3...Nd4. Normal moves like 3...Bc5, 3...Nf6, or 3...Be7 are all fine. This trap only works on absolute beginners.",
    moves: [
      { san: "e4",   explanation: "King pawn." },
      { san: "e5",   explanation: "Black mirrors." },
      { san: "Nf3",  explanation: "Develop and attack e5." },
      { san: "Nc6",  explanation: "Defend e5." },
      { san: "Bc4",  explanation: "Italian Game — bishop targets f7." },
      { san: "Nd4",  explanation: "⚠️ A terrible move! Black attacks the knight but creates a huge weakness. This is the blunder that sets up the trap." },
      { san: "Nxe5", explanation: "🔥 White takes the free pawn! Now threatening Nxf7 (forking queen & rook) AND the queen is attacked by the d4 knight... wait, actually White threatens to play Nxf7 forking Q and R. If Black takes the knight..." },
      { san: "Nxe5", explanation: "Wait — let's see the real line. After 6.Nxe5, Black's best is not to take back but..." },
    ],
    trapMove: 5
  }
];

// Remove the Blackburne one since it's messy, replace with cleaner version
TRAPS[TRAPS.length - 1] = {
  id: "blackburne-shilling",
  name: "Blackburne Shilling Gambit",
  side: "white",
  summary: "A nasty trap in the Italian Game. After 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4??, White plays Nxe5! threatening Nxf7 — a fork of queen and rook.",
  tags: { fun: 5, soundness: 3, difficulty: 1 },
  fallback: "Black simply shouldn't play 3...Nd4. Normal moves like 3...Bc5 or 3...Nf6 are all fine. This trap only works on beginners.",
  moves: [
    { san: "e4",   explanation: "King pawn opening." },
    { san: "e5",   explanation: "Black mirrors." },
    { san: "Nf3",  explanation: "Develop and attack e5." },
    { san: "Nc6",  explanation: "Black defends e5." },
    { san: "Bc4",  explanation: "Italian Game — bishop aims at f7, the weakest square." },
    { san: "Nd4",  explanation: "⚠️ A terrible move by Black! The knight attacks f3 but creates a fatal weakness." },
    { san: "Nxe5", explanation: "🔥 White grabs the pawn! Now White threatens Nxf7 — a devastating fork of queen and rook. Black is in big trouble." },
  ],
  trapMove: 6
};
