$(function () {
  let board = null;
  let currentTrap = null;
  // Flatten the active line into a single moves array for navigation
  // activeLine: [{ san, explanation, isTrapMove, branchPoint? }]
  let activeLine = [];
  let currentMoveIndex = -1;
  let gameStates = [];
  // branchChoices: map from move index -> which branch is selected (0 = main, 1+ = branch index)
  let branchChoices = {};

  // ─── Flatten moves with branches into a single navigable line ───
  // Returns an array of { san, explanation, isTrapMove, branchMoveIdx?, branchId? }
  function flattenLine(trap) {
    const line = [];
    const mainTrapMove = trap.trapMove;
    let idx = 0;
    for (const move of trap.moves) {
      const isTM = (idx === mainTrapMove);
      const entry = { san: move.san, explanation: move.explanation, isTrapMove: isTM, branchMoveIdx: idx };
      if (move.branches && move.branches.length > 0) {
        entry.branches = move.branches;
        // Check if user has chosen a branch at this point
        const chosen = branchChoices[trap.id + '_' + idx];
        if (chosen !== undefined && chosen > 0) {
          const branch = move.branches[chosen - 1];
          entry.branchLabel = branch.label;
          entry.branchMoves = branch.moves;
          entry.branchTrapMove = branch.trapMove;
        }
      }
      line.push(entry);
      idx++;
      // If a branch was chosen, we stop the main line here
      if (entry.branchMoves) break;
    }
    // If a branch was chosen, append branch moves
    if (line.length > 0 && line[line.length - 1].branchMoves) {
      const lastEntry = line[line.length - 1];
      let bIdx = 0;
      for (const bm of lastEntry.branchMoves) {
        line.push({
          san: bm.san,
          explanation: bm.explanation,
          isTrapMove: lastEntry.branchTrapMove !== undefined && bIdx === lastEntry.branchTrapMove,
          isBranchMove: true
        });
        bIdx++;
      }
    }
    return line;
  }

  // ─── Library View ───
  function renderLibrary() {
    const $grid = $('#trap-grid').empty();
    TRAPS.forEach(trap => {
      const tags = Object.entries(trap.tags || {}).map(([k, v]) => {
        return `<span class="tag${k === 'fun' ? ' tag-fun' : ''}">${k} ${'★'.repeat(v)}</span>`;
      }).join('');
      const sideClass = trap.side === 'white' ? 'badge-white' : 'badge-black';
      const moves = trap.moves.map(m => m.san).join(' ');
      const branchCount = trap.moves.filter(m => m.branches && m.branches.length > 0).length;
      const branchBadge = branchCount > 0
        ? `<span class="tag" style="background:#2a1a4a;color:#c8a0ff;">${branchCount} branch${branchCount > 1 ? 'es' : ''}</span>`
        : '';
      $grid.append(`
        <div class="trap-card" data-id="${trap.id}">
          <h3>${trap.name}</h3>
          <div class="card-meta">
            <span class="badge ${sideClass}">${trap.side}</span>
            ${tags}
            ${branchBadge}
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
    branchChoices = {};
    currentMoveIndex = -1;
    rebuildLine();

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

    // Board orientation
    const orient = trap.side === 'black' ? 'black' : 'white';
    if (board) board.destroy();
    board = Chessboard('board', { position: 'start', orientation: orient, draggable: false, pieceTheme: 'assets/chesspieces/wikipedia/{piece}.png' });

    // Show trap view
    $('#library-view').hide();
    $('#trap-view').show();

    updateStep();
  }

  function rebuildLine() {
    activeLine = flattenLine(currentTrap);
    precomputeStates();
    buildMoveList();
  }

  function precomputeStates() {
    gameStates = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'];
    const tmpGame = new Chess();
    for (const entry of activeLine) {
      const m = tmpGame.move(entry.san);
      if (!m) { console.error('Invalid move:', entry.san, 'in trap:', currentTrap.name); break; }
      gameStates.push(tmpGame.fen());
    }
  }

  function buildMoveList() {
    let html = '';
    for (let i = 0; i < activeLine.length; i += 2) {
      const num = Math.floor(i / 2) + 1;
      const wMove = activeLine[i];
      const bMove = activeLine[i + 1];
      const wClass = wMove.isTrapMove ? ' trap-move' : '';
      const bClass = bMove && bMove.isTrapMove ? ' trap-move' : '';
      html += `<span class="move-pair">`;
      html += `<span class="move-num">${num}.</span>`;
      html += `<span class="move-san${wClass}" data-idx="${i}">${wMove.san}</span> `;
      if (bMove) {
        html += `<span class="move-san${bClass}" data-idx="${i + 1}">${bMove.san}</span> `;
      }
      html += `</span>`;
    }
    // Branch selector if applicable
    const branchIdx = activeLine.findIndex(e => e.branches);
    if (branchIdx >= 0) {
      const entry = activeLine[branchIdx];
      html += `<div class="branch-selector">`;
      html += `<span class="branch-label">🔀 Variations at move ${branchIdx + 1}:</span>`;
      html += `<button class="branch-btn active" data-choice="0">Main line</button>`;
      entry.branches.forEach((b, bi) => {
        html += `<button class="branch-btn" data-choice="${bi + 1}">${b.label}</button>`;
      });
      html += `</div>`;
    }
    $('#move-list').html(html);
    // Move click handlers
    $('#move-list .move-san').off('click').on('click', function () {
      currentMoveIndex = parseInt($(this).data('idx'));
      updateStep();
    });
    // Branch button handlers
    $('#move-list .branch-btn').off('click').on('click', function () {
      const choice = parseInt($(this).data('choice'));
      const branchIdx2 = activeLine.findIndex(e => e.branches);
      if (branchIdx2 >= 0) {
        const key = currentTrap.id + '_' + activeLine[branchIdx2].branchMoveIdx;
        branchChoices[key] = choice;
        // Remember where we were
        const savedIdx = Math.min(currentMoveIndex, branchIdx2);
        rebuildLine();
        currentMoveIndex = savedIdx;
        updateStep();
      }
    });
  }

  // ─── Step through ───
  function updateStep() {
    if (!currentTrap) return;
    const totalMoves = activeLine.length;
    const idx = currentMoveIndex;

    // Counter
    $('#move-counter').text(`${idx + 1} / ${totalMoves}`);

    // Board
    board.position(gameStates[idx + 1] || gameStates[0], false);

    // Move notation & explanation
    if (idx >= 0 && idx < totalMoves) {
      const move = activeLine[idx];
      const moveNum = Math.floor(idx / 2) + 1;
      const prefix = idx % 2 === 0 ? `${moveNum}.` : `${moveNum}...`;
      const branchTag = move.isBranchMove ? ' [variation]' : '';
      $('#notation-text').text(`${prefix} ${move.san}${branchTag}`);
      $('#explanation-text').text(move.explanation);

      // Highlight trap moment
      if (move.isTrapMove) {
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

    // Update branch button active state
    const branchIdx = activeLine.findIndex(e => e.branches);
    if (branchIdx >= 0) {
      const key = currentTrap.id + '_' + activeLine[branchIdx].branchMoveIdx;
      const chosen = branchChoices[key] || 0;
      $('#move-list .branch-btn').removeClass('active');
      $(`#move-list .branch-btn[data-choice="${chosen}"]`).addClass('active');
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
  $('#btn-next').click(() => { if (currentTrap && currentMoveIndex < activeLine.length - 1) { currentMoveIndex++; updateStep(); } });
  $('#btn-end').click(() => { if (currentTrap) { currentMoveIndex = activeLine.length - 1; updateStep(); } });
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
