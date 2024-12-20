export class Direction {
    static readonly NORTH: Readonly<Direction> = new Direction(0, -1);
    static readonly SOUTH: Readonly<Direction> = new Direction(0, 1);
    static readonly WEST: Readonly<Direction> = new Direction(-1, 0);
    static readonly EAST: Readonly<Direction> = new Direction(1, 0);
    static readonly NONE: Readonly<Direction> = new Direction(0, 0);

    static readonly FOUR_WAYS: ReadonlyArray<Readonly<Direction>> = [Direction.NORTH, Direction.SOUTH, Direction.EAST, Direction.WEST];

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static *distanceAway(distance: number): Generator<Direction> {
        for (let offset = 0; offset < distance; offset++) {
            const compliment = distance - offset;
            
            yield new Direction(offset, compliment);
            yield new Direction(compliment, -offset);
            yield new Direction(-offset, -compliment);
            yield new Direction(-compliment, offset);
        }
    }

    equals(other: Direction): boolean {
        return this.x === other.x && this.y === other.y;
    }

    opposite(): Direction {
        return new Direction(-this.x, -this.y);
    }
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromString(input: string): Position {
        return new Position(...input.split(",").map((num) => +num) as [number, number]);
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }

    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }

    shifted(direction: Direction): Position {
        return new Position(this.x + direction.x, this.y + direction.y);
    }
}

export class Cheat {
    startPosition: Position;
    endPosition: Position;

    timeSaved: number;

    constructor(position: Position, endPosition: Position, timeSaved: number) {
        this.startPosition = position;
        this.endPosition = endPosition;

        this.timeSaved = timeSaved;
    }

    static fromString(input: string): Cheat {
        const [startPosition, endPosition, timeSaved] = input.split(":");

        return new Cheat(
            Position.fromString(startPosition),
            Position.fromString(endPosition),
            +timeSaved,
        );
    }

    toString(): string {
        return `${this.startPosition.x},${this.startPosition.y}:${this.endPosition.x},${this.endPosition.y}:${this.timeSaved}`;
    }
}

export class RaceTrack {
    static readonly EMPTY = "."
    static readonly WALL = "#"
    static readonly START = "S"
    static readonly END = "E"

    map: string[][];

    constructor(map: string[][]) {
        this.map = map;
    }

    static fromInput(input: string): RaceTrack {
        return new RaceTrack(input.trim().split("\n").map((line) => line.trim().split("")));
    }

    getPath(): [Position, Direction][] {
        const start = this._findStart();
        const path: [Position, Direction][] = [[start, Direction.NONE]];

        outer: while (true) {
            const [pos, fromDir] = path.at(-1)!;

            if (this.map[pos.y][pos.x] === RaceTrack.END) return path;
            
            const backwards = fromDir.opposite();
            
            for (const direction of Direction.FOUR_WAYS) {
                if (direction.equals(backwards)) continue;

                const moved = pos.shifted(direction);

                if (moved.y < 0 || moved.y >= this.map.length || moved.x < 0 || moved.x >= this.map[moved.y].length) continue;
                if (this.map[moved.y][moved.x] === RaceTrack.WALL) continue;

                path.push([moved, direction]);
                continue outer;
            }

            return [];
        }
    }

    findCheats(maxPicoseconds: number): Cheat[] {
        const cheats = [];

        const originalPath = this.getPath();

        for (let cheatDur = 2; cheatDur <= maxPicoseconds; cheatDur++) {
            for (let i = 0; i < originalPath.length - 1; i++) {
                const pos = originalPath[i][0];
                for (const direction of Direction.distanceAway(cheatDur)) {
                    const moved = pos.shifted(direction);

                    if (moved.y < 0 || moved.y >= this.map.length || moved.x < 0 || moved.x >= this.map[moved.y].length) continue;
                    if (this.map[moved.y][moved.x] === RaceTrack.WALL) continue;

                    const cheatEnd = originalPath.findIndex(([pos]) => pos.equals(moved));
                    const timeSaved = cheatEnd - i - cheatDur;

                    cheats.push(new Cheat(pos, moved, timeSaved));
                }
            }
        }

        return cheats;
    }

    _findStart(): Readonly<Position> {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === RaceTrack.START) return new Position(x, y);
            }
        }

        return new Position(-1, -1);
    }
}

export function cheatsAtLeast(cheats: Cheat[], target: number): number {
    return cheats.filter((cheat) => cheat.timeSaved >= target).length;
}

if (import.meta.main) {
    const raceTrack = RaceTrack.fromInput(await Deno.readTextFile("./days/inputs/20.txt"));
    
    console.log("Answer 1:", cheatsAtLeast(raceTrack.findCheats(2), 100));
    console.log("Answer 2:", cheatsAtLeast(raceTrack.findCheats(20), 100));
}
