// Trap data for the Trap Book — v2 with branching
//
// Each trap has: id, name, side, summary, tags, fallback, moves[]
// Each move: { san, explanation }
// A move can optionally have `branches`: an array of alternative continuations
//   branches: [{ label, moves: [...], trapMove? (index within that branch) }]
// The main line is always moves[]. Branches are shown at the move where they diverge.

const TRAPS = [

// ──────────────────────────────────────────────
// 1. FRIED LIVER ATTACK
// ──────────────────────────────────────────────
{
  id: "fried-liver",
  name: "Fried Liver Attack",
  side: "white",
  summary: "A vicious sacrificial attack after 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5. White sacrifices on f7 to rip open Black's king and delivers a mating attack.",
  tags: { fun: 5, soundness: 4, difficulty: 3 },
  fallback: "If Black avoids ...Nxd5 with ...Na5, White plays Bb5+ c6 dxc6 bxc6 and has a strong attack. The key is that after 4.Ng5 d5 5.exd5, Black has no fully satisfactory reply — ...Na5 and ...Nd4 are the main alternatives, but White is better in all lines.",
  moves: [
    { san: "e4",   explanation: "Standard king pawn opening." },
    { san: "e5",   explanation: "Black mirrors — classical e5." },
    { san: "Nf3",  explanation: "Develop the knight, attack e5." },
    { san: "Nc6",  explanation: "Defend e5 with the knight." },
    { san: "Bc4",  explanation: "Italian Game — the bishop eyes f7, Black's weakest square." },
    { san: "Nf6",  explanation: "The Two Knights Defense. Black attacks e4." },
    { san: "Ng5",  explanation: "🔥 The signature move! White targets f7 with both knight and bishop." },
    { san: "d5",   explanation: "Black counterattacks in the center — the only real try." },
    { san: "exd5", explanation: "White captures. Now Black must decide how to continue." },
    {
      san: "Nxd5",
      explanation: "⚠️ This looks natural but is the fatal mistake! The knight is undefended on d5.",
      branches: [
        {
          label: "Na5 — Black avoids the sacrifice",
          moves: [
            { san: "Na5", explanation: "Black avoids Nxd5 — the safer alternative, attacking the c4 bishop." },
            { san: "Bb5+", explanation: "White plays the strong check! The bishop reroutes with tempo." },
            { san: "c6", explanation: "Black blocks — forced." },
            { san: "dxc6", explanation: "White captures, opening lines." },
            { san: "bxc6", explanation: "Black recaptures." },
            { san: "Be2", explanation: "White retreats the bishop — still clearly better with a strong center and Black's a5-knight is misplaced." }
          ],
          trapMove: 5
        },
        {
          label: "Nd4 — Lolli Attack alternative",
          moves: [
            { san: "Nd4", explanation: "Black plays the tricky knight jump — the Fritz/ Lolli line." },
            { san: "c3", explanation: "White kicks the knight." },
            { san: "b5", explanation: "Black counterattacks the bishop." },
            { san: "Bf1", explanation: "White retreats — the f7 threat remains." },
            { san: "Qe7", explanation: "Black defends f7 with the queen." },
            { san: "Nxf7", explanation: "💥 Lolli Attack! White sacrifices anyway! Qxe7 is threatened. If Kxf7, Qf3+ picks up material. White has a winning attack." }
          ],
          trapMove: 5
        }
      ]
    },
    { san: "Nxf7", explanation: "💥 THE FRIED LIVER! White sacrifices the knight on f7. The king is ripped open." },
    { san: "Kxf7", explanation: "Black must take — the king is dragged out." },
    { san: "Qf3+", explanation: "The queen enters with check! Targeting f6 and the exposed king." },
    { san: "Ke6",  explanation: "The only square — the king staggers to e6, completely exposed." },
    { san: "Nc3",  explanation: "White develops with tempo — threatening Nd5+. Black's king is stranded in the center and White has a devastating attack. The next moves typically involve Nd5+, Qe4, and Black cannot survive." }
  ],
  trapMove: 10
},

// ──────────────────────────────────────────────
// 2. STAFFORD GAMBIT
// ──────────────────────────────────────────────
{
  id: "stafford-gambit",
  name: "Stafford Gambit",
  side: "black",
  summary: "Black sacrifices a pawn in the Petrov Defense for rapid development and devastating tactical chances. At club level, this trap is absolutely lethal.",
  tags: { fun: 5, soundness: 2, difficulty: 2 },
  fallback: "White can decline complications with quiet play (d3, Bd3). The Stafford is considered slightly dubious at master level but extremely dangerous for unprepared White players.",
  moves: [
    { san: "e4",   explanation: "King pawn opening." },
    { san: "e5",   explanation: "Black plays classically." },
    { san: "Nf3",  explanation: "Attack e5." },
    { san: "Nf6",  explanation: "Petrov's Defense — the Russian game." },
    { san: "Nxe5", explanation: "White grabs the pawn." },
    { san: "d6",   explanation: "Black attacks the knight — the Stafford begins!" },
    {
      san: "Nf3",
      explanation: "White retreats — the standard main line.",
      branches: [
        {
          label: "Nxf7?! — The Stafford trap line",
          moves: [
            { san: "Nxf7", explanation: "White gets greedy — grabbing the f7 pawn! This walks into the Stafford trap." },
            { san: "Nxe4", explanation: "Black takes the central pawn — already equal material." },
            { san: "d5", explanation: "Black pushes the d-pawn with tempo, developing the bishop." },
            { san: "d3", explanation: "White tries to hold on." },
            { san: "Bc5", explanation: "Black develops with a nasty threat — Bf2+ is coming." },
            { san: "Qe2", explanation: "White tries to defend." },
            { san: "Bf2+", explanation: "⚡ Check! The bishop crashes in." },
            { san: "Kd1", explanation: "White's king runs to d1 — the only square." },
            { san: "Qd4", explanation: "💥 Black plays the devastating queen move! Threatening Qf2 mate, Nx d3+, and the king is trapped. White is losing massively." }
          ],
          trapMove: 8
        }
      ]
    },
    { san: "Nxe4", explanation: "Black recovers the pawn with interest — equal material now." },
    { san: "d4",   explanation: "White stakes the center." },
    { san: "d5",   explanation: "Black strikes back in the center." },
    { san: "Bd3",  explanation: "White develops the bishop." },
    { san: "Bc5",  explanation: "Black develops aggressively — aiming at f2." },
    { san: "O-O",  explanation: "White castles — trying to get safe." },
    { san: "Re8+", explanation: "⚡ Check! The rook enters with tempo. Black has full compensation and a dangerous attack — the king on e1 is uncomfortable." },
    { san: "Be6",  explanation: "White blocks — but the bishop is now pinned and vulnerable." },
    { san: "Bxc2", explanation: "Black snatches the c2 pawn! Black is up a pawn with a far superior position. White's king is stuck in the center." }
  ],
  trapMove: 5
},

// ──────────────────────────────────────────────
// 3. ENGLUND GAMBIT
// ──────────────────────────────────────────────
{
  id: "englund-gambit",
  name: "Englund Gambit",
  side: "black",
  summary: "After 1.d4 e5?!, Black offers a pawn for quick development and traps. If White gets greedy, the queen sortie is devastating.",
  tags: { fun: 4, soundness: 1, difficulty: 2 },
  fallback: "The Englund is objectively poor — White can simply return the pawn with a better position (2.dxe5 Nf6 3.Nf3 with a healthy extra pawn). But at club level, the traps are lethal.",
  moves: [
    { san: "d4",   explanation: "Queen's pawn opening." },
    { san: "e5",   explanation: "🎲 The Englund Gambit! Black throws a pawn at White." },
    {
      san: "dxe5",
      explanation: "White accepts — the greedy capture.",
      branches: [
        {
          label: "White plays 2.e3 — Declining",
          moves: [
            { san: "e3", explanation: "White declines! A cautious response." },
            { san: "Bb4+", explanation: "Check! The bishop pins on the light squares." },
            { san: "c3", explanation: "White blocks." },
            { san: "Bxc3+", explanation: "Black exchanges — doubling c-pawns." },
            { san: "bxc3", explanation: "White recaptures with doubled pawns." },
            { san: "Nf6", explanation: "Black develops — the position is roughly equal but White's pawn structure is ugly." }
          ]
        }
      ]
    },
    { san: "Nc6",  explanation: "Black attacks e5 and develops." },
    { san: "Nf3",  explanation: "White defends e5 naturally." },
    { san: "Qe7",  explanation: "Black pressures e5 and lines up at the kingside." },
    { san: "Bf4",  explanation: "White defends e5 with the bishop — this looks solid but..." },
    { san: "Qb4+", explanation: "⚡ Check! The queen hits b4 and f4 — the bishop is in trouble." },
    {
      san: "Nc3",
      explanation: "White blocks — forced.",
      branches: [
        {
          label: "Qd2 — White blunders",
          moves: [
            { san: "Qd2", explanation: "⚠️ A horrible mistake — blocking with the queen!" },
            { san: "Qxb2", explanation: "Black takes the b2 pawn — threatening Rb8 and Bb4." },
            { san: "Rd1", explanation: "White tries to develop." },
            { san: "Bb4", explanation: "Black pins the knight! The pressure is immense." },
            { san: "a3", explanation: "White tries to kick the bishop." },
            { san: "Qxa3", explanation: "Black retreats the queen — still threatening everything. Bxc3+ is coming and White is completely lost." }
          ],
          trapMove: 5
        }
      ]
    },
    { san: "Qxf4", explanation: "💥 Black wins the bishop! The Englund gambit has paid off." },
    { san: "e3",   explanation: "White tries to develop." },
    { san: "Nf6",  explanation: "Black develops the knight — threatening Nd5 next." },
    { san: "e6",   explanation: "White blocks the diagonal." },
    { san: "Nd5",  explanation: "🐴 The knight dominates d5! Threatening Nxc7+ forking king and rook. Black is up a full piece with a commanding position — completely winning." }
  ],
  trapMove: 7
},

// ──────────────────────────────────────────────
// 4. LÉGAL'S MATE
// ──────────────────────────────────────────────
{
  id: "legals-mate",
  name: "Légal's Mate",
  side: "white",
  summary: "A beautiful queen sacrifice leading to a smothered-style checkmate. Arises from the Philidor Defense when Black carelessly pins the knight with ...Bg4.",
  tags: { fun: 5, soundness: 4, difficulty: 2 },
  fallback: "If Black doesn't play ...Bg4 (the greedy pin), White just has a normal Philidor position. If Black declines the queen sacrifice with ...Nxe5 instead of ...Bxd1, White plays Bxf7+ Ke7 and is still clearly better.",
  moves: [
    { san: "e4",   explanation: "King pawn opening." },
    { san: "e5",   explanation: "Black plays e5." },
    { san: "Nf3",  explanation: "Develop the knight." },
    { san: "d6",   explanation: "Philidor Defense — solid but passive." },
    { san: "Bc4",  explanation: "White develops the bishop — aiming at f7." },
    { san: "Bg4",  explanation: "⚠️ Black pins the knight to the queen! Looks clever... but it's the setup for the trap." },
    { san: "Nc3",  explanation: "White develops calmly. The knight looks innocent, but it's key to the coming sacrifice." },
    {
      san: "g6",
      explanation: "Black plans ...Bg7 — completely oblivious to the danger.",
      branches: [
        {
          label: "Black plays Nc6 instead",
          moves: [
            { san: "Nc6", explanation: "Black develops the knight — a more cautious move." },
            { san: "Nxe5", explanation: "🔥 Same sacrifice idea! White offers the queen again." },
            { san: "Bxd1", explanation: "Black takes the queen." },
            { san: "Bxf7+", explanation: "Check on f7!" },
            { san: "Ke7", explanation: "The only square." },
            { san: "Nd5#", explanation: "🏆 CHECKMATE! Same Légal's Mate pattern!" }
          ],
          trapMove: 5
        },
        {
          label: "Black declines the queen (Nxe5)",
          moves: [
            { san: "g6", explanation: "Black plays g6." },
            { san: "Nxe5", explanation: "White sacrifices the queen!" },
            { san: "Nxe5", explanation: "⚠️ Black wisely declines — taking the knight instead of the queen. But White is still better!" },
            { san: "Bxf7+", explanation: "White crashes in anyway! Check on f7." },
            { san: "Ke7", explanation: "The king must move." },
            { san: "Qf3", explanation: "White brings the queen in — threatening Qf7# and dominating the position. Black is in serious trouble." }
          ],
          trapMove: 3
        }
      ]
    },
    { san: "Nxe5", explanation: "🔥 QUEEN SACRIFICE! White offers the queen. The knight takes e5, apparently hanging the queen to the pin." },
    { san: "Bxd1", explanation: "Black takes the queen — too tempting! But now..." },
    { san: "Bxf7+", explanation: "💥 Bishop checks on f7! The king must move." },
    { san: "Ke7",  explanation: "The only square." },
    { san: "Nd5#", explanation: "🏆 CHECKMATE! Légal's Mate! The knight delivers the final blow — a stunning queen sacrifice leading to mate in 2 attacks." }
  ],
  trapMove: 8
},

// ──────────────────────────────────────────────
// 5. SCHOLAR'S MATE
// ──────────────────────────────────────────────
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
    {
      san: "Nf6",
      explanation: "⚠️ Black develops the knight... but fails to defend f7! The queen can still take f7.",
      branches: [
        {
          label: "g6 — Black defends correctly",
          moves: [
            { san: "g6", explanation: "✅ The correct defense! Black kicks the queen." },
            { san: "Qf3", explanation: "White retreats the queen." },
            { san: "Nf6", explanation: "Black develops — position is fine. The trap has been avoided." }
          ]
        },
        {
          label: "Qe7 — Black blocks f7",
          moves: [
            { san: "Qe7", explanation: "✅ Another correct defense — the queen guards f7 directly." },
            { san: "Nf3", explanation: "White develops normally." },
            { san: "Nc6", explanation: "Black is fine — nothing doing for White." }
          ]
        }
      ]
    },
    { san: "Qxf7#", explanation: "🏆 CHECKMATE! The queen captures f7 with check — the king has no escape. Scholar's Mate! Game over in 4 moves." }
  ],
  trapMove: 6
},

