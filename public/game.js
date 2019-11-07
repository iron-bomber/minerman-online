class Game {

    constructor(){
        this.playerArr = [];
        this.spriteArr = [];
        this.bombMap = [];
    }
    // Creates bomber and places him in bomber array
    createPlayer(x, y, iGrid, jGrid, num) {
        this.playerArr.push(new Bomber(x, y, iGrid, jGrid, num)); 
    }

    // Creates a sprite for each bomber
    createSprite(left, right, up, down, death, lastPressed, bomberID, height) {
        this.spriteArr.push(new Sprite(left, right, up, down, death, lastPressed, bomberID, height));
    }

    //Draws the map based on the 2d Array m.bombMap
    createMap() {
        var leftWall = new Image();
        leftWall.src="./Images/leftWall.png";
        var rock = new Image();
        rock.src="./Images/rock.png";
        let xCoord = 0;
        let yCoord = 0;
        for(let i = 0; i < m.bombMap.length; i++) {
            for (let j = 0; j < m.bombMap.length; j++) {
                if (m.bombMap[i][j] === 'wall') {
                    ctx.drawImage(rock, 256, 128, 64, 64, xCoord, yCoord, 50, 50);
                    xCoord += 50;
                } else if (m.bombMap[i][j] === 'rock') {
                    ctx.drawImage(rock, 0, 128, 64, 64, xCoord, yCoord, 50, 50);
                    xCoord += 50;
                }else if (typeof m.bombMap[i][j] === 'object') {
                    ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                    //bomb Gray
                    ctx.fillStyle = '#C0C0C0';
                    ctx.beginPath();
                    ctx.arc(xCoord + 25, yCoord + 25, 12, 0, 2 * Math.PI);
                    ctx.fill();
                    xCoord += 50;
                } else if (typeof m.bombMap[i][j] === 'number') {
                    // ctx.fillStyle = 'green';
                    // ctx.fillRect(xCoord, yCoord, 50, 50);
                    //explosion orange
                    ctx.fillStyle = '#FF9900';
                    ctx.fillRect(xCoord, yCoord, 50, 50);
                    xCoord += 50;
                } else if(m.bombMap[i][j] === 'bombpower'){
                    ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                    ctx.fillStyle = 'red';
                    ctx.fillRect(xCoord+15, yCoord+15, 20, 20);
                    xCoord += 50;
                }
                else if(m.bombMap[i][j] === 'extrabomb'){
                    ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                    ctx.fillStyle = 'cyan';
                    ctx.fillRect(xCoord+15, yCoord+15, 20, 20);
                    xCoord += 50;
                }
                else if(m.bombMap[i][j] === 'speed'){
                    ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect(xCoord+15, yCoord+15, 20, 20);
                    xCoord += 50;    
                }
                else {
                    ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                    xCoord += 50;
                }
            }
            yCoord += 50;
            xCoord = 0;
        }

    }

    drawPlayer(u) {
        ctx.fillStyle = u.color;
        ctx.fillRect(u.x, u.y, u.width, u.height)
    }
}

function mainLoop(){
    if (playersLeft === 1) {
        for(let i = 0; i < g.playerArr.length; i++) {
            if (typeof g.playerArr[i] === 'object') {
                playerScores[`p${i+1}`] += 1;
                for (let j = 0; j < numOfPlayers; j++) {
                    console.log(`Player ${j+1} score: ${playerScores[`p${j+1}`]}`);
                }
            }
        }

        playersLeft = 0;
        gameReset = true;
        setTimeout(()=>{
            initializeGame();
        }, 5000)
    }
    //GRID PLACER & MoveCheck
    for (let i = 0; i < g.playerArr.length; i++) {
        if(g.playerArr[i] !== ''){
            g.playerArr[i].gridPlacer();
            if(g.playerArr[i].moveUp || g.playerArr[i].moveDown || g.playerArr[i].moveLeft || g.playerArr[i].moveRight){
                g.playerArr[i].move();
            }
        }
    }
    //Clear canvas
    ctx.clearRect(0, 0, 750, 750);
    g.createMap();
    // Updates player attributes
    // for (let i = 0; i < g.playerArr.length; i++) {
    //     document.getElementById(`p${i+1}-pwr`).innerText = `Bomb Power: ${g.playerArr[i].bombPower}`;
    //     document.getElementById(`p${i+1}-bmb`).innerText = `Total Bombs: ${g.playerArr[i].bombAmmo}`;
    //     document.getElementById(`p${i+1}-spd`).innerText = `Speed: ${g.playerArr[i].speed}`;
    // }

    //Drawing Player
    // for (let i = 0; i < g.playerArr.length; i++) {
    //     g.drawPlayer(g.playerArr[i]);
    // }
    if (playerOneDead) {
        g.spriteArr[0].drawDeath(playerOneX, playerOneY);
    }
    if (playerTwoDead) {
        g.spriteArr[1].drawDeath(playerTwoX, playerTwoY);
    }

    
    //PLAYER SPRITES
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < g.playerArr.length; i++) {
        if (g.playerArr[i].moveLeft == true && g.playerArr[i].moveRight == true && g.playerArr[i].moveUp == true){
            g.spriteArr[i].drawImgUp();
        }
        else if (g.playerArr[i].moveLeft == true && g.playerArr[i].moveRight == true && g.playerArr[i].moveDown == true){
            g.spriteArr[i].drawImgDown()
        }else if  
            (  g.playerArr[i].moveLeft == true && g.playerArr[i].moveRight == true
            || g.playerArr[i].moveUp == true && g.playerArr[i].moveDown == true
            || g.playerArr[i].moveLeft == true && g.playerArr[i].moveRight == true && g.playerArr[i].moveUp == true && g.playerArr[i].moveDown == true
            || g.playerArr[i].moveLeft == true && g.playerArr[i].moveRight == true && g.playerArr[i].moveUp == true && g.playerArr[i].moveDown == true
            || g.playerArr[i].moveLeft == false && g.playerArr[i].moveRight == false && g.playerArr[i].moveUp == false && g.playerArr[i].moveDown == false
        ){
            g.spriteArr[i].drawImgIdle()
        }
        else if(g.playerArr[i].moveLeft == true){
            g.spriteArr[i].drawImgLeft()
        }else if(g.playerArr[i].moveRight == true){
            g.spriteArr[i].drawImgRight()
        }else if(g.playerArr[i].moveUp == true){
            g.spriteArr[i].drawImgUp()
        }else if(g.playerArr[i].moveDown == true){
            g.spriteArr[i].drawImgDown()
        }
    }

    //Loop this function 60fps
    requestAnimationFrame(mainLoop);

}// END OF MAIN LOOP


