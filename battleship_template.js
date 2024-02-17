document.addEventListener('DOMContentLoaded', function() { // Const variables to set up canvas and load them
    const canvas = document.getElementById('playerCanvas');
    const canvasEnemy = document.getElementById('enemyCanvas');
    const ctx = canvas.getContext('2d');
    const ctxEnemy = canvasEnemy.getContext('2d');
    const gridSize = 10;
    const cellSize = canvas.width / gridSize; // Caclulate cell size

    let ships = []; // Ship placement on player's board
    let enemyShips = [[2, 2], [3, 3]]; // Enemy ships placement
    let hits = []; // Array totrack ship hits
    let hitCount = 0; // Track hit count
    let missCount = 0; //Track miss count
    
    let shipToPlace = false; // Flag for ship placement
    let gameOver = false; // Flag to prevent bombing once game is over

    // Logic to change colors whenever place ship button is used
    var pickUpShipButton = document.getElementById('shipToPlace');
    pickUpShipButton.addEventListener('click', function() {
        shipToPlace = true;
        pickUpShipButton.textContent = 'Place Ship';
        pickUpShipButton.classList.add('btn-warning');
        pickUpShipButton.classList.remove('btn-secondary');
    });

    // New Game button starts new game 
    var newGameButton = document.getElementById('newGame'); 
    newGameButton.addEventListener('click', function() {
        location.reload(); 
    });

    // Draw player board
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
        // Draw ships to show placement 
        ships.forEach(function(ship) {
            ctx.fillStyle = 'navy';
            ctx.fillRect(ship[0] * cellSize, ship[1] * cellSize, cellSize, cellSize);
        });
    }

    // Draw enemy board
    function drawEnemyBoard(){
        ctxEnemy.clearRect(0, 0, canvasEnemy.width, canvasEnemy.height);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                ctxEnemy.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }

    // Function to place ships
    function placeShip(event) {
        if (!shipToPlace) return; // If shipToPlace flag is false, user is unable to place ships
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const gridX = Math.floor(x / cellSize);
        const gridY = Math.floor(y / cellSize);

        if (!ships.some(ship => ship[0] === gridX && ship[1] === gridY)) { // Check if cell is occupied by ship
            ships.push([gridX, gridY]); // Add ship position to ships array
            drawBoard(); // Redraw board to include added ships
            shipToPlace = false; // set flag to show user has stopped placing ships

            // Change color of buttons to show state of Pick Up Ship button
            pickUpShipButton.textContent = 'Pick Up Ship';
            pickUpShipButton.classList.remove('btn-warning');
            pickUpShipButton.classList.add('btn-secondary');
        } else {
            alert("You already placed a ship here!"); // If cell is occupied, alert the user a ship has already been placed there
        }
    }

    // logic function to make sure ships are placed before attacking 
    function handleAttack(event) {
        if (gameOver) { // If gameOver flag is true, alert the user to start a new game
            alert("Game is over. Please start a new game."); 
            return; 
        }

        if (shipToPlace || ships.length === 0) { // If ShipToPlace is true and ship length is zero, the user is alerted to place ships before attacking
            alert("Place your ships before attacking the enemy!");
            return;
        }

        const rect = canvasEnemy.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const gridX = Math.floor(x / cellSize);
        const gridY = Math.floor(y / cellSize);

        // logic to check if square has already been attacked
        if (hits.some(hit => hit[0] === gridX && hit[1] === gridY)) {
            alert("You already attacked this square, pick a different one!");
            return;
        }

        hits.push([gridX, gridY]); // add coordinates of attack to hits array

        if (enemyShips.some(ship => ship[0] === gridX && ship[1] === gridY)) {
            ctxEnemy.fillStyle = 'red';
            hitCount++; // Increment hit count, make cell red if a ship is hit
            if (hitCount === enemyShips.length) {
                alert('Game Over, You Win!');
                gameOver = true; // Update the game state to indicate the game has ended
                pickUpShipButton.classList.add('disabled'); // Disable button to place ships once game is ended
            }
        } else {
            ctxEnemy.fillStyle = 'grey'; // If coordinates of attack do not represent a ship, make the square grey and increment missCount by 1
            missCount++;
        }
        ctxEnemy.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
        document.getElementById('hitCount').textContent = hitCount; // Update hit count
        document.getElementById('missCount').textContent = missCount; // Update miss count
    }

    // function to initialize start of game
    function initGame() {
        drawBoard();
        drawEnemyBoard();
        canvas.addEventListener('click', placeShip);
        canvasEnemy.addEventListener('click', handleAttack);
    }
    
    initGame(); //call the function to start the game
});