// ──────────────────────────────────────────────
// 6. BLACKBURNE SHILLING GAMBIT
// ──────────────────────────────────────────────
{
  id: "blackburne-shilling",
  name: "Blackburne Shilling Gambit",
  side: "white",
  summary: "A nasty trap in the Italian Game. After 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4??, White plays Nxe5! threatening Nxf7 — a fork of queen and rook.",
  tags: { fun: 5, soundness: 3, difficulty: 1 },
  fallback: "Black simply shouldn't play 3...Nd4. Normal moves like 3...Bc5 or 3...Nf6 are all fine. This trap only works on beginners who can't resist the apparent attack on the knight.",
  moves: [
    { san: "e4",   explanation: "King pawn opening." },
    { san: "e5",   explanation: "Black mirrors." },
    { san: "Nf3",  explanation: "Develop and attack e5." },
    { san: "Nc6",  explanation: "Black defends e5." },
    { san: "Bc4",  explanation: "Italian Game — bishop aims at f7." },
    { san: "Nd4",  explanation: "⚠️ A terrible move by Black! The knight attacks f3 but creates a fatal weakness on f7." },
    { san: "Nxe5", explanation: "🔥 White grabs the pawn! Now threatening Nxf7 — a fork of queen and rook." },
    {
      san: "Nxf3+",
      explanation: "Black takes the knight with check — trying to get something for the trouble.",
      branches: [
        {
          label: "Qe7 — Black tries to save it",
          moves: [
            { san: "Qe7", explanation: "Black tries to save the position — defending f7 with the queen." },
            { san: "Nxf7", explanation: "White takes anyway! The knight forks queen and rook." },
            { san: "Qxf7", explanation: "Black must take." },
            { san: "Qxf7+", explanation: "White recaptures with check — winning the queen and the exchange. Completely winning." }
          ],
          trapMove: 1
        }
      ]
    },
    { san: "Qxf3", explanation: "White takes the knight — maintaining the threat." },
    { san: "Nf6",  explanation: "Black tries to develop." },
    { san: "Nxf7", explanation: "💥 White takes the rook! The knight on f7 forks the queen and both rooks. Black is down a full rook with no compensation." },
    { san: "Qe7",  explanation: "Black tries to salvage something." },
    { san: "Nxh8", explanation: "White pockets the rook. Black is completely lost — down a rook and a pawn with the knight trapped on h8." }
  ],
  trapMove: 8
},

