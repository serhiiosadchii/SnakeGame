let snakeStartXY = {x: 15, y: 15};
let snakeCells = [];
let snakeLenght = 3;
let mealsXY = [];
let boardCoordinates = [];
let mealCoordinates = [];
let side = 'ArrowLeft';
let moveId;
let mealId;
let isIncreasing = false;
let snakeSpeed = 0;
let mealCreationSpeed = 0;

function loadGame(){
    createBoard();
    createSnake();
    moveId = setInterval(increaseMoveSpeed, snakeSpeed);
    mealId = setInterval(addMeal, mealCreationSpeed);
}

function addMeal(){
    let xMeal = (Math.random() * 30) | 0;
    let yMeal = (Math.random() * 30) | 0;
    if(!checkCoordinateIsValid(xMeal, yMeal)){
        addMeal();
    }
    let cell = document.getElementById(`${xMeal}-${yMeal}`);
    cell.classList.remove('empty');
    cell.classList.add('meal');
    clearInterval(mealId);
    mealCreationSpeed = 5000;
    mealId = setInterval(addMeal, mealCreationSpeed);
}

function checkCoordinateIsValid(xMeal, yMeal){
    let isValid = true;
    snakeCells.forEach(sc => {
        let position = sc.id.split('-');
        if(position[0] == xMeal && position[1] == yMeal){
            isValid = false;
        }
    });
    document.getElementById(`${xMeal}-${yMeal}`)
    return isValid;
}

function increaseMoveSpeed() {
    move();
    clearInterval(moveId);
    snakeSpeed = 250;
    moveId = setInterval(increaseMoveSpeed, snakeSpeed);
}

function createBoard() {
    for (let x = 0; x < 30; x++) {
        let row = document.createElement('div');
        row.classList.add('row');
        let field = document.getElementById('board');
        boardCoordinates.push(new Array())
        field.appendChild(row);
        for (let y = 0; y < 30; y++) {
            let cell = document.createElement('div');
            cell.classList.add('cell', 'empty');
            cell.setAttribute('id', `${x}-${y}`)
            row.appendChild(cell);
            boardCoordinates[x].push(y)
        }
    }
    bindKeys();
}

function bindKeys(){
    document.addEventListener('keydown', event => {
        if(event == undefined) return;
        side = event.key;
    });
}

function createSnake(){
    let snake = 0;
    boardCoordinates.forEach(x => {
        let xCoordinate = boardCoordinates.indexOf(x);
        x.forEach(y => {
            if((snake != 0 && snake < snakeLenght) || (snakeStartXY.x == xCoordinate && y == snakeStartXY.y)){
                snake++;
                let cell = document.getElementById(`${xCoordinate}-${y}`);
                cell.classList.remove('empty');
                cell.classList.add('snake');
                snakeCells.push(cell);
            }
        });
    })
}

function move(){
    let headCoordinates = snakeCells[0].id.split('-');
    if(headCoordinates[0] == 0 || headCoordinates[1] == 0){
        clearInterval(moveId);
        clearInterval(mealId);
        return;
    }
    moveHead(headCoordinates);
    
}



function moveHead(headCoordinates){
    let nextCoordinates = [0, 0];
    if(side == 'ArrowUp'){
        nextCoordinates[0] = headCoordinates[0] - 1;
        nextCoordinates[1] = headCoordinates[1];
    }
    else if(side == 'ArrowDown'){
        nextCoordinates[0] = +headCoordinates[0] + 1;
        nextCoordinates[1] = headCoordinates[1];
    }
    else if(side == 'ArrowLeft'){
        nextCoordinates[0] = headCoordinates[0];
        nextCoordinates[1] = headCoordinates[1] - 1;
    }
    else if(side == 'ArrowRight'){
        nextCoordinates[0] = headCoordinates[0];
        nextCoordinates[1] = +headCoordinates[1] + 1;
    }
    let cell = document.getElementById(`${nextCoordinates[0]}-${nextCoordinates[1]}`);

    cell.classList.remove('empty');
    cell.classList.add('snake');
    snakeCells.unshift(cell);

    if(!checkMeal(cell)){
        removeLast();
    }
}

function checkMeal(cell){
    if(!cell.classList.contains('meal')){
        return false;
    }
    cell.classList.remove('meal');
    return true;
}

function removeLast(){
    let currentPosition = snakeCells[snakeCells.length - 1].id.split('-');
    let cell = document.getElementById(`${currentPosition[0]}-${currentPosition[1]}`);
    cell.classList.remove('snake');
    cell.classList.add('empty');
    snakeCells.pop();
}

