export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromString(from: string): Position {
        const [x, y] = from.split(",").map((num) => +num);

        return new Position(x, y);
    }

    clone(): Position {
        return new Position(this.x, this.y);
    }

    toString(): string {
        return `${this.x},${this.y}`
    }

    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

export class Lab {
    static readonly START = "^";
    static readonly EMPTY = ".";
    static readonly WALL = "#";

    map: string[][];

    constructor(input: string) {
        this.map = input.trim().split("\n").map((line) => line.trim().split(""));
    }

    start(): Position {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === Lab.START) return new Position(x, y);
            }
        }
    
        return new Position(-1, -1);
    }
}

export class GuardDirection {
    static readonly UP = new GuardDirection(0, -1);
    static readonly DOWN = new GuardDirection(0, 1);
    static readonly LEFT = new GuardDirection(-1, 0);
    static readonly RIGHT = new GuardDirection(1, 0);

    private constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    static start(): GuardDirection {
        return GuardDirection.UP;
    }

    equals(other: GuardDirection) {
        return this._x === other._x && this._y === other._y;
    }

    next(): GuardDirection {
        if (this.equals(GuardDirection.UP)) return GuardDirection.RIGHT;
        else if (this.equals(GuardDirection.DOWN)) return GuardDirection.LEFT;
        else if (this.equals(GuardDirection.LEFT)) return GuardDirection.UP;
        else if (this.equals(GuardDirection.RIGHT)) return GuardDirection.DOWN;
        else return this;
    }

    shift(position: Position): Position {
        position.x += this._x;
        position.y += this._y;

        return position;
    }

    private _x: number;
    private _y: number;
}

export class GuardPath {
    constructor(lab: Lab) {
        this._looping = false;

        let currDir = GuardDirection.start();
        let currPos = lab.start();
        
        this._positions = [currPos];

        const walls: Map<string, GuardDirection> = new Map();

        while (true) {
            const nextPos = currDir.shift(currPos.clone());
    
            if (
                nextPos.y < 0 || nextPos.y >= lab.map.length ||
                nextPos.x < 0 || nextPos.x >= lab.map[nextPos.y].length
            ) break;
    
            if (lab.map[nextPos.y][nextPos.x] === Lab.WALL) {
                const key = nextPos.toString();
    
                if (walls.has(key) && walls.get(key)!.equals(currDir)) {
                    this._looping = true;
                    break;
                } else walls.set(key, currDir);
    
                currDir = currDir.next();
            } else {
                currPos = nextPos;
                
                this._positions.push(currPos);
            }
        }
    }

    get looping(): boolean { return this._looping; }

    uniquePositions(): Position[] {
        const unique = new Set(this._positions.map((pos) => pos.toString()));

        return Array.from(unique).map((pos) => Position.fromString(pos));
    }
    
    private _positions: Position[];
    private _looping: boolean;
}

export function findLoops(lab: Lab) {
    let count = 0;

    const pathPositions = new GuardPath(lab).uniquePositions();

    for (const pos of pathPositions) {
        if (lab.map[pos.y][pos.x] !== Lab.EMPTY) continue;

        lab.map[pos.y][pos.x] = Lab.WALL;

        if (new GuardPath(lab).looping) count++;

        lab.map[pos.y][pos.x] = Lab.EMPTY;
    }

    return count;
}

if (import.meta.main) {
    const lab = new Lab(await Deno.readTextFile("./days/inputs/06.txt"));

    const path = new GuardPath(lab);

    console.log("Answer 1:", path.uniquePositions().length);
    console.log("Answer 2:", findLoops(lab));
}
