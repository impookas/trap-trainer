$(function () {
  let board = null;
  let currentTrap = null;
  let currentMoveIndex = -1;  // -1 = starting position
  let gameStates = [];         // FEN for each move index (-1 through moves.length-1)

  // ─── Library View ───
  function renderLibrary() {
    const $grid = $('#trap-grid').empty();
    TRAPS.forEach(trap => {
      const tags = Object.entries(trap.tags || {}).map(([k, v]) => {
        return `<span class="tag${k === 'fun' ? ' tag-fun' : ''}">${k} ${'★'.repeat(v)}</span>`;
      }).join('');
      const sideClass = trap.side === 'white' ? 'badge-white' : 'badge-black';
      const moves = trap.moves.map(m => m.san).join(' ');
      $grid.append(`
        <div class="trap-card" data-id="${trap.id}">
          <h3>${trap.name}</h3>
          <div class="card-meta">
            <span class="badge ${sideClass}">${trap.side}</span>
            ${tags}
          </div>
          <div class="card-summary">${trap.summary}</div>
          <div style="margin-top:8px;font-family:monospace;font-size:0.78rem;color:#666;">${moves}</div>
        </div>
      `);
    });
    $('.trap-card').on('click', function () {
      const id = $(this).data('id');
      const trap = TRAPS.find(t => t.id === id);
      if (trap) openTrap(trap);
    });
  }

  // ─── Open a trap ───
  function openTrap(trap) {
    currentTrap = trap;
    currentMoveIndex = -1;

    // Pre-compute game states
    gameStates = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']; // start
    const tmpGame = new Chess();
    for (const move of trap.moves) {
      const m = tmpGame.move(move.san);
      if (!m) { console.error('Invalid move:', move.san, 'in trap:', trap.name); break; }
      gameStates.push(tmpGame.fen());
    }

    // Update header
    $('#trap-title').text(trap.name);
    const sideClass = trap.side === 'white' ? 'badge-white' : 'badge-black';
    $('#trap-side-badge').attr('class', 'badge ' + sideClass).text(trap.side);
    const tags = Object.entries(trap.tags || {}).map(([k, v]) => {
      return `<span class="tag${k === 'fun' ? ' tag-fun' : ''}">${k} ${'★'.repeat(v)}</span>`;
    }).join('');
    $('#trap-tags').html(tags);

    // Panel static content
    $('#fallback-text').text(trap.fallback || '—');
    $('#summary-text').text(trap.summary);

    // Build move list
    buildMoveList(trap);

    // Board orientation
    const orient = trap.side === 'black' ? 'black' : 'white';
    if (board) board.destroy();
    board = Chessboard('board', { position: 'start', orientation: orient, draggable: false, pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png' });

    // Show trap view
    $('#library-view').hide();
    $('#trap-view').show();

    updateStep();
  }

  function buildMoveList(trap) {
    let html = '';
    for (let i = 0; i < trap.moves.length; i += 2) {
      const num = Math.floor(i / 2) + 1;
      const whiteMove = trap.moves[i];
      const blackMove = trap.moves[i + 1];
      const whiteClass = whiteMove && trap.trapMove === i ? ' trap-move' : '';
      const blackClass = blackMove && trap.trapMove === i + 1 ? ' trap-move' : '';
      html += `<span class="move-pair">`;
      html += `<span class="move-num">${num}.</span>`;
      html += `<span class="move-san${whiteClass}" data-idx="${i}">${whiteMove.san}</span> `;
      if (blackMove) {
        html += `<span class="move-san${blackClass}" data-idx="${i + 1}">${blackMove.san}</span> `;
      }
      html += `</span>`;
    }
    $('#move-list').html(html);
    $('#move-list .move-san').on('click', function () {
      currentMoveIndex = parseInt($(this).data('idx'));
      updateStep();
    });
  }

  // ─── Step through ───
  function updateStep() {
    if (!currentTrap) return;
    const totalMoves = currentTrap.moves.length;
    const idx = currentMoveIndex;

    // Counter
    $('#move-counter').text(`${idx + 1} / ${totalMoves}`);

    // Board
    board.position(gameStates[idx + 1] || gameStates[0], false);

    // Move notation & explanation
    if (idx >= 0 && idx < totalMoves) {
      const move = currentTrap.moves[idx];
      const moveNum = Math.floor(idx / 2) + 1;
      const prefix = idx % 2 === 0 ? `${moveNum}.` : `${moveNum}...`;
      $('#notation-text').text(`${prefix} ${move.san}`);
      $('#explanation-text').text(move.explanation);

      // Highlight trap moment
      if (idx === currentTrap.trapMove) {
        $('#trap-moment-box').show();
        $('#trap-moment-text').text(move.explanation);
      } else {
        $('#trap-moment-box').hide();
      }
    } else {
      $('#notation-text').text('Starting position');
      $('#explanation-text').text('The starting position. Press ▶ Next to step through the trap.');
      $('#trap-moment-box').hide();
    }

    // Highlight active move in list
    $('#move-list .move-san').removeClass('active');
    if (idx >= 0) {
      $(`#move-list .move-san[data-idx="${idx}"]`).addClass('active');
    }

    // Auto-scroll move list
    const $active = $('#move-list .move-san.active');
    if ($active.length) {
      $active[0].scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }

  // ─── Controls ───
  $('#btn-back').click(() => {
    $('#trap-view').hide();
    $('#library-view').show();
    if (board) { board.destroy(); board = null; }
  });

  $('#btn-start').click(() => { currentMoveIndex = -1; updateStep(); });
  $('#btn-prev').click(() => { if (currentMoveIndex > -1) { currentMoveIndex--; updateStep(); } });
  $('#btn-next').click(() => { if (currentTrap && currentMoveIndex < currentTrap.moves.length - 1) { currentMoveIndex++; updateStep(); } });
  $('#btn-end').click(() => { if (currentTrap) { currentMoveIndex = currentTrap.moves.length - 1; updateStep(); } });
  $('#btn-flip').click(() => { if (board) board.flip(); });

  // Keyboard
  $(document).on('keydown', function (e) {
    if ($('#trap-view').is(':hidden')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); $('#btn-next').click(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); $('#btn-prev').click(); }
    else if (e.key === 'Home') { e.preventDefault(); $('#btn-start').click(); }
    else if (e.key === 'End') { e.preventDefault(); $('#btn-end').click(); }
    else if (e.key === 'Escape') { $('#btn-back').click(); }
  });

  // Init
  renderLibrary();
});
