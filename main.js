let snakeStartXY = {x: 15, y: 15};
let snakeCells = [];
let snakeLenght = 3;
let mealsXY = [];
let boardCoordinates = [];
let meal = [];
let direction = 2;
let moveId;
let mealId;
let isIncreasing = false;
let changeSpeedInterval = 250;
let snakeSpeed = 250;
let mealCreationSpeed = 0;
let score = 0;

function loadGame(){
    createBoard();
    createSnake();
    moveId = setInterval(increaseMoveSpeed, changeSpeedInterval);
    mealId = setInterval(addMeal, mealCreationSpeed);
}

function addMeal(){
    if(meal.length >=2){
        return;
    }
    let xMeal = (Math.random() * 30) | 0;
    let yMeal = (Math.random() * 30) | 0;
    if(!checkCoordinateIsValid(xMeal, yMeal)){
        addMeal();
    }
    else{
        let cell = document.getElementById(`${xMeal}-${yMeal}`);
        cell.classList.remove('empty');
        cell.classList.add('meal');
        meal.push(cell);
        clearInterval(mealId);
        mealCreationSpeed = 100;
        mealId = setInterval(addMeal, mealCreationSpeed);
    }
}

function checkCoordinateIsValid(xMeal, yMeal){
    let isValid = true;
    let isWall = xMeal == 0 || yMeal == 0 || xMeal == 29 || yMeal == 29;
    if(isWall) return;
    snakeCells.forEach(sc => {
        let position = sc.id.split('-');
        if(+position[0] == xMeal && +position[1] == yMeal){
            isValid = false;
        }
    });
    return isValid;
}

function increaseMoveSpeed() {
    move();
    clearInterval(moveId);
    snakeSpeed = snakeSpeed - 5;
    moveId = setInterval(increaseMoveSpeed, changeSpeedInterval);
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
            cell.setAttribute('id', `${x}-${y}`);
            row.appendChild(cell);
            if(!wallCheck(cell)){
                addBoardStyleClass(cell, 'empty');
            }
            else {
                addBoardStyleClass(cell, 'wall');
            }
            boardCoordinates[x].push(y);
        }
    }
    bindKeys();
}

function wallCheck(cell) {
    let cellCoordinates = cell.id.split('-');
    let isWall = cellCoordinates[0] == 0 || cellCoordinates[1] == 0 || cellCoordinates[0] == 29 || cellCoordinates[1] == 29;
    return isWall;
}

function addBoardStyleClass(cell, styleClass) {
    cell.classList.add('cell', styleClass);
}

function bindKeys(){
    document.addEventListener('keydown', event => {
        if(event == undefined) return;
        
        if(event.key == 'ArrowUp'){
            direction = 1;
        }
        else if(event.key == 'ArrowDown'){
            direction = -1;
        }
        else if(event.key == 'ArrowLeft'){
            direction = 2;
        }
        else if(event.key == 'ArrowRight'){
            direction = -2;
        }
    });
}

function createSnake() {
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
    if(headCoordinates[0] == 0 || headCoordinates[1] == 0 || headCoordinates[0] == 29 || headCoordinates[1] == 29){
        clearInterval(moveId);
        clearInterval(mealId);
        return;
    }
    moveHead(headCoordinates); 
}

function moveHead(headCoordinates){
    let nextCoordinates = [0, 0];
    if(direction == 1){
        nextCoordinates[0] = headCoordinates[0] - 1;
        nextCoordinates[1] = headCoordinates[1];
    }
    else if(direction == -1){
        nextCoordinates[0] = +headCoordinates[0] + 1;
        nextCoordinates[1] = headCoordinates[1];
    }
    else if(direction == 2){
        nextCoordinates[0] = headCoordinates[0];
        nextCoordinates[1] = headCoordinates[1] - 1;
    }
    else if(direction == -2){
        nextCoordinates[0] = headCoordinates[0];
        nextCoordinates[1] = +headCoordinates[1] + 1;
    }
    
    let cell = document.getElementById(`${nextCoordinates[0]}-${nextCoordinates[1]}`);
     
    if(!checkWrongTurn(cell)){
        direction = direction * -1;
        moveHead(headCoordinates);
    }
    else{
        if(gameOver(cell)) return;
        cell.classList.remove('empty');
        cell.classList.add('snake');
        snakeCells.unshift(cell);
    
        if(!checkMeal(cell)){
            removeLast();
        }
    }
}

function gameOver(cell){
    if(!checkValidMove(cell) || wallCheck(cell)){
        clearInterval(moveId);
        clearInterval(mealId);
        let item = document.getElementById("gameOver");
        item.classList='gameOver';
        return true;
    }
    return false;
}

function checkWrongTurn(cell){
    let nextCoordinates = cell.id.split('-');
    let isValid = true;
    let position = snakeCells[1].id.split('-');
        if(+position[0] == +nextCoordinates[0] && +position[1] == +nextCoordinates[1]){
            isValid =  false;
        }

    return isValid;
}

function checkValidMove(cell){
    let nextCoordinates = cell.id.split('-');
    let isValid = true;
    snakeCells.forEach(sc => {
        let position = sc.id.split('-');
        if(+position[0] == +nextCoordinates[0] && +position[1] == +nextCoordinates[1]){
            isValid =  false;
        }
    });
    return isValid;
}

function checkMeal(cell){
    if(!cell.classList.contains('meal')){
        return false;
    }
    cell.classList.remove('meal');
    score++;
    meal.pop();
    document.getElementById('score').innerHTML = score;
    return true;
}

function removeLast(){
    let currentPosition = snakeCells[snakeCells.length - 1].id.split('-');
    let cell = document.getElementById(`${currentPosition[0]}-${currentPosition[1]}`);
    cell.classList.remove('snake');
    cell.classList.add('empty');
    snakeCells.pop();
}
