
        const gameBoard = document.getElementById('gameBoard');
        const scoreElement = document.getElementById('score');
        const highScoreElement = document.getElementById('highScore');
        const gameOverScreen = document.getElementById('gameOver');
        const startScreen = document.getElementById('startScreen');
        const finalScoreElement = document.getElementById('finalScore');
        const newHighScoreElement = document.getElementById('newHighScore');

        const BOARD_SIZE = 20; // 20x20 grid
        const CELL_SIZE = 24;

        let snake = [{x: 10, y: 10}];
        let direction = {x: 0, y: 0};
        let food = {x: 15, y: 15};
        let score = 0;
        let highScore = localStorage.getItem('snakeHighScore') || 0;
        let gameRunning = false;
        let gameSpeed = 150;

        // Initialize high score display
        highScoreElement.textContent = `High Score: ${highScore}`;

        function createSnakeElement(segment, isHead = false) {
            const element = document.createElement('div');
            element.className = isHead ? 'snake-segment snake-head' : 'snake-segment';
            element.style.left = segment.x * CELL_SIZE + 'px';
            element.style.top = segment.y * CELL_SIZE + 'px';
            return element;
        }

        function createFoodElement() {
            const element = document.createElement('div');
            element.className = 'food';
            element.style.left = food.x * CELL_SIZE + 'px';
            element.style.top = food.y * CELL_SIZE + 'px';
            return element;
        }

        function generateFood() {
            do {
                food = {
                    x: Math.floor(Math.random() * BOARD_SIZE),
                    y: Math.floor(Math.random() * BOARD_SIZE)
                };
            } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
        }

        function updateDisplay() {
            // Clear board
            const elements = gameBoard.querySelectorAll('.snake-segment, .food');
            elements.forEach(el => el.remove());

            // Draw snake
            snake.forEach((segment, index) => {
                const element = createSnakeElement(segment, index === 0);
                gameBoard.appendChild(element);
            });

            // Draw food
            const foodElement = createFoodElement();
            gameBoard.appendChild(foodElement);

            // Update score
            scoreElement.textContent = `Score: ${score}`;
        }

        function moveSnake() {
            if (!gameRunning) return;

            const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

            // Check wall collision
            if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
                endGame();
                return;
            }

            // Check self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                endGame();
                return;
            }

            snake.unshift(head);

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                generateFood();
                
                // Increase speed slightly
                if (gameSpeed > 80) {
                    gameSpeed -= 2;
                }
            } else {
                snake.pop();
            }

            updateDisplay();
        }

        function changeDirection(newDirection) {
            // Prevent reversing into itself
            if (direction.x === -newDirection.x && direction.y === -newDirection.y) {
                return;
            }
            
            // Only change direction if snake is moving
            if (direction.x !== 0 || direction.y !== 0) {
                direction = newDirection;
            }
        }

        function startGame() {
            gameRunning = true;
            startScreen.style.display = 'none';
            gameOverScreen.style.display = 'none';
            
            // Reset game state
            snake = [{x: 10, y: 10}];
            direction = {x: 1, y: 0}; // Start moving right
            score = 0;
            gameSpeed = 150;
            
            generateFood();
            updateDisplay();
            gameLoop();
        }

        function endGame() {
            gameRunning = false;
            
            // Check for new high score
            let isNewHighScore = false;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                highScoreElement.textContent = `High Score: ${highScore}`;
                isNewHighScore = true;
            }
            
            finalScoreElement.textContent = score;
            newHighScoreElement.style.display = isNewHighScore ? 'block' : 'none';
            gameOverScreen.style.display = 'block';
        }

        function restartGame() {
            startGame();
        }

        function gameLoop() {
            if (!gameRunning) return;
            
            moveSnake();
            setTimeout(gameLoop, gameSpeed);
        }

        // Event listeners
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    changeDirection({x: 0, y: -1});
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    changeDirection({x: 0, y: 1});
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    changeDirection({x: -1, y: 0});
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    changeDirection({x: 1, y: 0});
                    break;
            }
        });

        // Initialize display
        updateDisplay();
 

