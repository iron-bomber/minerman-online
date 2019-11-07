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
                    console.log(m.bomberLocations, m.bombMap, 'hello');
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

