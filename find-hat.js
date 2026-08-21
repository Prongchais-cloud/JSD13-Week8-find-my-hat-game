import { createInterface } from "node:readline";

class Entity {
    constructor(name, emoji) {
        this.name = name;
        this.emoji = emoji;
    }
}

class Player extends Entity {
    constructor() {
        super("Player", "😀");
    }
    
    moveLeft(){

    }

    moveRight(){}

    moveUp(){}

    moveDown(){}
}

class Hat extends Entity {
    constructor() {
        super("Hat", "👒");
    }
}

class Hole extends Entity {
    constructor() {
        super("Hole", "🔴");
    }
}

class Path extends Entity {
    constructor() {
        super("Path", "⬜");
    }
}

const rows = 10;
const cols = 10;
const rl = createInterface ({
    input: process.stdin,
    output: process.stdout,
});
let Location = [];


function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomHole(gameMap) {
    let holesToPlace = 15;
    while (holesToPlace > 0) {
        const r = randomInt(rows);
        const c = randomInt(cols);
        if (!(gameMap[r][c] instanceof Hole)) {
            gameMap[r][c] = new Hole();
            holesToPlace--;
        }
    }
}

function randomPlayer(gameMap) {
    let PlayerToPlace = 1;
    while (PlayerToPlace > 0) {
        const r = randomInt(rows);
        const c = randomInt(cols);
        if (!(gameMap[r][c] instanceof Hole)) {
            gameMap[r][c] = new Player();
            PlayerToPlace--;
            const playerLocation = [r,c]
            return playerLocation;
        }
    }
}

function randomHat(gameMap) {
    let HatToPlace = 1;
    while (HatToPlace > 0) {
        const r = randomInt(rows);
        const c = randomInt(cols);
        if (
            !(gameMap[r][c] instanceof Hole) &&
            !(gameMap[r][c] instanceof Player)
        ) {
            gameMap[r][c] = new Hat();
            HatToPlace--;
        }
    }
}

function createMap() {
    const gameMap = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => new Path()),
    );
    randomHole(gameMap);
    Location = randomPlayer(gameMap);
    randomHat(gameMap);

    for (let row of gameMap) {
        console.log(row.map((cell) => cell.emoji).join(" "));
    }

    console.log(`Player Location X:${Location[0]} Y:${Location[1]}`)
}




function playerInput() {
    rl.question(
        "\n[W] Up | [A] Left | [S] Down | [D] Right | [q] Quit\n> ",
        (answer) => {
            const command = answer.trim().toLowerCase();

            if (command === "q") {
                console.log("\nThank you for Playing.");
                rl.close();
                return;
            }

            handleCommand(command);
            playerInput();
        },
    );
}

function handleCommand(command){
    if(command === "w"){
        moveUp();
    } else if (command === "a"){
        moveLeft();
    } else if (command === "s"){
        moveDown();
    } else if (command === "d"){
        moveRight();
    }  else {
        console.log("Please enter W, A, S, D, or q");
    }
}

createMap();
playerInput();