// ──────────────────────────────────────────────
// 7. ALBIN COUNTER-GAMBIT
// ──────────────────────────────────────────────
{
  id: "albin-counter-gambit",
  name: "Albin Counter-Gambit",
  side: "black",
  summary: "After 1.d4 d5 2.c4 e5?!, Black counter-sacrifices a pawn. The notorious trap is 3.dxe5 d4 4.e3?? Bb4+ 5.Bd2 Bxd2+ and Black wins — but the real main line gives Black excellent play.",
  tags: { fun: 4, soundness: 3, difficulty: 3 },
  fallback: "White should play 3.dxe5 d4 4.Nf3! (not 4.e3??) and holds a slight edge. The Albin is a respectable fighting weapon at club level.",
  moves: [
    { san: "d4",   explanation: "Queen's pawn." },
    { san: "d5",   explanation: "Black plays classically." },
    { san: "c4",   explanation: "Queen's Gambit." },
    { san: "e5",   explanation: "🎲 The Albin Counter-Gambit! Black throws a pawn at White immediately." },
    {
      san: "dxe5",
      explanation: "White accepts — the most natural response.",
      branches: [
        {
          label: "White plays 3.e3 — Declining",
          moves: [
            { san: "e3", explanation: "White declines the gambit cautiously." },
            { san: "Bb4+", explanation: "Check! Black gains tempo." },
            { san: "Nc3", explanation: "White blocks." },
            { san: "dxc4", explanation: "Black takes the c4 pawn." },
            { san: "a3", explanation: "White kicks the bishop." },
            { san: "Be7", explanation: "Black retreats — Black has won the c4 pawn and stands well." }
          ]
        }
      ]
    },
    { san: "d4",   explanation: "Black pushes! The key Albin move — the d-pawn charges forward." },
    {
      san: "e3",
      explanation: "⚠️ THE BLUNDER! 4.e3?? walks right into the trap.",
      branches: [
        {
          label: "4.Nf3 — The correct response",
          moves: [
            { san: "Nf3", explanation: "✅ The right move! White develops normally." },
            { san: "Nc6", explanation: "Black develops." },
            { san: "g3", explanation: "White fianchettos." },
            { san: "Bg4", explanation: "Black develops the bishop — the position is sharp but roughly equal." }
          ]
        }
      ]
    },
    { san: "Bb4+", explanation: "⚡ Check! The bishop enters with discovered attack on the e3 pawn." },
    { san: "Bd2",  explanation: "White blocks — forced." },
    { san: "Bxd2+", explanation: "Black captures with check! Removing the defender." },
    { san: "Nbd2", explanation: "White must recapture — the queen is attacked." },
    { san: "Qe7",  explanation: "Black develops the queen — threatening Bb4 and dominating the light squares. White's development is a mess — the knight on d2 blocks the queen, and d3 is coming. Black has a massive positional advantage plus the d3 pawn is a monster." },
    { san: "Ngf3", explanation: "White tries to develop." },
    { san: "d3",   explanation: "💥 The d-pawn crashes through! It threatens to promote and paralyses White's position. Black is completely winning." }
  ],
  trapMove: 4
},

