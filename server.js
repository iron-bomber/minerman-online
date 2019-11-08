let gameReset = false;
let bombIDs = 0;
const players = [];
const express = require('express');
const socket = require('socket.io');

// App setup
const app = express();
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
    console.log('listening to requests, port 4000');
});

//Static files
app.use(express.static('public'));

// // Socket setup
let io = socket(server);
let playerOneDead = false;
let playerTwoDead = false;
let playerThreeDead = false;
let playerFourDead = false;
let playerOneX;
let playerOneY;
let playerTwoX;
let playerTwoY;
let playerThreeX;
let playerThreeY;
let playerFourX;
let playerFourY;
// // let numOfPlayers;
let playersLeft;
// // let playerScores = {p1: 0, p2: 0, p3: 0, p4: 0};


// // SPRITE VARS
// // let lastPressed = 'down';
// // let lastPressed2 = 'ArrowDown';
let startScreenOver = false;

io.on('connection', (socket) => {
    console.log('connection made', new Date());
    console.log(socket.id);
    players.push(socket.id);
    if (players.length <=4) {
        s[`p${players.length}`].exists = true;
    }  
    if (players.length === 1) {
        console.log('start screen');
        let startScreenInterval = setInterval(() => {
            io.sockets.emit('startScreen', s)
            if(startScreenOver) {
                console.log('start screen done');
                clearInterval(startScreenInterval);
            }
        }, 1000/60)
        io.to(`${players[0]}`).emit('youHost');
    }
    if (players.length <=4 && players.length > 0) {
        io.sockets.emit('startControls', true);
        io.sockets.emit('playerArray', (players));
    }

    // Select screen controls received from user
    socket.on('select', (select) => {
        s.movePosition(s[`p${players.indexOf(select.socketID)+1}`], select.key);
    })
    
    if (players.length === 3) {
        console.log('checking if game has started');
        let startTheGame = setInterval(() => {
            let pReady = {
                p1: false,
                p2: false,
                p3: false
            }
            for (let i = 1; i <= players.length; i++) {
                pReady[`p${i}`] = !s[`p${i}`].exists;
            }
            if (pReady.p1 && pReady.p2 && pReady.p3) {
                startScreenOver = true;
                setTimeout(() => {
                    console.log('in timeout ')
                    startNewRound()
                }, 500);
                clearInterval(startTheGame);
            }
        }, 400)
    }


    //In game controls received from user
    socket.on('bomberData', (bomberData) => {
        g.playerArr[bomberData.playerID].moveDown = bomberData.moveDown;
        g.playerArr[bomberData.playerID].moveLeft = bomberData.moveLeft;
        g.playerArr[bomberData.playerID].moveUp = bomberData.moveUp;
        g.playerArr[bomberData.playerID].moveRight = bomberData.moveRight;
        g.playerArr[bomberData.playerID].lastPressed = bomberData.lastPressed;
    });
    socket.on('dropABomb', (data) => {
        if(g.playerArr[data].bombAmmo > 0){
            if (m.bombMap[g.playerArr[data].iGrid][g.playerArr[data].jGrid] === 'free') {
                // Create new bomb (player, player Y, player X, player bomb power, bomb ID)
                let newBomb = (new Bomb(g.playerArr[data], g.playerArr[data].iGrid, g.playerArr[data].jGrid, g.playerArr[data].bombPower, bombIDs));
                bombIDs++;
                newBomb.gridPlacer();
                newBomb.timerExplode();
                g.playerArr[data].bombAmmo -= 1;
            }
        }   
    })


    // if (startGame) {
    //     let emitGame = setInterval(() => {
    //         if (!stopMainLoop) {
    //             mainLoop();
    //             io.sockets.emit('allData', allData);
    //         } else {
    //             clearInterval(emitGame);
    //         }
            
    //     }, 1000/60)
    // }
    
});

// //Player one

class Bomb {
    constructor(owner, iGrid, jGrid, power, bombID) {
        this.owner = owner;
        this.iGrid = iGrid;
        this.jGrid = jGrid;
        this.power = power;
        this.exploding = false;
        this.bombID = bombID;
        this.bombssNum = 0;
        this.bombframeCounter = 0;
        this.bombframeRate = 10;
        this.bombtotalFrames = this.bombframeRate*4;
    }

