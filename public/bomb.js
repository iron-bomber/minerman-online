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
        this.bombSprites = [bomb1, bomb2, bomb3, bomb4];
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