// ──────────────────────────────────────────────
// 8. NOAH'S ARK TRAP
// ──────────────────────────────────────────────
{
  id: "noahs-ark-trap",
  name: "Noah's Ark Trap",
  side: "black",
  summary: "In the Ruy Lopez, after White's bishop gets chased around by ...a6 ...b5 ...c5, Black traps the bishop on b3 with ...c4. A common and sound trap at club level.",
  tags: { fun: 3, soundness: 5, difficulty: 2 },
  fallback: "White should retreat the bishop to a4 early or exchange on c6. Letting it get boxed in on b3 is the mistake.",
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
    {
      san: "Nc3",
      explanation: "White develops — but doesn't notice the danger.",
      branches: [
        {
          label: "O-O — White castles instead",
          moves: [
            { san: "O-O", explanation: "White castles — a more natural move but still dangerous." },
            { san: "c4", explanation: "🐛 The trap springs! The bishop on b3 is boxed in." },
            { san: "Ba4", explanation: "The bishop tries to escape..." },
            { san: "bxa4", explanation: "Black captures — winning the bishop pair and a pawn. White is in trouble." }
          ],
          trapMove: 1
        }
      ]
    },
    { san: "c4",   explanation: "🐛 TRAPPED! The bishop on b3 has nowhere to go. c4 shuts the door." },
    { san: "Ba4",  explanation: "The bishop tries to flee to a4..." },
    { san: "bxa4", explanation: "Black captures — winning a full piece! The bishop is gone and Black has a winning position." },
    { san: "Nxa4", explanation: "White tries to get some compensation." },
    { san: "d5",   explanation: "Black strikes in the center — the extra piece is decisive. White has no real compensation." }
  ],
  trapMove: 13
},