    explode() {
        // Kill bomber standing on bomb
        if (typeof m.bomberLocations[this.iGrid][this.jGrid] === 'object') {
            m.bomberLocations[this.iGrid][this.jGrid].die();
        }
        m.bombMap[this.iGrid][this.jGrid] = this.bombID;
        let rockCollide = {up: false, down: false, left: false, right: false};
        for (let i = 1; i < this.power+1; i++){
            // Explode above, checking for walls & bombs
            if (!rockCollide.up) {
                if (this.iGrid-i >= 0) {
                    // Kill bomber in blast radius above
                    if (typeof m.bomberLocations[this.iGrid-i][this.jGrid] === 'object') {
                        m.bomberLocations[this.iGrid-i][this.jGrid].die();
                    }
                    if (m.bombMap[this.iGrid-i][this.jGrid] === 'free') {
                        m.bombMap[this.iGrid-i][this.jGrid] = this.bombID;
                    } else if (m.bombMap[this.iGrid-i][this.jGrid] === 'rock') {
                        // Negative bombID to signal possible powerup spawn under rock
                        m.bombMap[this.iGrid-i][this.jGrid] = -this.bombID;
                        rockCollide.up = true;
                    } else if (typeof m.bombMap[this.iGrid-i][this.jGrid] === 'object') {
                        // Explode bombs in blast radius above
                        m.bombMap[this.iGrid-i][this.jGrid].exploding = true;
                        m.bombMap[this.iGrid-i][this.jGrid].explode();
                        rockCollide.up = true;
                    } else if (typeof m.bombMap[this.iGrid-i][this.jGrid] === 'number') {
                        // Overwrites previous bombs blast
                        m.bombMap[this.iGrid-i][this.jGrid] = this.bombID;
                    } else if (m.bombMap[this.iGrid-i][this.jGrid] === 'bombpower' || m.bombMap[this.iGrid-i][this.jGrid] === 'extrabomb' || m.bombMap[this.iGrid-i][this.jGrid] === 'speed' ){
                        // Destroys any powerups in space
                        m.bombMap[this.iGrid-i][this.jGrid] = this.bombID;
                    }else {
                        rockCollide.up = true;
                    }
                } else {
                    rockCollide.up = true
                }
            }
            // Explode below, checking for walls & bombs
            if (!rockCollide.down) {
                // Kill bomber in blast radius below
                if (typeof m.bomberLocations[this.iGrid+i][this.jGrid] === 'object') {
                    m.bomberLocations[this.iGrid+i][this.jGrid].die();
                }
                if (this.iGrid+i < 16) {
                    if (m.bombMap[this.iGrid+i][this.jGrid] === 'free') {
                        m.bombMap[this.iGrid+i][this.jGrid] = this.bombID;
                    } else if (m.bombMap[this.iGrid+i][this.jGrid] === 'rock') {
                        // Negative bombID to signal possible powerup spawn under rock
                        m.bombMap[this.iGrid+i][this.jGrid] = -this.bombID;
                        rockCollide.down = true;
                    }else if (typeof m.bombMap[this.iGrid+i][this.jGrid] === 'object') {
                        // Explode bombs in blast radius below
                        m.bombMap[this.iGrid+i][this.jGrid].exploding = true;
                        m.bombMap[this.iGrid+i][this.jGrid].explode();
                        rockCollide.down = true;
                    } else if (typeof m.bombMap[this.iGrid+i][this.jGrid] === 'number') {
                        // Overwrites previous bombs blast
                        m.bombMap[this.iGrid+i][this.jGrid] = this.bombID;
                    }else if (m.bombMap[this.iGrid+i][this.jGrid] === 'bombpower' || m.bombMap[this.iGrid+i][this.jGrid] === 'extrabomb' || m.bombMap[this.iGrid+i][this.jGrid] === 'speed' ){
                        // Destroys any powerups in space
                        m.bombMap[this.iGrid+i][this.jGrid] = this.bombID;
                    }else {
                        rockCollide.down = true;
                    }
                } else {
                    rockCollide.down = true
                }
            }
            // Explode right, checking for walls & bombs
            if (!rockCollide.right) {
                // Kill bomber in blast radius right
                if (typeof m.bomberLocations[this.iGrid][this.jGrid+i] === 'object') {
                    m.bomberLocations[this.iGrid][this.jGrid+i].die();
                }
                if (this.jGrid+i < 16) {
                    if (m.bombMap[this.iGrid][this.jGrid+i] === 'free') {
                        m.bombMap[this.iGrid][this.jGrid+i] = this.bombID;
                    } else if (m.bombMap[this.iGrid][this.jGrid+i] === 'rock') {
                        // Negative bombID to signal possible powerup spawn under rock
                        m.bombMap[this.iGrid][this.jGrid+i] = -this.bombID;
                        rockCollide.right = true;
                    } else if (typeof m.bombMap[this.iGrid][this.jGrid+i] === 'object') {
                        // Explode bombs in blast radius right
                        m.bombMap[this.iGrid][this.jGrid+i].exploding = true;
                        m.bombMap[this.iGrid][this.jGrid+i].explode();
                        rockCollide.right = true;
                    } else if (typeof m.bombMap[this.iGrid][this.jGrid+i] === 'number'){
                        // Overwrites previous bombs blast
                        m.bombMap[this.iGrid][this.jGrid+i] = this.bombID;
                    }else if (m.bombMap[this.iGrid][this.jGrid+i] === 'bombpower' || m.bombMap[this.iGrid][this.jGrid+i] === 'extrabomb' || m.bombMap[this.iGrid][this.jGrid+i] === 'speed' ){
                        // Destroys any powerups in space
                        m.bombMap[this.iGrid][this.jGrid+i] = this.bombID;
                    }else {
                        rockCollide.right = true;
                    }
                } else {
                    rockCollide.right = true
                }
            }
            // Explode left, checking for walls & bombs
            if (!rockCollide.left) {
                // Kill bomber in blast radius left
                if (typeof m.bomberLocations[this.iGrid][this.jGrid-i] === 'object') {
                    m.bomberLocations[this.iGrid][this.jGrid-i].die();
                }
                if (this.jGrid-i >= 0) {
                    if (m.bombMap[this.iGrid][this.jGrid-i] === 'free') {
                        m.bombMap[this.iGrid][this.jGrid-i] = this.bombID;
                    } else if (m.bombMap[this.iGrid][this.jGrid-i] === 'rock') {
                        // Negative bombID to signal possible powerup spawn under rock
                        m.bombMap[this.iGrid][this.jGrid-i] = -this.bombID;
                        rockCollide.left = true;
                    } else if (typeof m.bombMap[this.iGrid][this.jGrid-i] === 'object') {
                        // Explode bombs in blast radius left
                        m.bombMap[this.iGrid][this.jGrid-i].exploding = true;
                        m.bombMap[this.iGrid][this.jGrid-i].explode();
                        rockCollide.left = true;
                    } else if (typeof m.bombMap[this.iGrid][this.jGrid-i] === 'number') {
                        // Overwrites previous bombs blast
                        m.bombMap[this.iGrid][this.jGrid-i] = this.bombID;
                    }else if (m.bombMap[this.iGrid][this.jGrid-i] === 'bombpower' || m.bombMap[this.iGrid][this.jGrid-i] === 'extrabomb' || m.bombMap[this.iGrid][this.jGrid-i] === 'speed' ){
                        // Destroys any powerups in space
                        m.bombMap[this.iGrid][this.jGrid-i] = this.bombID;
                    } else {
                        rockCollide.left = true;
                    }
                } else {
                    rockCollide.left = true
                }
            }
        }
        this.owner.bombAmmo +=1;


        // Sets spaces back into free after bomb blast
        setTimeout(() => {
            // Checks to see if the space has been overwritten by new bomb blast
            if (m.bombMap[this.iGrid][this.jGrid] === this.bombID) {
                m.bombMap[this.iGrid][this.jGrid] = 'free';
            }        
            for (let i = 1; i < this.power+1; i++){
                // Clear above
                if (this.iGrid-i >= 0) {
                    // Checks to see if the space has been overwritten by new bomb blast
                    if (m.bombMap[this.iGrid-i][this.jGrid] === this.bombID) {
                        m.bombMap[this.iGrid-i][this.jGrid] = 'free';
                    } else if (m.bombMap[this.iGrid-i][this.jGrid] === -this.bombID){
                        // Places random powerup if space previously contained a rock
                        if (m.powerUps[this.iGrid-i][this.jGrid] === "speed" || m.powerUps[this.iGrid-i][this.jGrid] === "bombpower" || m.powerUps[this.iGrid-i][this.jGrid] === "extrabomb"){
                            m.bombMap[this.iGrid-i][this.jGrid] = m.powerUps[this.iGrid-i][this.jGrid];
                        } else {
                            m.bombMap[this.iGrid-i][this.jGrid] = 'free';
                        }
                    }
                }
                // Clear below
                if (this.iGrid+i < 16) {
                    if (m.bombMap[this.iGrid+i][this.jGrid] === this.bombID) {
                        m.bombMap[this.iGrid+i][this.jGrid] = 'free';
                    } else if (m.bombMap[this.iGrid+i][this.jGrid] === -this.bombID){
                        if (m.powerUps[this.iGrid+i][this.jGrid] === "speed" || m.powerUps[this.iGrid+i][this.jGrid] === "bombpower" || m.powerUps[this.iGrid+i][this.jGrid] === "extrabomb"){
                            m.bombMap[this.iGrid+i][this.jGrid] = m.powerUps[this.iGrid+i][this.jGrid];
                        } else {
                            m.bombMap[this.iGrid+i][this.jGrid] = 'free';
                        }
                    }
                }
                // Clear right
                if (this.jGrid+i < 16) {
                    if (m.bombMap[this.iGrid][this.jGrid+i] === this.bombID) {
                        m.bombMap[this.iGrid][this.jGrid+i] = 'free';
                    } else if (m.bombMap[this.iGrid][this.jGrid+i] === -this.bombID){
                        if (m.powerUps[this.iGrid][this.jGrid+i] === "speed" || m.powerUps[this.iGrid][this.jGrid+i] === "bombpower" || m.powerUps[this.iGrid][this.jGrid+i] === "extrabomb"){
                            m.bombMap[this.iGrid][this.jGrid+i] = m.powerUps[this.iGrid][this.jGrid+i];
                        } else {
                            m.bombMap[this.iGrid][this.jGrid+i] = 'free';
                        }
                    }
                }
                // Clear left
                if (this.jGrid-i >= 0) {
                    if (m.bombMap[this.iGrid][this.jGrid-i] === this.bombID) {
                        m.bombMap[this.iGrid][this.jGrid-i] = 'free';
                    } else if (m.bombMap[this.iGrid][this.jGrid-i] === -this.bombID){
                        if (m.powerUps[this.iGrid][this.jGrid-i] === "speed" || m.powerUps[this.iGrid][this.jGrid-i] === "bombpower" || m.powerUps[this.iGrid][this.jGrid-i] === "extrabomb"){
                            m.bombMap[this.iGrid][this.jGrid-i] = m.powerUps[this.iGrid][this.jGrid-i];
                        } else {
                            m.bombMap[this.iGrid][this.jGrid-i] = 'free';
                        }
                    }
                }
            }
            // Deletes the bomb
            delete this;
        }, 300)
    }


