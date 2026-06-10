// Trap tree: each node has move (SAN), and branches to children.
// "moves" is the move played to reach this node from parent.
// "children" are possible continuations.
// "trap" marks trap completion nodes.

const TRAPS = [
  {
    name: "Fried Liver Attack",
    eco: "C27",
    children: [
      { move: "e4", children: [
        { move: "e5", children: [
          { move: "Nf3", children: [
            { move: "Nc6", children: [
              { move: "Bc4", children: [
                { move: "Nf6", hint: "Main line – heading into Fried Liver territory", children: [
                  { move: "Ng5", state: "setup", hint: "Threatening Nxf7 – the trap is being set", children: [
                    { move: "d5", hint: "Only real try", children: [
                      { move: "exd5", children: [
                        { move: "Na5", hint: "Trying to trade off the bishop", children: [
                          { move: "Bb5+", state: "live", hint: "Crushing! The Fried Liver is fully live", children: [
                            { move: "c6", hint: "Forced", children: [
                              { move: "dxc6", children: [
                                { move: "bxc6", hint: "Black is lost – White has a devastating attack", trap: true }
                              ]}
                            ]}
                          ]}
                        ]},
                        { move: "Nd4", hint: "Dubious", children: [
                          { move: "d6", state: "live", hint: "Very strong for White", trap: true }
                        ]},
                        { move: "Nxd5", hint: "Blunder into the trap!", children: [
                          { move: "Nxf7", state: "live", hint: "Fried Liver! King is torn open", trap: true }
                        ]}
                      ]}
                    ]},
                    { move: "Bc5", hint: "Alternative but White is better", children: [
                      { move: "Nxf7", state: "live", hint: "Sacrifice on f7!", trap: true }
                    ]}
                  ]}
                ]},
                { move: "Be7", hint: "Weak – lose castling rights or worse", fallback: "2...Be7 is passive; better is 2...Nf6", children: [] }
              ]}
            ]},
            { move: "d6", fallback: "2...d6 is passive. Better is 2...Nc6", children: [] }
          ]}
        ]},
        { move: "c5", fallback: "Sicilian – different opening", children: [] }
      ]}
    ]
  },
  {
    name: "Scholar's Mate",
    eco: "C20",
    children: [
      { move: "e4", children: [
        { move: "e5", children: [
          { move: "Bc4", children: [
            { move: "Nc6", children: [
              { move: "Qh5", state: "setup", hint: "Threatening Qxf7#", children: [
                { move: "Nf6", hint: "Blocks the threat but...", children: [
                  { move: "Qxf7#", state: "live", hint: "Checkmate! Scholar's Mate", trap: true }
                ]},
                { move: "g6", hint: "Runs away but weakens", children: [
                  { move: "Qf3", state: "setup", hint: "Still threatening f7", children: [] }
                ]},
                { move: "Qe7", hint: "Defends f7", children: [
                  { move: "Nf3", hint: "Normal development – White has a good position", children: [] }
                ]}
              ]}
            ]}
          ]}
        ]}
      ]}
    ]
  },
  {
    name: "Légal's Mate",
    eco: "C40",
    children: [
      { move: "e4", children: [
        { move: "e5", children: [
          { move: "Nf3", children: [
            { move: "d6", children: [
              { move: "Bc4", children: [
                { move: "Bg4", hint: "Pinning the knight – but it's a trap!", children: [
                  { move: "Nc3", state: "setup", hint: "Developing, luring Black into comfort", children: [
                    { move: "g6", hint: "Planning Bg7 but oblivious", children: [
                      { move: "Nxe5", state: "live", hint: "Sacrifice! Bxd1 is poisoned", children: [
                        { move: "Bxd1", hint: "Takes the queen – but it's doomed", children: [
                          { move: "Bxf7+", state: "live", hint: "Check! King exposed", children: [
                            { move: "Ke7", children: [
                              { move: "Nd5#", state: "live", hint: "Checkmate! Légal's Mate", trap: true }
                            ]}
                          ]}
                        ]},
                        { move: "dxe5", fallback: "Declines the queen – still playable", children: [] }
                      ]}
                    ]},
                    { move: "Nc6", hint: "Developing normally", children: [
                      { move: "Nxe5", state: "setup", hint: "Still dangerous", children: [
                        { move: "Nxe5", children: [
                          { move: "d4", hint: "Strong center", children: [] }
                        ]}
                      ]}
                    ]}
                  ]}
                ]},
                { move: "Nf6", hint: "Good defense", children: [
                  { move: "Nc3", hint: "Normal development", children: [] }
                ]}
              ]}
            ]},
            { move: "Nc6", fallback: "2...Nc6 – normal Italian/Spanish territory", children: [] }
          ]}
        ]}
      ]}
    ]
  }
];

// Build a flat lookup: normalized move sequence -> matching node info
function buildTrapIndex(traps) {
  const index = {};
  for (const trap of traps) {
    for (const root of trap.children) {
      walk(root, trap.name, [root.move]);
    }
  }
  function walk(node, name, moves) {
    const key = moves.join(' ');
    index[key] = {
      name,
      state: node.state || (node.trap ? 'live' : 'normal'),
      hint: node.hint || '',
      fallback: node.fallback || '',
      trap: !!node.trap,
      children: node.children,
      moves: [...moves]
    };
    for (const child of node.children) {
      walk(child, name, [...moves, child.move]);
    }
  }
  return index;
}