// ──────────────────────────────────────────────
// 9. PONZIANI TRAP
// ──────────────────────────────────────────────
{
  id: "ponziani-trap",
  name: "Ponziani Trap",
  side: "white",
  summary: "The Ponziani Opening (1.e4 e5 2.Nf3 Nc6 3.c3) looks harmless, but hides a nasty trap after 3...Nf6 4.d4 Nxe4? 5.d5! The knight on e4 is trapped and White wins material.",
  tags: { fun: 4, soundness: 3, difficulty: 2 },
  fallback: "Black should play 3...d5 or 3...f5 instead of 3...Nf6. Even after 3...Nf6, Black should avoid 4...Nxe4 and play 4...d6 or 4...Bb4 instead.",
  moves: [
    { san: "e4",   explanation: "King pawn." },
    { san: "e5",   explanation: "Black responds." },
    { san: "Nf3",  explanation: "Develop the knight." },
    { san: "Nc6",  explanation: "Black defends e5." },
    { san: "c3",   explanation: "The Ponziani! White prepares d4 — looks quiet but has bite." },
    {
      san: "Nf6",
      explanation: "Black develops the knight — entering the danger zone.",
      branches: [
        {
          label: "d5 — Black plays solidly",
          moves: [
            { san: "d5", explanation: "✅ The best response — Black challenges the center immediately." },
            { san: "Qa4", explanation: "White pins the knight on c6." },
            { san: "Bd7", explanation: "Black breaks the pin." },
            { san: "dxe5", explanation: "White captures — the position is roughly equal." }
          ]
        }
      ]
    },
    { san: "d4",   explanation: "White pushes the d-pawn — the center is contested." },
    { san: "Nxe4", explanation: "⚠️ THE BLUNDER! Black grabs the e4 pawn but the knight has nowhere to run." },
    { san: "d5",   explanation: "🔥 TRAP! The pawn attacks the knight on c6 AND the knight on e4 is stranded. White gains a tempo." },
    { san: "Ne7",  explanation: "The knight retreats — the only square. The e4-knight must also flee." },
    { san: "dxc6", explanation: "White captures the knight! Winning a piece." },
    { san: "Nxc6", explanation: "Black recaptures — but White is up the exchange and has a strong center." },
    { san: "d5",   explanation: "White pushes again — the passed d-pawn is a monster. Black is completely lost." }
  ],
  trapMove: 7
},

