
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('playerCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 10;
    const cellSize = canvas.width / gridSize;

    let ships = [[0, 0], [0, 1]]; // Ship placement
    let hits = [];
    let hitCount = 0;
    let missCount = 0;
    
    var newGameButton = document.getElementById('newGame'); 
    newGameButton.addEventListener('click', function() {
        location.reload(); 
    });

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
 
    
    function handleCanvasClick(event) { //function to handle hits and misses 
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const gridX = Math.floor(x / cellSize);
        const gridY = Math.floor(y / cellSize);

        if (!hits.some(hit => hit[0] === gridX && hit[1] === gridY)) {
            if (ships.some(ship => ship[0] === gridX && ship[1] === gridY)) {
                ctx.fillStyle = 'red';
                ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
                hits.push([gridX, gridY]);
                hitCount ++;
                document.getElementById('hitCount').textContent = hitCount;
                
            } else {
                ctx.fillStyle = 'grey';
                ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
                hits.push([gridX, gridY]);
                missCount ++;
                document.getElementById('missCount').textContent = missCount;
            }
        }
        if (hitCount == ships.length ){ // squares to hit, if hitcount = num of ships -> game is over
            alert('Game Over, You Win!');
            location.reload();
        }
    }

    function initGame() {
        drawBoard();
        canvas.addEventListener('click', handleCanvasClick);
    }
    
    initGame();
});