    timerExplode () {
        setTimeout(() => {
            // Explodes the bomb if it hasn't yet been triggered by another
            if (!this.exploding && !gameReset) {
                this.explode();
                this.exploding = true;
            }
        }, 3000)       
    }

    gridPlacer () {
        m.bombMap[this.iGrid][this.jGrid] = this;
    }

}


class Bomber{
    constructor(x, y, iGrid, jGrid, num){
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.moveUp = false;
        this.moveDown = false;
        this.moveRight = false;
        this.moveLeft = false;
        this.speed = 2;
        this.iGrid = iGrid;
        this.jGrid = jGrid;
        this.bombPower = 1;
        this.bombAmmo = 2;
        this.num = num - 1 ;
    }


    die(){
        if(this.num == 0){
            playerOneDead = true;
            playerOneX = this.x;
            playerOneY = this.y;
        }else{
            playerTwoDead = true;
            playerTwoX = this.x;
            playerTwoY = this.y;
        }
        m.bomberLocations[this.iGrid][this.jGrid] = 'free';
        playersLeft--;
        g.playerArr.splice(this.num, 1, '');
    }

    wallDetection(){
        
        //Move Right OOB Check
        if(this.x + this.speed + this.width > 850){
            for(let i = 0; i < this.speed; i++){
                if(this.x + this.width < 850){
                    this.x++;
                }
            }
        }else{
            if(this.moveRight){
                this.x += this.speed;
            }
        }
        //Move Left OOB Check
        if(this.x - this.speed < 0){
            for(let i = 0; i < this.speed; i++){
                if(this.x > 0){
                    this.x--;
                }
            }
        }else{
            if(this.moveLeft){
                this.x -= this.speed;
            }
        }
        //Move Down OOB Check
        if(this.y  + this.height + this.speed > 850){
            for(let i = 0; i < this.speed; i++){
                if(this.y + this.height < 850){
                    this.y++;
                }
            }
        }else{
            if(this.moveDown){
                this.y += this.speed;
            }
        }
        //Move Up OOB Check
        if(this.y - this.speed < 0){
            for(let i = 0; i < this.speed; i++){
                if(this.y > 0){
                    this.y--;
                }
            }
        }else{
            if(this.moveUp){
                this.y -= this.speed;
            }
        }
    }

