// Game constants & variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music_food.mp3');
const gameOverSound = new Audio('music_gameover.mp3');
const moveSound = new Audio('music_move.mp3');
const musicSound = new Audio('music_music.mp3');
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    //if you bumb into yourself
    for(let i=1;i<snakeArr.length;i++){
        if(snake[i].x==snake[0].x && snake[i].y==snake[0].y){
            return true;
        }
        //if you bump into the wall
        if(snake[0].x>=18 || snake[0].x<=0 || snake[0].y>=18 || snake[0].y<=0){
            return true;
        }
    }
}

function gameEngine() {
    // Part 1: Updating the snake array & food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game over. Press any key to play again!");
        if(score>highscoreval){
            highscoreval=score;
            localStorage.setItem("hiscore",JSON.stringify(highscoreval));
            highscoreBox.innerHTML="HiScore: "+highscoreval;
        }
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score+=1;
        scoreBox.innerHTML="Score:"+score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };//desturcturing into a new object
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and food
    const board = document.getElementById('board');
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}
let hiscore=localStorage.getItem("hiscore");
var highscoreval=0;
if(hiscore===null){
    highscoreval=0;
    localStorage.setItem("hiscore",JSON.stringify(highscoreval));
    highscoreBox.innerHTML="HiScore: "+highscoreval;
}else{
    highscoreval=JSON.parse(hiscore);
    highscoreBox.innerHTML="HighScore: "+highscoreval;
}

// Initial call to start the game
window.requestAnimationFrame(main);

// Event listener to capture direction input
window.addEventListener('keydown', e => {
    musicSound.play();
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) { // Prevent reversing direction
                inputDir = { x: 0, y: -1 };
            }
            break;
        case "ArrowDown":
            if (inputDir.y === 0) { // Prevent reversing direction
                inputDir = { x: 0, y: 1 };
            }
            break;
        case "ArrowLeft":
            if (inputDir.x === 0) { // Prevent reversing direction
                inputDir = { x: -1, y: 0 };
            }
            break;
        case "ArrowRight":
            if (inputDir.x === 0) { // Prevent reversing direction
                inputDir = { x: 1, y: 0 };
            }
            break;
    }
});
