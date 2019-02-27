var funcOrder = [];
var colorOrder = [];
class LangtonsAnt{
    constructor(GRID_SIZE = 50, START_SPEED = 30, SEQUENCE = 'RL') {
        /* initialize matrix  */
        this.matrix = new Array(GRID_SIZE);
        for(let p = 0; p < GRID_SIZE; p++) {
            this.matrix[p] = new Array(GRID_SIZE);
            this.matrix[p].fill(0);
        }

        /* size and padding for drawing cells */
        this.size = GRID_SIZE;
        this.padding = res/GRID_SIZE;
        this.colorsChanged = 0;

        /* ant properties */
        let startPoint = floor(GRID_SIZE/2);
        this.ant = createVector(startPoint, startPoint);
        this.antFacing = 0; // 0 - left, 1 - up, 2 - right, 3 - down

        /* draw background cells */
        this.drawGrid();

        /* init slider for controlling frame rate */
        this.speedCtrl = createSlider(2,60,START_SPEED,2);
        this.speedCtrl.position(1, res + 20);
        textSize(25);

        /* set behavior */
        this.changeBehavior(SEQUENCE);
    }
    drawGrid() {
        stroke(255, 255, 255, 150);
        fill(0);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++){
                rect(this.padding*i, this.padding*j, this.padding, this.padding);
            }
        }
    }

    turnRight() {
        if (this.antFacing === 0) {
            this.ant.y -= 1;
            this.antFacing = 1;
        } else if (this.antFacing === 1) {
            this.ant.x += 1;
            this.antFacing = 2;
        } else if (this.antFacing === 2) {
            this.ant.y += 1;
            this.antFacing = 3;
        } else if (this.antFacing === 3) {
            this.ant.x -= 1;
            this.antFacing = 0;
        }
    }
    turnLeft() {
        if (this.antFacing === 0) {
            this.ant.y += 1;
            this.antFacing = 3;
        } else if (this.antFacing === 1) {
            this.ant.x -= 1;
            this.antFacing = 0;
        } else if (this.antFacing === 2) {
            this.ant.y -= 1;
            this.antFacing = 1;
        } else if (this.antFacing === 3) {
            this.ant.x += 1;
            this.antFacing = 2;
        }
    }

    writeLSequence(num, length) {
        colorOrder.push(color(floor(random(50,255)), floor(random(50,255)), floor(random(50,255))));
        funcOrder.push(function(classAnts) {
            if (classAnts.matrix[classAnts.ant.x][classAnts.ant.y] === num) {
                classAnts.matrix[classAnts.ant.x][classAnts.ant.y] = length === num + 1? 0 : num + 1;
                fill(colorOrder[num]);
                rect(classAnts.padding*classAnts.ant.x, classAnts.padding*classAnts.ant.y, classAnts.padding, classAnts.padding);
                classAnts.turnLeft();
            }
        });
    }
    writeRSequence(num, length) {
        colorOrder.push(color(floor(random(50,255)), floor(random(50,255)), floor(random(50,255))));
        funcOrder.push(function(classAnts) {
            if (classAnts.matrix[classAnts.ant.x][classAnts.ant.y] === num) {
                classAnts.matrix[classAnts.ant.x][classAnts.ant.y] = length === num + 1? 0 : num + 1;
                fill(colorOrder[num]);
                rect(classAnts.padding*classAnts.ant.x, classAnts.padding*classAnts.ant.y, classAnts.padding, classAnts.padding);
                classAnts.turnRight();
            }
        });
    }
    changeBehavior(sequence) {
        funcOrder.length = 0;
        colorOrder.length = 0;
        let count = 0;
        let sLength = sequence.length;
        for (let i = 0; i < sLength; i++) {
            if (sequence[i] === 'L' || sequence[i] === 'l') {
                this.writeLSequence(count, sLength);
                count++;
            } else if (sequence[i] === 'R' || sequence[i] === 'r') {
                this.writeRSequence(count, sLength);
                count++;
            }
        }
    }

    changeColors(sequnce) {
        if (this.colorsChanged + 1 > colorOrder.length) {
            this.colorsChanged = 0;
        }
        colorOrder[this.colorsChanged] = color(sequnce);
        this.colorsChanged++;
    }

    isOver() {
        return (this.ant.x > this.size - 1 || this.ant.x < 0 || this.ant.y > this.size - 1 || this.ant.y < 0);
    }
    move() {
        if (this.isOver()){
            noLoop();
            return;
        }
        for (let func = 0; func < funcOrder.length; func++) {
            funcOrder[func](this);
        }
    }

    statistics() {
        /* display info and control speed */
        frameRate(this.speedCtrl.value());
        fill(255);
        rect(150, res + 17.5, 20*17.5, 25);
        fill(0);
        text('SPEED: ' + this.speedCtrl.value(), 150, res + 40);
        text('STEPS: ' + frameCount, 150 + 8*17.5, res + 40);
    }
}