    gridPlacer () {
        let xMin = 50;
        let xMax = 100;
        let yMin = 50;
        let yMax = 100;

        // Iterates through the 2d array
        for (let i = 1; i < m.bomberLocations.length-1; i++) {
            for (let j = 1; j < m.bomberLocations.length-1; j++) {
                if (this.x >= xMin && this.x < xMax && this.y >= yMin && this.y < yMax) {
                    if(m.bombMap[i][j] === "bombpower"){
                        this.bombPower++;
                        m.bombMap[i][j] = 'free';
                    }
                    if(m.bombMap[i][j] === "extrabomb"){
                        this.bombAmmo++;
                        m.bombMap[i][j] = 'free';
                    }
                    if(m.bombMap[i][j] === "speed"){
                        if(this.speed < 6){
                            this.speed += 1
                        }
                        m.bombMap[i][j] = 'free';
                    }
                    m.bomberLocations[i][j] = g.playerArr[this.num];
                    this.iGrid = i;
                    this.jGrid = j;
                }else if(m.bomberLocations[i][j] === "wall" ||m.bomberLocations[i][j] === "bombpower" || m.bomberLocations[i][j] === "extrabomb" || m.bomberLocations[i][j] === "speed" || m.bomberLocations[i][j] !== g.playerArr[this.num]){}
                 else {
                        m.bomberLocations[i][j] = "free";
                }
                xMin += 50;
                xMax += 50;
            }
            yMin += 50;
            yMax += 50;
            xMin = 50;
            xMax = 100;
        }
    }

