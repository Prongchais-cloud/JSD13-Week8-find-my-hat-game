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

    moveLeft() {
        preLocation = [...location];
        location[1] -= 1;
    }

    moveRight() {
        preLocation = [...location];
        location[1] += 1;
    }

    moveUp() {
        preLocation = [...location];
        location[0] -= 1;
    }

    moveDown() {
        preLocation = [...location];
        location[0] += 1;
    }
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

const player = new Player();
const hat = new Hat();
const hole = new Hole();
const path = new Path();

const rows = 10;
const cols = 10;
const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});
let location = [];
let preLocation = [];

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
            const playerLocation = [r, c];
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
    location = randomPlayer(gameMap);
    preLocation = location;
    randomHat(gameMap);

    for (let row of gameMap) {
        console.log(row.map((cell) => cell.emoji).join(" "));
    }

    console.log(`Player Location X:${location[0]} Y:${location[1]}`);
    return gameMap;
}

function updateMap(plan) {
    let x = location[0];
    let y = location[1];
    if (x < 0 || x >= rows || y < 0 || y >= cols) {
        console.log("🚫 You went out of bounds! Game over.");
        return process.exit();
    } else if (plan[x][y] instanceof Hole) {
        console.log("💀 You fell into a hole! Game over.");
        return process.exit();
    } else if (plan[x][y] instanceof Hat) {
        console.log("🎉 You found the hat! You win!");
        return process.exit();
    } else {
        plan[preLocation[0]][preLocation[1]] = new Path();

        plan[x][y] = new Player();

        for (let row of plan) {
            console.log(row.map((cell) => cell.emoji).join(" "));
        }
        console.log(`Player Location X:${location[0]} Y:${location[1]}`);
    }
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

            process.stdout.write("\x1Bc");
            handleCommand(command);
            updateMap(plan);
            playerInput();
        },
    );
}

function handleCommand(command) {
    if (command === "w") {
        player.moveUp();
    } else if (command === "a") {
        player.moveLeft();
    } else if (command === "s") {
        player.moveDown();
    } else if (command === "d") {
        player.moveRight();
    }
}

const plan = createMap();
playerInput();
