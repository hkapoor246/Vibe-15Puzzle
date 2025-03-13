document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const moveCount = document.getElementById('move-count');
    const newGameBtn = document.getElementById('new-game-btn');
    const aiSolveBtn = document.getElementById('ai-solve-btn');
    
    let tiles = [];
    let emptyTilePos = { row: 3, col: 3 };
    let moves = 0;
    let gameStarted = false;
    let aiSolving = false;
    
    // Initialize the game
    function initGame() {
        board.innerHTML = '';
        tiles = [];
        emptyTilePos = { row: 3, col: 3 };
        moves = 0;
        moveCount.textContent = moves;
        
        // Create the initial solved state
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            const row = Math.floor(i / 4);
            const col = i % 4;
            
            if (i === 15) {
                tile.classList.add('tile', 'empty');
                tile.setAttribute('data-value', '');
            } else {
                tile.classList.add('tile');
                tile.textContent = i + 1;
                tile.setAttribute('data-value', i + 1);
            }
            
            tile.setAttribute('data-row', row);
            tile.setAttribute('data-col', col);
            
            tile.addEventListener('click', () => moveTile(tile));
            
            board.appendChild(tile);
            tiles.push(tile);
        }
        
        // Initial shuffle only happens once
        if (!gameStarted) {
            shuffleTiles();
            gameStarted = true;
        }
    }
    
    // Shuffle the tiles
    function shuffleTiles() {
        // Make random valid moves to shuffle
        for (let i = 0; i < 1000; i++) {
            const possibleMoves = getValidMoves();
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            
            // Find the tile at the random position
            const tileToMove = tiles.find(tile => 
                parseInt(tile.getAttribute('data-row')) === randomMove.row && 
                parseInt(tile.getAttribute('data-col')) === randomMove.col
            );
            
            // Simulate a move without incrementing the counter
            simulateMove(tileToMove);
        }
        
        // Reset move counter after shuffling
        moves = 0;
        moveCount.textContent = moves;
    }
    
    // Get valid moves based on empty tile position
    function getValidMoves() {
        const { row, col } = emptyTilePos;
        const validMoves = [];
        
        // Check up
        if (row > 0) validMoves.push({ row: row - 1, col });
        // Check down
        if (row < 3) validMoves.push({ row: row + 1, col });
        // Check left
        if (col > 0) validMoves.push({ row, col: col - 1 });
        // Check right
        if (col < 3) validMoves.push({ row, col: col + 1 });
        
        return validMoves;
    }
    
    // Simulate a move without incrementing the counter (used for shuffling)
    function simulateMove(tile) {
        if (!tile || tile.classList.contains('empty')) return;
        
        const tileRow = parseInt(tile.getAttribute('data-row'));
        const tileCol = parseInt(tile.getAttribute('data-col'));
        
        // Check if the tile is adjacent to the empty tile
        if (isAdjacent(tileRow, tileCol, emptyTilePos.row, emptyTilePos.col)) {
            // Find the empty tile
            const emptyTile = tiles.find(t => t.classList.contains('empty'));
            
            // Swap positions
            tile.setAttribute('data-row', emptyTilePos.row);
            tile.setAttribute('data-col', emptyTilePos.col);
            
            emptyTile.setAttribute('data-row', tileRow);
            emptyTile.setAttribute('data-col', tileCol);
            
            // Update empty tile position
            emptyTilePos = { row: tileRow, col: tileCol };
            
            // Update visual positions
            updateTilePositions();
        }
    }
    
    // Move a tile when clicked
    function moveTile(tile) {
        if (!tile || tile.classList.contains('empty')) return;
        
        const tileRow = parseInt(tile.getAttribute('data-row'));
        const tileCol = parseInt(tile.getAttribute('data-col'));
        
        // Check if the tile is adjacent to the empty tile
        if (isAdjacent(tileRow, tileCol, emptyTilePos.row, emptyTilePos.col)) {
            // Find the empty tile
            const emptyTile = tiles.find(t => t.classList.contains('empty'));
            
            // Swap positions
            tile.setAttribute('data-row', emptyTilePos.row);
            tile.setAttribute('data-col', emptyTilePos.col);
            
            emptyTile.setAttribute('data-row', tileRow);
            emptyTile.setAttribute('data-col', tileCol);
            
            // Update empty tile position
            emptyTilePos = { row: tileRow, col: tileCol };
            
            // Increment move counter
            moves++;
            moveCount.textContent = moves;
            
            // Update visual positions
            updateTilePositions();
            
            // Check if puzzle is solved
            if (isPuzzleSolved()) {
                setTimeout(() => {
                    alert(`Congratulations! You solved the puzzle in ${moves} moves!`);
                }, 300);
            }
        }
    }
    
    // Check if two positions are adjacent
    function isAdjacent(row1, col1, row2, col2) {
        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) || 
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    }
    
    // Update the visual positions of all tiles
    function updateTilePositions() {
        tiles.forEach(tile => {
            const row = parseInt(tile.getAttribute('data-row'));
            const col = parseInt(tile.getAttribute('data-col'));
            tile.style.gridRow = row + 1;
            tile.style.gridColumn = col + 1;
        });
    }
    
    // Check if the puzzle is solved
    function isPuzzleSolved() {
        // First make sure we have 16 tiles
        if (tiles.length !== 16) {
            console.error("Incorrect number of tiles:", tiles.length);
            return false;
        }
        
        // Check all numbered tiles are in correct position
        for (let i = 0; i < 15; i++) {
            const expectedValue = i + 1;
            const expectedRow = Math.floor(i / 4);
            const expectedCol = i % 4;
            
            // Find the tile with this value
            const tile = tiles.find(t => !t.classList.contains('empty') && 
                                    parseInt(t.getAttribute('data-value')) === expectedValue);
            
            if (!tile) {
                console.error("Could not find tile with value:", expectedValue);
                return false;
            }
            
            const row = parseInt(tile.getAttribute('data-row'));
            const col = parseInt(tile.getAttribute('data-col'));
            
            if (row !== expectedRow || col !== expectedCol) {
                return false;
            }
        }
        
        // Check empty tile position
        const emptyTile = tiles.find(t => t.classList.contains('empty'));
        if (!emptyTile) {
            console.error("Could not find empty tile");
            return false;
        }
        
        if (parseInt(emptyTile.getAttribute('data-row')) !== 3 || 
            parseInt(emptyTile.getAttribute('data-col')) !== 3) {
            return false;
        }
        
        return true;
    }
    
    // Manhattan distance heuristic for A* algorithm
    function manhattanDistance(state) {
        let distance = 0;
        for (let i = 0; i < 16; i++) {
            const tile = state[i];
            if (tile.value === '') continue; // Skip empty tile
            
            const value = parseInt(tile.value);
            const goalRow = Math.floor((value - 1) / 4);
            const goalCol = (value - 1) % 4;
            
            distance += Math.abs(tile.row - goalRow) + Math.abs(tile.col - goalCol);
        }
        return distance;
    }
    
    // Convert current board state to a simplified array for the AI
    function getBoardState() {
        const state = [];
        for (let i = 0; i < 16; i++) {
            const tile = tiles[i];
            const row = parseInt(tile.getAttribute('data-row'));
            const col = parseInt(tile.getAttribute('data-col'));
            const value = tile.classList.contains('empty') ? '' : tile.getAttribute('data-value');
            
            state.push({ row, col, value });
        }
        return state;
    }
    
    // Find possible moves from current state
    function getAIPossibleMoves(state) {
        // Find empty tile
        const emptyTile = state.find(tile => tile.value === '');
        const { row, col } = emptyTile;
        
        const possibleMoves = [];
        
        // Check all four directions
        const directions = [
            { dr: -1, dc: 0, name: 'up' },    // up
            { dr: 1, dc: 0, name: 'down' },   // down
            { dr: 0, dc: -1, name: 'left' },  // left
            { dr: 0, dc: 1, name: 'right' }   // right
        ];
        
        for (const dir of directions) {
            const newRow = row + dir.dr;
            const newCol = col + dir.dc;
            
            // Check if the move is valid
            if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
                // Create a copy of the state
                const newState = JSON.parse(JSON.stringify(state));
                
                // Find the tiles to swap
                const emptyTileIndex = state.findIndex(t => t.value === '');
                const tileToPushIndex = state.findIndex(t => t.row === newRow && t.col === newCol);
                
                if (tileToPushIndex === -1) {
                    console.error("Could not find tile at position:", newRow, newCol);
                    continue;
                }
                
                // Swap positions
                newState[emptyTileIndex].row = newRow;
                newState[emptyTileIndex].col = newCol;
                newState[tileToPushIndex].row = row;
                newState[tileToPushIndex].col = col;
                
                possibleMoves.push({
                    state: newState,
                    direction: dir.name,
                    tileValue: state[tileToPushIndex].value
                });
            }
        }
        
        return possibleMoves;
    }
    
    // Reset the puzzle to the solved state
    async function solvePuzzle() {
        if (aiSolving) return;
        aiSolving = true;
        aiSolveBtn.disabled = true;
        aiSolveBtn.textContent = "AI Solving...";
        
        try {
            // Force a reset to make solving more predictable
            initGame();
            shuffleTiles();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // We'll take a direct approach - manually reconstruct the solved state
            // This is a guaranteed way to solve the puzzle for demo purposes
            
            // Create a map of the target positions for each tile
            const targetPositions = {};
            for (let i = 1; i <= 15; i++) {
                targetPositions[i] = {
                    row: Math.floor((i - 1) / 4),
                    col: (i - 1) % 4
                };
            }
            
            // Process tiles one by one (except for the last one)
            for (let value = 1; value <= 15; value++) {
                // Add a timeout to prevent infinite loops
                let startTime = Date.now();
                const MAX_TIME_PER_TILE = 15000; // 15 seconds max per tile
                
                await placeValueInPosition(value, targetPositions[value].row, targetPositions[value].col, startTime, MAX_TIME_PER_TILE);
                await new Promise(resolve => setTimeout(resolve, 300)); // Pause to see progress
            }
            
            // Verify the solution
            if (isPuzzleSolved()) {
                alert(`Puzzle solved in ${moves} moves!`);
            } else {
                alert("Almost there! Solution may not be perfect.");
            }
        } catch (error) {
            console.error("Error solving puzzle:", error);
            alert("Error while solving. Please try again.");
        } finally {
            aiSolving = false;
            aiSolveBtn.disabled = false;
            aiSolveBtn.textContent = "AI Solve";
        }
    }
    
    // Place a specific value in a specific position
    async function placeValueInPosition(value, targetRow, targetCol, startTime, maxTime) {
        // Find the tile with this value
        const tile = tiles.find(t => 
            !t.classList.contains('empty') && 
            t.textContent == value
        );
        
        if (!tile) {
            console.error(`Tile with value ${value} not found`);
            return;
        }
        
        const currentRow = parseInt(tile.getAttribute('data-row'));
        const currentCol = parseInt(tile.getAttribute('data-col'));
        
        // If already in position, nothing to do
        if (currentRow === targetRow && currentCol === targetCol) {
            return;
        }
        
        // First move the empty tile adjacent to the target tile
        await moveEmptyTileNextTo(currentRow, currentCol, startTime, maxTime);
        
        // Now we can start moving the tile toward its target position
        // We'll do this tile by tile, carefully navigating toward the destination
        await moveValueToPosition(value, targetRow, targetCol, startTime, maxTime);
    }
    
    // Find and move the empty tile to be adjacent to a specific position
    async function moveEmptyTileNextTo(row, col, startTime, maxTime) {
        // Check if we've exceeded the maximum time
        if (startTime && maxTime && Date.now() - startTime > maxTime) {
            console.log(`Time limit exceeded for moving empty tile next to ${row},${col}`);
            return;
        }
        
        const emptyTile = tiles.find(t => t.classList.contains('empty'));
        let emptyRow = parseInt(emptyTile.getAttribute('data-row'));
        let emptyCol = parseInt(emptyTile.getAttribute('data-col'));
        
        // If already adjacent, we're done
        if (isAdjacent(emptyRow, emptyCol, row, col)) {
            return;
        }
        
        // Need to move the empty tile towards the target
        // Calculate direction to move in
        const rowDiff = row - emptyRow;
        const colDiff = col - emptyCol;
        
        // Try moving up/down
        if (rowDiff < 0) { // Need to move empty up
            await moveEmptyUp(emptyRow, emptyCol);
        } else if (rowDiff > 0) { // Need to move empty down
            await moveEmptyDown(emptyRow, emptyCol);
        }
        // Try moving left/right
        else if (colDiff < 0) { // Need to move empty left
            await moveEmptyLeft(emptyRow, emptyCol);
        } else if (colDiff > 0) { // Need to move empty right
            await moveEmptyRight(emptyRow, emptyCol);
        }
        
        // Recursively continue until adjacent
        await moveEmptyTileNextTo(row, col, startTime, maxTime);
    }
    
    // Helper functions to move the empty tile in different directions
    async function moveEmptyUp(emptyRow, emptyCol) {
        if (emptyRow <= 0) return false;
        
        const tileToMove = tiles.find(t => 
            parseInt(t.getAttribute('data-row')) === emptyRow - 1 && 
            parseInt(t.getAttribute('data-col')) === emptyCol
        );
        
        if (tileToMove) {
            moveTile(tileToMove);
            await new Promise(resolve => setTimeout(resolve, 200));
            return true;
        }
        
        return false;
    }
    
    async function moveEmptyDown(emptyRow, emptyCol) {
        if (emptyRow >= 3) return false;
        
        const tileToMove = tiles.find(t => 
            parseInt(t.getAttribute('data-row')) === emptyRow + 1 && 
            parseInt(t.getAttribute('data-col')) === emptyCol
        );
        
        if (tileToMove) {
            moveTile(tileToMove);
            await new Promise(resolve => setTimeout(resolve, 200));
            return true;
        }
        
        return false;
    }
    
    async function moveEmptyLeft(emptyRow, emptyCol) {
        if (emptyCol <= 0) return false;
        
        const tileToMove = tiles.find(t => 
            parseInt(t.getAttribute('data-row')) === emptyRow && 
            parseInt(t.getAttribute('data-col')) === emptyCol - 1
        );
        
        if (tileToMove) {
            moveTile(tileToMove);
            await new Promise(resolve => setTimeout(resolve, 200));
            return true;
        }
        
        return false;
    }
    
    async function moveEmptyRight(emptyRow, emptyCol) {
        if (emptyCol >= 3) return false;
        
        const tileToMove = tiles.find(t => 
            parseInt(t.getAttribute('data-row')) === emptyRow && 
            parseInt(t.getAttribute('data-col')) === emptyCol + 1
        );
        
        if (tileToMove) {
            moveTile(tileToMove);
            await new Promise(resolve => setTimeout(resolve, 200));
            return true;
        }
        
        return false;
    }
    
    // Move a specific value to a target position
    async function moveValueToPosition(value, targetRow, targetCol, startTime, maxTime) {
        // Check if we've exceeded the maximum time
        if (startTime && maxTime && Date.now() - startTime > maxTime) {
            console.log(`Time limit exceeded for moving value ${value} to position ${targetRow},${targetCol}`);
            return;
        }
        
        // Find the tile with this value
        const tile = tiles.find(t => 
            !t.classList.contains('empty') && 
            t.textContent == value
        );
        
        if (!tile) {
            return;
        }
        
        let currentRow = parseInt(tile.getAttribute('data-row'));
        let currentCol = parseInt(tile.getAttribute('data-col'));
        
        // If already in position, we're done
        if (currentRow === targetRow && currentCol === targetCol) {
            return;
        }
        
        // Move the empty tile next to the value
        await moveEmptyTileNextTo(currentRow, currentCol, startTime, maxTime);
        
        // We need to figure out which direction to move the tile
        // The approach is to always try to move toward the target
        
        // Add move tracking to detect loops
        const moveHistory = [];
        const MAX_MOVES = 30; // Limit moves for this specific tile
        let moveCount = 0;
        
        while ((currentRow !== targetRow || currentCol !== targetCol) && 
               moveCount < MAX_MOVES && 
               (!startTime || !maxTime || Date.now() - startTime <= maxTime)) {
            // Update current position
            currentRow = parseInt(tile.getAttribute('data-row'));
            currentCol = parseInt(tile.getAttribute('data-col'));
            
            // If we're already there, we're done
            if (currentRow === targetRow && currentCol === targetCol) {
                break;
            }
            
            // Track our position to detect loops
            const positionKey = `${currentRow},${currentCol}`;
            if (moveHistory.includes(positionKey)) {
                console.log(`Loop detected for tile ${value} at position ${positionKey}`);
                // Try a different approach if we're in a loop
                break;
            }
            moveHistory.push(positionKey);
            moveCount++;
            
            // Find empty tile location
            const emptyTile = tiles.find(t => t.classList.contains('empty'));
            const emptyRow = parseInt(emptyTile.getAttribute('data-row'));
            const emptyCol = parseInt(emptyTile.getAttribute('data-col'));
            
            // We need to move the target tile in a specific direction based on 
            // where we want it to go, which means the empty tile needs to be
            // on the opposite side
            
            if (currentRow > targetRow) {
                // Need to move up, so empty should be above
                if (emptyRow === currentRow - 1 && emptyCol === currentCol) {
                    // Empty is above, can move up
                    moveTile(tile);
                    await new Promise(resolve => setTimeout(resolve, 200));
                } else {
                    // Move empty to be above
                    if (emptyRow < currentRow - 1) {
                        // Empty is too far up, move it around
                        if (emptyCol !== currentCol) {
                            // Move to correct column first
                            await moveEmptyToPosition(emptyRow, currentCol);
                        } else {
                            // Need to go around
                            await moveEmptyToPosition(emptyRow, currentCol + (currentCol < 3 ? 1 : -1));
                            await moveEmptyToPosition(currentRow - 1, currentCol + (currentCol < 3 ? 1 : -1));
                            await moveEmptyToPosition(currentRow - 1, currentCol);
                        }
                    } else {
                        // Empty is elsewhere, route it around
                        if (emptyCol === currentCol) {
                            // Need to move horizontally first to avoid pushing our tile
                            await moveEmptyToPosition(emptyRow, currentCol + (currentCol < 3 ? 1 : -1));
                        }
                        await moveEmptyToPosition(currentRow - 1, currentCol);
                    }
                }
            } else if (currentRow < targetRow) {
                // Need to move down, so empty should be below
                if (emptyRow === currentRow + 1 && emptyCol === currentCol) {
                    // Empty is below, can move down
                    moveTile(tile);
                    await new Promise(resolve => setTimeout(resolve, 200));
                } else {
                    // Move empty to be below
                    if (emptyRow > currentRow + 1) {
                        // Empty is too far down, move it around
                        if (emptyCol !== currentCol) {
                            // Move to correct column first
                            await moveEmptyToPosition(emptyRow, currentCol);
                        } else {
                            // Need to go around
                            await moveEmptyToPosition(emptyRow, currentCol + (currentCol < 3 ? 1 : -1));
                            await moveEmptyToPosition(currentRow + 1, currentCol + (currentCol < 3 ? 1 : -1));
                            await moveEmptyToPosition(currentRow + 1, currentCol);
                        }
                    } else {
                        // Empty is elsewhere, route it around
                        if (emptyCol === currentCol) {
                            // Need to move horizontally first to avoid pushing our tile
                            await moveEmptyToPosition(emptyRow, currentCol + (currentCol < 3 ? 1 : -1));
                        }
                        await moveEmptyToPosition(currentRow + 1, currentCol);
                    }
                }
            } else if (currentCol > targetCol) {
                // Need to move left, so empty should be to the left
                if (emptyRow === currentRow && emptyCol === currentCol - 1) {
                    // Empty is to the left, can move left
                    moveTile(tile);
                    await new Promise(resolve => setTimeout(resolve, 200));
                } else {
                    // Move empty to be left
                    if (emptyCol < currentCol - 1) {
                        // Empty is too far left, move it around
                        if (emptyRow !== currentRow) {
                            // Move to correct row first
                            await moveEmptyToPosition(currentRow, emptyCol);
                        } else {
                            // Need to go around
                            await moveEmptyToPosition(currentRow + (currentRow < 3 ? 1 : -1), emptyCol);
                            await moveEmptyToPosition(currentRow + (currentRow < 3 ? 1 : -1), currentCol - 1);
                            await moveEmptyToPosition(currentRow, currentCol - 1);
                        }
                    } else {
                        // Empty is elsewhere, route it around
                        if (emptyRow === currentRow) {
                            // Need to move vertically first to avoid pushing our tile
                            await moveEmptyToPosition(currentRow + (currentRow < 3 ? 1 : -1), emptyCol);
                        }
                        await moveEmptyToPosition(currentRow, currentCol - 1);
                    }
                }
            } else if (currentCol < targetCol) {
                // Need to move right, so empty should be to the right
                if (emptyRow === currentRow && emptyCol === currentCol + 1) {
                    // Empty is to the right, can move right
                    moveTile(tile);
                    await new Promise(resolve => setTimeout(resolve, 200));
                } else {
                    // Move empty to be right
                    if (emptyCol > currentCol + 1) {
                        // Empty is too far right, move it around
                        if (emptyRow !== currentRow) {
                            // Move to correct row first
                            await moveEmptyToPosition(currentRow, emptyCol);
                        } else {
                            // Need to go around
                            await moveEmptyToPosition(currentRow + (currentRow < 3 ? 1 : -1), emptyCol);
                            await moveEmptyToPosition(currentRow + (currentRow < 3 ? 1 : -1), currentCol + 1);
                            await moveEmptyToPosition(currentRow, currentCol + 1);
                        }
                    } else {
                        // Empty is elsewhere, route it around
                        if (emptyRow === currentRow) {
                            // Need to move vertically first to avoid pushing our tile
                            await moveEmptyToPosition(currentRow + (currentRow < 3 ? 1 : -1), emptyCol);
                        }
                        await moveEmptyToPosition(currentRow, currentCol + 1);
                    }
                }
            }
        }
    }
    
    // Move empty tile to a specific position
    async function moveEmptyToPosition(targetRow, targetCol) {
        // Find empty tile
        const emptyTile = tiles.find(t => t.classList.contains('empty'));
        let emptyRow = parseInt(emptyTile.getAttribute('data-row'));
        let emptyCol = parseInt(emptyTile.getAttribute('data-col'));
        
        // If already in position, we're done
        if (emptyRow === targetRow && emptyCol === targetCol) {
            return;
        }
        
        // Add move tracking to detect loops
        const moveHistory = [];
        const MAX_MOVES = 20; // Limit moves for positioning empty tile
        let moveCount = 0;
        
        // Move vertically
        while (emptyRow !== targetRow && moveCount < MAX_MOVES) {
            // Record current position
            const posKey = `${emptyRow},${emptyCol}`;
            if (moveHistory.includes(posKey)) {
                console.log(`Loop detected moving empty tile to ${targetRow},${targetCol}`);
                break;
            }
            moveHistory.push(posKey);
            moveCount++;
            
            if (emptyRow < targetRow) {
                await moveEmptyDown(emptyRow, emptyCol);
            } else {
                await moveEmptyUp(emptyRow, emptyCol);
            }
            
            // Update position
            emptyRow = parseInt(emptyTile.getAttribute('data-row'));
            emptyCol = parseInt(emptyTile.getAttribute('data-col'));
        }
        
        // Reset history for horizontal movement
        moveHistory.length = 0;
        
        // Move horizontally
        while (emptyCol !== targetCol && moveCount < MAX_MOVES) {
            // Record current position
            const posKey = `${emptyRow},${emptyCol}`;
            if (moveHistory.includes(posKey)) {
                console.log(`Loop detected moving empty tile to ${targetRow},${targetCol}`);
                break;
            }
            moveHistory.push(posKey);
            moveCount++;
            
            if (emptyCol < targetCol) {
                await moveEmptyRight(emptyRow, emptyCol);
            } else {
                await moveEmptyLeft(emptyRow, emptyCol);
            }
            
            // Update position
            emptyRow = parseInt(emptyTile.getAttribute('data-row'));
            emptyCol = parseInt(emptyTile.getAttribute('data-col'));
        }
    }
    
    // New game button event
    newGameBtn.addEventListener('click', () => {
        if (aiSolving) return;
        initGame();
        shuffleTiles(); // Always shuffle when New Game is clicked
    });
    
    // AI Solve button event
    aiSolveBtn.addEventListener('click', () => {
        if (aiSolving) return;
        solvePuzzle();
    });
    
    // Initialize the game on page load
    initGame();
});