    wallDetector () {
        let theWalls = {};
        //Checks if there is a wall to the right
        if(this.jGrid === 15) {
            theWalls.right = true;
        }else if(m.bombMap[this.iGrid][this.jGrid+1] === 'wall' || m.bombMap[this.iGrid][this.jGrid+1] === 'rock' || typeof m.bombMap[this.iGrid][this.jGrid+1] === 'object') {
            theWalls.right = true;
        } else if(this.y + this.height > this.iGrid * 50 + 50) {
            if (m.bombMap[this.iGrid+1][this.jGrid-1] === 'wall' || m.bombMap[this.iGrid+1][this.jGrid-1] === 'rock' || typeof m.bombMap[this.iGrid+1][this.jGrid-1] === 'object'){
                theWalls.right = true;
            }
        }else{
            theWalls.right = false;
        }

        // Checks if there is a wall to the left
        if (this.jGrid === 1) {
            theWalls.left = true;
        }else if(m.bombMap[this.iGrid][this.jGrid-1] === 'wall' || m.bombMap[this.iGrid][this.jGrid-1] === 'rock' || typeof m.bombMap[this.iGrid][this.jGrid-1] === 'object') {
            theWalls.left = true;
        } else if (this.y + this.height > this.iGrid * 50 + 50) {
            if (m.bombMap[this.iGrid+1][this.jGrid-1] === 'wall' || m.bombMap[this.iGrid+1][this.jGrid-1] === 'rock' || typeof m.bombMap[this.iGrid+1][this.jGrid-1] === 'object') {
                theWalls.left = true;
            }
        } else{
            theWalls.left = false;
        }

        // Checks if there is a wall below
        if(this.iGrid === 15) {
            theWalls.down = true;
        } else if (m.bombMap[this.iGrid+1][this.jGrid] === 'wall' || m.bombMap[this.iGrid+1][this.jGrid] === 'rock' || typeof m.bombMap[this.iGrid+1][this.jGrid] === 'object') {
            theWalls.down = true;
        } else if (this.x + this.width > this.jGrid * 50 + 50) {
            if (m.bombMap[this.iGrid+1][this.jGrid+1] === 'wall' || m.bombMap[this.iGrid+1][this.jGrid+1] === 'rock' || typeof m.bombMap[this.iGrid+1][this.jGrid+1] === 'object') {
                theWalls.down = true;
            }
        }       
        else {
            theWalls.down = false;
        }

        // Checks if there is a wall above
        if (this.iGrid === 1) {
            theWalls.up = true;
        }else if(m.bombMap[this.iGrid-1][this.jGrid] === 'wall' || m.bombMap[this.iGrid-1][this.jGrid] === 'rock' || typeof m.bombMap[this.iGrid-1][this.jGrid] === 'object') {
            theWalls.up = true
        }else if (this.x + this.width > this.jGrid * 50 + 50){
            if (m.bombMap[this.iGrid-1][this.jGrid + 1] === 'wall' || m.bombMap[this.iGrid-1][this.jGrid + 1] === 'rock' || typeof m.bombMap[this.iGrid-1][this.jGrid + 1] === 'object') {
                theWalls.up = true;
            }  
        } else {
            theWalls.up = false;
        }
//////////////////////////////////////////////////// BUGFIX
        if(theWalls.up == false && theWalls.left == false && this.moveLeft == true && this.moveUp == true){
            if(this.x - this.speed < this.jGrid * 50 && this.y-this.speed < this.iGrid * 50){
                this.x -= this.speed;
                theWalls.up = true;
                theWalls.left = true;
            }
        }
        if(theWalls.up == false && theWalls.right == false && this.moveRight == true && this.moveUp == true){
            if(this.x + this.width + this.speed > this.jGrid * 50 + 50 && this.y+this.speed < this.iGrid * 50){
                theWalls.up = true;
                theWalls.right = true;
            }
        }
        if(theWalls.down == false && theWalls.left == false && this.moveLeft == true && this.moveDown == true){
            if(this.x - this.speed < this.jGrid * 50 && this.y- this.height - this.speed > this.iGrid * 50 + 50){
                theWalls.down = true;
                theWalls.left = true;
            }
        }
        if(theWalls.down == false && theWalls.right == false && this.moveRight == true && this.moveDown == true){
            if(this.x - this.speed > this.jGrid * 50 && this.y-this.speed > this.iGrid * 50){
                this.y += this.speed;
                theWalls.down = true;
                theWalls.right = true;
            }
        }
////////////////////////////////////////////////////////

        return theWalls;
    }
    move(){
        let theWalls = this.wallDetector();
        //Move Right OOB Check
        if(theWalls.right){
            if(this.x + this.speed + this.width > (this.jGrid * 50) + 50 ) {
                for(let i = 0; i < this.speed; i++){
                    if(this.x + this.width < (this.jGrid * 50) + 50){
                        this.x++;
                    }
                }
            }else{
                if(this.moveRight){
                    this.x += this.speed;
                }
            }
        }else{
            if(this.moveRight){
                this.x += this.speed;
            }
        }

        //Move Left OOB Check
        if(theWalls.left){ 
            if(this.x - this.speed < (this.jGrid * 50)) {
                for(let i = 0; i < this.speed; i++){
                    if(this.x > (this.jGrid * 50)){
                        this.x--;
                    }
                }
            }else{
                if(this.moveLeft){
                    this.x -= this.speed;
                }
            }
        }else{
            if(this.moveLeft){
                this.x -= this.speed;
            }
        }

        //Move Down OOB Check
        if(theWalls.down){
            if(this.y  + this.height + this.speed > (this.iGrid * 50) + 50) {
                for(let i = 0; i < this.speed; i++){
                    if(this.y + this.height < (this.iGrid * 50) + 50){
                        this.y++;
                    }
                }
            }else{
                if(this.moveDown){
                    this.y += this.speed;
                }
            }
        }else{
            if(this.moveDown){
                this.y += this.speed;
            }
        }

        //Move Up OOB Check
        if(theWalls.up){
            if(this.y - this.speed < this.iGrid * 50) {
                for(let i = 0; i < this.speed; i++){
                    if(this.y > (this.iGrid * 50)){
                        this.y--;
                    }
                }
            }else{
                if(this.moveUp){
                    this.y -= this.speed;
                }
            }
        }else{
            if(this.moveUp){
                this.y -= this.speed;
            }
        }

    }

    
}