// ──────────────────────────────────────────────
// 10. OPERA GAME (Morphy's Classic)
// ──────────────────────────────────────────────
{
  id: "opera-game",
  name: "Opera Game Finish",
  side: "white",
  summary: "The famous finishing combination from Morphy's Opera Game. After building up with superior development, White sacrifices the queen on b8 and delivers a picturesque checkmate with rook and bishop.",
  tags: { fun: 5, soundness: 5, difficulty: 3 },
  fallback: "This isn't really a 'trap' — it's a punishment for poor development. The lesson: develop your pieces! Black's position was already lost before the combination.",
  moves: [
    { san: "e4",   explanation: "King pawn — Morphy's favorite." },
    { san: "e5",   explanation: "Black responds." },
    { san: "Nf3",  explanation: "Develop." },
    { san: "d6",   explanation: "Philidor Defense — passive." },
    { san: "d4",   explanation: "White grabs the center." },
    { san: "Bg4",  explanation: "Black pins — but develops poorly." },
    { san: "dxe5", explanation: "White opens up." },
    { san: "Bxf3", explanation: "Black exchanges — forced, or lose the d6 pawn." },
    { san: "Qxf3", explanation: "The queen recaptures with a big lead in development." },
    { san: "dxe5", explanation: "Black takes back." },
    { san: "Bc4",  explanation: "The bishop targets f7 — White is already dominating." },
    { san: "Nf6",  explanation: "Black tries to develop." },
    { san: "Qb3",  explanation: "🔥 Double attack! Qxb7 and Bxf7+ are both threatened. Black is in deep trouble." },
    {
      san: "Qe7",
      explanation: "Black defends b7 but leaves the king exposed.",
      branches: [
        {
          label: "Qb6 — Black defends actively",
          moves: [
            { san: "Qb6", explanation: "Black attacks e3 and b2." },
            { san: "Qxb7", explanation: "White takes the pawn anyway." },
            { san: "Qxb7", explanation: "Black recaptures." },
            { san: "Bxf7+", explanation: "Check! The bishop crashes in." },
            { san: "Kd8", explanation: "The king runs." },
            { san: "Qb8+", explanation: "Queen check! Black must block." },
            { san: "Nxb8", explanation: "Forced." },
            { san: "Rd1+", explanation: "🏆 The rook delivers check — mate follows on the next move. Classic Morphy!" }
          ],
          trapMove: 3
        }
      ]
    },
    { san: "Ng5",  explanation: "White adds another attacker! Threatening Bxf7+ and Qb7+." },
    { san: "Nd7",  explanation: "Black tries to defend f7 with the knight." },
    { san: "Qb7",  explanation: "White takes the pawn — threatening Qxb8+." },
    { san: "Qc8",  explanation: "Black blocks with the queen." },
    { san: "Bxf7+", explanation: "💥 Bishop sacrifice! Check! The king must move." },
    { san: "Kd8",  explanation: "The only square." },
    { san: "Qb8+", explanation: "🔥 QUEEN SACRIFICE! The queen goes to b8 — forcing the knight to take." },
    { san: "Nxb8", explanation: "Forced — the knight captures the queen." },
    { san: "Rd1#", explanation: "🏆 CHECKMATE! The rook slides to d1 — a beautiful finish. The king is trapped on d8 by its own pieces. Morphy's Opera Game!" }
  ],
  trapMove: 19
}

];