let players;

socket.on('newPlayer', (data) => {
    players = data[1];
    console.log(players);
    console.log(`New player, ${data[0]}, number of players: ${players.length}`);
});

socket.on('moveDown', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveDown = true;
});
socket.on('moveUp', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveUp = true;
});
socket.on('moveLeft', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveLeft = true;
});
socket.on('moveRight', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveRight = true;
});
socket.on('dropBomb', (data) => {
    if(g.playerArr[players.indexOf(data.playerID)].bombAmmo > 0){
        if (m.bombMap[g.playerArr[players.indexOf(data.playerID)].iGrid][g.playerArr[players.indexOf(data.playerID)].jGrid] === 'free') {
            // Create new bomb (player, player Y, player X, player bomb power, bomb ID)
            let newBomb = (new Bomb(g.playerArr[players.indexOf(data.playerID)], g.playerArr[players.indexOf(data.playerID)].iGrid, g.playerArr[players.indexOf(data.playerID)].jGrid, g.playerArr[players.indexOf(data.playerID)].bombPower, bombIDs));
            bombIDs++;
            newBomb.gridPlacer();
            newBomb.timerExplode();
            g.playerArr[players.indexOf(data.playerID)].bombAmmo -= 1;
        }
    }       
});

socket.on('moveDownFalse', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveDown = false;
    g.spriteArr[players.indexOf(data.playerID)].lastPressed = "down";
});
socket.on('moveUpFalse', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveUp = false;
    g.spriteArr[players.indexOf(data.playerID)].lastPressed = "up";
});
socket.on('moveLeftFalse', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveLeft = false;
    g.spriteArr[players.indexOf(data.playerID)].lastPressed = "left"
});
socket.on('moveRightFalse', (data) => {
    g.playerArr[players.indexOf(data.playerID)].moveRight = false;
    g.spriteArr[players.indexOf(data.playerID)].lastPressed = "right"
});

let g;
let m;
function initializeGame(data) {
    g = new Game();
    m = data;
    playerOneDead = false;
    playerTwoDead = false;
    g.createPlayer(60, 75, 1, 1, 1);
    g.createSprite(p1Left, p1Right, p1Up, p1Down, p1Death, 'down', 0, spriteHeight1);
    g.createPlayer(760, 760, 15, 15, 2);
    g.createSprite(p2Left, p2Right, p2Up, p2Down, p2Death, 'down', 1, spriteHeight2);
    g.createPlayer(760, 60, 1, 1, 3);
    g.createSprite(p1Left, p1Right, p1Up, p1Down, p1Death, 'down', 0, spriteHeight1);
    g.createPlayer(60, 760, 15, 15, 4);
    g.createSprite(p2Left, p2Right, p2Up, p2Down, p2Death, 'down', 1, spriteHeight2);
    numOfPlayers = g.playerArr.length;
    playersLeft = g.playerArr.length;
    setTimeout(() => {
        gameReset = false;
    }, 2999);
}

socket.on('start-game', (data) => {
    initializeGame(data);
    mainLoop();
}) 