class BombMap {
    constructor(){
        this.bombMap = [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
        ];
        this.bomberLocations = [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
        ];
        this.powerUps = [
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall', 'free', 'wall'],
            ['wall', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'wall'],
            ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
        ];
    }
    placeRandomPowerup(){
        let powers = [
            "speed",
            "bombpower",
            "extrabomb"
        ];
        // 50% chance to spawn powerup, 50% chance free space
        if(0.5 < Math.random()){
            return powers[Math.floor(Math.random()*3)];
        } else {
            return 'free';
        }
    }

    generateRocks() {
        for (let i = 1; i < this.bombMap.length-1; i++) {
            for(let j = 1; j < this.bombMap.length-1; j++) {
                if (this.bombMap[i][j] === 'wall') {
                    continue;
                }else if ((j < 3 || j > 13) && (i === 1 || i === 15)) {
                    continue;
                } else if ((i < 3 || i > 13) && (j === 1 || j === 15)) {
                    continue;
                } else {
                    if (Math.random() > 0.25) {
                        this.bombMap[i][j] = 'rock';
                        this.bomberLocations[i][j] = 'rock';
                        this.powerUps[i][j] = this.placeRandomPowerup();
                    }
                }
            }
        }
    
    }
}

class Game {

    constructor(){
        this.playerArr = [];
    }
    // Creates bomber and places him in bomber array
    createPlayer(x, y, iGrid, jGrid, num) {
        this.playerArr.push(new Bomber(x, y, iGrid, jGrid, num)); 
    }
}

