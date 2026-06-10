$(function () {
  let game = new Chess();
  let board = null;
  let moveStack = [];
  const index = buildTrapIndex(TRAPS);
  let playerColor = 'white';

  function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if ((game.turn() === 'w' && playerColor === 'black') ||
        (game.turn() === 'b' && playerColor === 'white')) return false;
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) return false;
  }

  function onDrop(source, target) {
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';
    moveStack.push(move.san);
    updatePanel();
    drawArrow();
  }

  function onSnapEnd() {
    board.position(game.fen());
  }

  function updatePanel() {
    const key = moveStack.join(' ');
    const info = index[key];
    const $state = $('#state-text');

    // Find best matching info – also check if we're in a trap tree at all
    let displayInfo = info;

    if (!displayInfo) {
      // Check if any prefix matches (we deviated)
      let bestMatch = null;
      let bestLen = 0;
      for (const k in index) {
        const kMoves = k.split(' ');
        if (kMoves.length <= moveStack.length) {
          let match = true;
          for (let i = 0; i < kMoves.length; i++) {
            if (kMoves[i] !== moveStack[i]) { match = false; break; }
          }
          if (match && kMoves.length > bestLen) {
            bestLen = kMoves.length;
            bestMatch = index[k];
          }
        }
      }
      if (bestMatch && bestLen < moveStack.length) {
        displayInfo = { name: bestMatch.name, state: 'missed', hint: 'You deviated from the trap line.', fallback: bestMatch.fallback || 'Reset and try again.', children: [] };
      }
    }

    if (displayInfo) {
      $('#trap-name').text(displayInfo.name);
      $state.text(displayInfo.state).removeClass().addClass('state-' + displayInfo.state);
      $('#move-text').text(getRecommendedMove(displayInfo));
      $('#why-text').text(displayInfo.hint || '—');
      const nextChild = (displayInfo.children || [])[0];
      $('#response-text').text(nextChild ? nextChild.hint || nextChild.move : '—');
      $('#fallback-text').text(displayInfo.fallback || '—');
    } else {
      $('#trap-name').text('—');
      $state.text('normal').removeClass().addClass('state-normal');
      $('#move-text').text('—');
      $('#why-text').text('No trap detected in current line.');
      $('#response-text').text('—');
      $('#fallback-text').text('—');
    }

    // Update history
    const hist = game.history();
    let h = '';
    for (let i = 0; i < hist.length; i += 2) {
      h += `${Math.floor(i/2)+1}. ${hist[i]}`;
      if (hist[i+1]) h += ` ${hist[i+1]}`;
      h += '  ';
    }
    $('#history-text').text(h);
  }

  function getRecommendedMove(info) {
    if (!info || !info.children || !info.children.length) return '—';
    // Prefer children with state=setup or state=live
    const best = info.children.find(c => c.state === 'live') ||
                 info.children.find(c => c.state === 'setup') ||
                 info.children.find(c => c.trap) ||
                 info.children[0];
    return best.move + (best.hint ? ' – ' + best.hint : '');
  }

  function drawArrow() {
    // Remove old arrows
    $('.board-arrows').remove();
    const key = moveStack.join(' ');
    const info = index[key];
    if (!info || !info.children || !info.children.length) return;

    const best = info.children.find(c => c.state === 'live' || c.state === 'setup') ||
                 info.children.find(c => c.trap) || info.children[0];

    // Use a temp game to convert SAN to from/to
    const tmpGame = new Chess(game.fen());
    const m = tmpGame.move(best.move);
    if (!m) return;

    const from = m.from;
    const to = m.to;
    const $boardEl = $('#board .board-b72btd');
    if (!$boardEl.length) return;

    const squareSize = $boardEl.width() / 8;
    const fromCol = from.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(from[1]);
    const toCol = to.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(to[1]);
    const isFlipped = playerColor === 'black';

    function adj(r, c) {
      return isFlipped ? [7-r, 7-c] : [r, c];
    }
    const [fc, fr] = adj(fromRow, fromCol);
    const [tc, tr] = adj(toRow, toCol);

    const x1 = fc * squareSize + squareSize/2;
    const y1 = fr * squareSize + squareSize/2;
    const x2 = tc * squareSize + squareSize/2;
    const y2 = tr * squareSize + squareSize/2;

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'board-arrows');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100;';

    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'rgba(255,200,0,0.7)');
    line.setAttribute('stroke-width', squareSize * 0.18);
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(line);

    const defs = document.createElementNS(ns, 'defs');
    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttribute('points', '0 0, 10 3.5, 0 7');
    poly.setAttribute('fill', 'rgba(255,200,0,0.8)');
    marker.appendChild(poly);
    defs.appendChild(marker);
    svg.appendChild(defs);

    $boardEl.css('position', 'relative').append(svg);

    // Draw follow-up arrow (dashed, dimmer) if trap child exists
    if (best.children && best.children.length) {
      const next = best.children[0];
      const tmp2 = new Chess();
      // Play best move first
      tmp2.load(game.fen());
      tmp2.move(best.move);
      const m2 = tmp2.move(next.move);
      if (!m2) return;
      // This is opponent's response, draw in blue
      const from2 = m2.from, to2 = m2.to;
      const fc2 = from2.charCodeAt(0) - 97, fr2 = 8 - parseInt(from2[1]);
      const tc2 = to2.charCodeAt(0) - 97, tr2 = 8 - parseInt(to2[1]);
      const [afc, afr] = adj(fr2, fc2);
      const [atc, atr] = adj(tr2, tc2);
      const x1b = afc * squareSize + squareSize/2;
      const y1b = afr * squareSize + squareSize/2;
      const x2b = atc * squareSize + squareSize/2;
      const y2b = atr * squareSize + squareSize/2;

      const line2 = document.createElementNS(ns, 'line');
      line2.setAttribute('x1', x1b); line2.setAttribute('y1', y1b);
      line2.setAttribute('x2', x2b); line2.setAttribute('y2', y2b);
      line2.setAttribute('stroke', 'rgba(100,180,255,0.5)');
      line2.setAttribute('stroke-width', squareSize * 0.12);
      line2.setAttribute('stroke-linecap', 'round');
      line2.setAttribute('stroke-dasharray', '8,6');
      svg.appendChild(line2);
    }
  }

  function cfg() {
    return {
      draggable: true,
      position: 'start',
      orientation: playerColor,
      onDragStart,
      onDrop,
      onSnapEnd
    };
  }

  board = Chessboard('board', cfg());

  $('#btn-reset').click(() => {
    game = new Chess();
    moveStack = [];
    board.position('start', false);
    board.orientation(playerColor);
    updatePanel();
    $('.board-arrows').remove();
  });

  $('#btn-undo').click(() => {
    if (!moveStack.length) return;
    game.undo();
    moveStack.pop();
    board.position(game.fen());
    updatePanel();
    drawArrow();
  });

  $('#side-select').change(function () {
    playerColor = $(this).val();
    game = new Chess();
    moveStack = [];
    board.destroy();
    board = Chessboard('board', cfg());
    updatePanel();
  });

  updatePanel();
});
