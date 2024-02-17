document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('playerCanvas');
    const canvasEnemy = document.getElementById('enemyCanvas');
    const ctx = canvas.getContext('2d');
    const ctxEnemy = canvasEnemy.getContext('2d');
    const gridSize = 10;
    const cellSize = canvas.width / gridSize;

    let ships = []; // Ship placement on player's board
    let enemyShips = [[2, 2], [3, 3]]; // Example enemy ships placement
    let hits = []; // Tracks hits for simplification, adjust as needed for your game logic
    let hitCount = 0;
    let missCount = 0;
    
    let shipToPlace = false; // flag for ship placement

    // logic to change colors whenever place ship button is used
    var pickUpShipButton = document.getElementById('shipToPlace');
    pickUpShipButton.addEventListener('click', function() {
        shipToPlace = true;
        pickUpShipButton.textContent = 'Place Ship';
        pickUpShipButton.classList.add('btn-warning');
        pickUpShipButton.classList.remove('btn-secondary');
    });

    // new Game button starts new game 
    var newGameButton = document.getElementById('newGame'); 
    newGameButton.addEventListener('click', function() {
        location.reload(); 
    });

    // draw player board
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
        // draw ships to show placement 
        ships.forEach(function(ship) {
            ctx.fillStyle = 'navy';
            ctx.fillRect(ship[0] * cellSize, ship[1] * cellSize, cellSize, cellSize);
        });
    }

    //draw enemy board
    function drawEnemyBoard(){
        ctxEnemy.clearRect(0, 0, canvasEnemy.width, canvasEnemy.height);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                ctxEnemy.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }

    // function to place ships
    function placeShip(event) {
        if (!shipToPlace) return; //if shipToPlace flag is false, user is unable to place ships
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const gridX = Math.floor(x / cellSize);
        const gridY = Math.floor(y / cellSize);

        if (!ships.some(ship => ship[0] === gridX && ship[1] === gridY)) {
            ships.push([gridX, gridY]);
            drawBoard();
            shipToPlace = false;

            pickUpShipButton.textContent = 'Pick Up Ship';
            pickUpShipButton.classList.remove('btn-warning');
            pickUpShipButton.classList.add('btn-secondary');
        } else {
            alert("You already placed a ship here!");
        }
    }

    // logic function to make sure ships are placed before attacking 
    function handleAttack(event) {
        if (shipToPlace || ships.length === 0) {
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

        hits.push([gridX, gridY]); // For simplicity, we're not distinguishing between player and enemy hits here

        // Assume enemyShips are defined elsewhere or adjust accordingly
        if (enemyShips.some(ship => ship[0] === gridX && ship[1] === gridY)) {
            ctxEnemy.fillStyle = 'red';
            hitCount++;
            if (hitCount === enemyShips.length) {
                alert('Game Over, You Win!');
                location.reload();
            }
        } else {
            ctxEnemy.fillStyle = 'grey';
            missCount++;
        }
        ctxEnemy.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
        document.getElementById('hitCount').textContent = hitCount;
        document.getElementById('missCount').textContent = missCount;
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