function mainLoop(){

    //RESETTING THE GAME
    // if (playersLeft === 1) {
    //     for(let i = 0; i < g.playerArr.length; i++) {
    //         if (typeof g.playerArr[i] === 'object') {
    //             playerScores[`p${i+1}`] += 1;
    //             for (let j = 0; j < numOfPlayers; j++) {
    //             }
    //         }
    //     }
    //     for(let i = 0; i < g.playerArr.length; i++) {
    //         if (typeof g.playerArr[i] === 'object') {
    //             if(playerScores[`p${i+1}`] > 0){
    //                 gameComplete = true;
    //             }
    //         }
    //     }
    //     playersLeft = 0;
    //     gameReset = true;
    //     if (!gameComplete){
    //         setTimeout(()=>{
    //             startNewRound();
    //         }, 5000)
    //     }
    // }//END RESETTING

    //GRID PLACER & MoveCheck
    for (let i = 0; i < g.playerArr.length; i++) {
        if(g.playerArr[i] !== ''){
            g.playerArr[i].gridPlacer();
            if(g.playerArr[i].moveUp || g.playerArr[i].moveDown || g.playerArr[i].moveLeft || g.playerArr[i].moveRight){
                g.playerArr[i].move();
            }
        }
    }
    if (playerOneDead) {
        let deathCoords1 = {x: playerOneX, y: playerOneY};
        io.sockets.emit('playerOneDead', deathCoords1);
    }
    if (playerTwoDead) {
        let deathCoords2 = {x: playerTwoX, y: playerTwoY};
        io.sockets.emit('playerTwoDead', deathCoords2);
    }
    if (playerThreeDead) {
        let deathCoords3 = {x: playerThreeX, y: playerThreeY};
        io.sockets.emit('playerThreeDead', deathCoords3);
    }
    if (playerFourDead) {
        let deathCoords4 = {x: playerFourX, y: playerFourY};
        io.sockets.emit('playerFourDead', deathCoords4);
    }
    // if(gameComplete == true){
    //     //EVENTUALLY GO TO SCORE SCREEN
    //     console.log('happ')
    //     ctx.font = "30px Arial";
    //     ctx.fillText(`Space to restart :)`, 350, 400);
    //     //////
    // }
}
//END OF MAIN LOOP


