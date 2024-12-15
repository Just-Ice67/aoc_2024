export class Direction {
    static readonly Up = new Direction(0, -1);
    static readonly Down = new Direction(0, 1);
    static readonly Left = new Direction(-1, 0);
    static readonly Right = new Direction(1, 0);

    x: number;
    y: number;

    private constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromString(str: string): Direction {
        switch (str) {
            case "^": return Direction.Up;
            case "v": return Direction.Down;
            case "<": return Direction.Left;
            case ">": return Direction.Right;
            default: return new Direction(0, 0);
        }
    }

    toString(): string {
        switch (this) {
            case Direction.Up: return "^";
            case Direction.Down: return "v";
            case Direction.Left: return "<";
            case Direction.Right: return ">";
            default: return `${this.x},${this.y}`;
        }
    }

    horizontal(): boolean {
        return this.x !== 0 && this.y === 0;
    }

    vertical(): boolean {
        return this.x === 0 && this.y !== 0;
    }
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone(): Position {
        return new Position(this.x, this.y);
    }

    shifted(direction: Direction): Position {
        return new Position(this.x + direction.x, this.y + direction.y);
    }
}

export class Warehouse {
    static readonly EMPTY = ".";
    static readonly WALL = "#";
    static readonly BOX = "O";
    static readonly WIDE_BOX_LEFT = "[";
    static readonly WIDE_BOX_RIGHT = "]";
    static readonly ROBOT = "@";

    constructor(map: string[][]) {
        this._map = map;

        let robot = null;
        for (let y = 0; y < this._map.length; y++) {
            for (let x = 0; x < this._map[y].length; x++) {
                if (this._map[y][x] === Warehouse.ROBOT) {
                    robot = new Position(x, y);
                }
            }
        }

        if (robot === null) throw new Error("No robot found");

        this._robot = robot;
    }

    static fromString(input: string): Warehouse {
        return new Warehouse(input.trim().split("\n").map((line) => line.trim().split("")));
    }

    static gpsCoordinate(position: Position): number {
        return position.y * 100 + position.x;
    }

    static gpsCoordinateSum(positions: Position[]): number {
        return positions.reduce((sum, position) => sum + Warehouse.gpsCoordinate(position), 0);
    }

    toString(): string {
        return this._map.map((line) => line.join("")).join("\n");
    }

    boxes(): Position[] {
        const boxes = [];

        for (let y = 0; y < this._map.length; y++) {
            for (let x = 0; x < this._map[y].length; x++) {
                if (this._map[y][x] === Warehouse.BOX || this._map[y][x] === Warehouse.WIDE_BOX_LEFT) {
                    boxes.push(new Position(x, y));
                }
            }
        }

        return boxes;
    }

    robot(): Position {
        return this._robot.clone();
    }

    moveRobot(movements: Direction[]) {
        outer: for (const direction of movements) {
            const toMove = [this._robot];
            const toCheck = [this._robot.shifted(direction)];
    
            while (toCheck.length > 0) {
                const pos = toCheck.pop()!;
                const atPos = this._at(pos);
                
                if (atPos === Warehouse.WALL) continue outer;
                if (atPos === Warehouse.EMPTY) continue;
                
                if (atPos === Warehouse.WIDE_BOX_LEFT || atPos === Warehouse.WIDE_BOX_RIGHT) {
                    if (direction.vertical()) {
                        const otherHalfDir = atPos === Warehouse.WIDE_BOX_LEFT ? Direction.Right : Direction.Left;

                        const otherSide = pos.shifted(otherHalfDir);
                        
                        toMove.push(otherSide);
                        toCheck.push(otherSide.shifted(direction));
                    }
                }
                
                toMove.push(pos);
                toCheck.push(pos.shifted(direction));
            }
            
            let nextPos;
    
            while (toMove.length > 0) {
                const currPos = toMove.pop()!;
                nextPos = currPos.shifted(direction);
                
                if (this._at(nextPos) !== Warehouse.EMPTY) continue;
                
                this._setAt(nextPos, this._at(currPos));
                this._setAt(currPos, Warehouse.EMPTY);
            }
            
            this._robot = nextPos!;
        }
    }

    widened(): Warehouse {
        return new Warehouse(this._map.map(
            (row) => row.flatMap((char) => {
                switch (char) {
                    case Warehouse.EMPTY: return [".", "."];
                    case Warehouse.WALL: return ["#", "#"];
                    case Warehouse.WIDE_BOX_LEFT:
                    case Warehouse.WIDE_BOX_RIGHT:
                    case Warehouse.BOX: return [Warehouse.WIDE_BOX_LEFT, Warehouse.WIDE_BOX_RIGHT];
                    case Warehouse.ROBOT: return [Warehouse.ROBOT, Warehouse.EMPTY];
                    default: return [char];
                }
            })
        ));
    }

    private _map: string[][];
    private _robot: Position;

    private _at(position: Position): string {
        return this._map[position.y][position.x];
    }

    private _setAt(position: Position, value: string) {
        this._map[position.y][position.x] = value;
    }
}

export function parseInput(input: string): [Warehouse, Direction[]] {
    const [warehouseString, movementsString] = input.trim().split("\n\n");

    const warehouse = Warehouse.fromString(warehouseString);
    const movements = movementsString.trim().split("\n").flatMap((line) => line.trim().split("")).map((char) => Direction.fromString(char));

    return [warehouse, movements];
}

if (import.meta.main) {
    const [warehouse, movements] = parseInput(await Deno.readTextFile("./days/inputs/15.txt"));
    const wideWarehouse = warehouse.widened();

    warehouse.moveRobot(movements);
    wideWarehouse.moveRobot(movements);

    console.log("Answer 1:", Warehouse.gpsCoordinateSum(warehouse.boxes()));
    console.log("Answer 2:", Warehouse.gpsCoordinateSum(wideWarehouse.boxes()));
}