// /* 
// ///////
// /////
// /////
// Need to add commands here
// /////////
// /////////
// /////////
// */
let allData;
let g;
let m;
function startNewRound() {
    console.log('starting game');
    g = new Game();
    m = new BombMap();
    g.createPlayer(60, 75, 1, 1, 1);
    g.createPlayer(760, 760, 15, 15, 2);
    g.createPlayer(60, 760, 15, 15, 3);
    m.generateRocks();
    allData = {
        map: m,
        players: g.playerArr
    };
    io.sockets.emit('allData', allData);
    io.sockets.emit('chooseSprites');
    io.sockets.emit('bomberDataRequest');
    io.sockets.emit('serverFrame');
    // playerOneDead = false;;
    // playerTwoDead = false;
    // playerThreeDead = false;
    // playerFourDead = false;
    setInterval(() => {
        io.sockets.emit('allData', allData);
        mainLoop();
    }, 1000/60)



    // numOfPlayers = g.playerArr.length;
    // playersLeft = g.playerArr.length;
    // setTimeout(() => {
    //     gameReset = false;
    // }, 2999);
}

// function mainLoopable(){
//     if(gameRunning == false){
//         stopMainLoop = false;
//         mainLoop();
//     }
// }

class Startscreen{
    constructor(){
        this.p1 = {
            exists: false,
            position: 1
        };
        this.p2 = {
            exists: false,
            position: 1
        };
        this.p3 = {
            exists: false,
            position: 1
        };
        this.p4 = {
            exists: false,
            position: 1
        };
        this.sprite1 = true;
        this.sprite2 = true;
        this.sprite3 = true;
        this.sprite4 = true;

    }

    movePosition(player, input){
        
        switch(input){
            case "w":
                
                if(player.position == 3){
                    player.position = 1;
                }
                if(player.position == 4){
                    player.position = 2;
                }
                if(player.position == 5){
                    player.position = 3;
                }
                if(player.position == 6){
                    player.position = 4;
                }
                break;
            case "a":
                
                if(player.position == 2){
                    player.position = 1;
                }
                if(player.position == 4){
                    player.position = 3;
                }
                if(player.position == 6){
                    player.position = 5;
                }
                break;
            case "s":
                
                if(player.position == 1){
                    player.position = 3;
                }
                else if(player.position == 2){
                    player.position = 4;
                }
                else if(player.position == 3){
                    player.position = 5;
                }
                else if(player.position == 4){
                    player.position = 6;
                }
                break;
            case "d":
                
                if(player.position == 1){
                    player.position = 2;
                }
                if(player.position == 3){
                    player.position = 4;
                }
                if(player.position == 5){
                    player.position = 6;
                }
                break;
            case "spacebar":
                
                
                if(player.exists == true){
                    if(player.position == 1 && this.sprite1 == true){
                        this.sprite1 = false;
                        player.exists = false;
                        //The Player.id gets that sprite
                    }
                    if(player.position == 2  && this.sprite2 == true){
                        this.sprite2 = false;
                        player.exists = false;
                        //The Player.id gets that sprite
                    }
                    if(player.position == 3  && this.sprite3 == true){
                        this.sprite3 = false;
                        player.exists = false;
                        //The Player.id gets that sprite
                    }
                    if(player.position == 4  && this.sprite4 == true){
                        this.sprite4 = false;
                        player.exists = false;
                        //The Player.id gets that sprite
                    }
                }
                break;
        }
    }
}



// // function restartSession(){
// //     for(let i = 0; i < g.playerArr.length; i++) {       
// //         playerScores[`p${i+1}`] = 0;      
// //     }
// //     s = new Startscreen();
// //     gameRunning = false;
// //     gameComplete = false;
// //     stopMainLoop = true;
// //     startLoop();  
// // }

let s = new Startscreen();


let startGame = false;






