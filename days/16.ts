export class Direction {
    static readonly North = new Direction(0, -1);
    static readonly South = new Direction(0, 1);
    static readonly West = new Direction(-1, 0);
    static readonly East = new Direction(1, 0);

    readonly x: number;
    readonly y: number;

    private constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    left(): Direction {
        switch (this) {
            case Direction.North: return Direction.West;
            case Direction.South: return Direction.East;
            case Direction.West: return Direction.South;
            case Direction.East: return Direction.North;
            default: return this;
        }
    }

    right(): Direction {
        switch (this) {
            case Direction.North: return Direction.East;
            case Direction.South: return Direction.West;
            case Direction.West: return Direction.North;
            case Direction.East: return Direction.South;
            default: return this;
        }
    }
}

export class Position {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }

    shifted(direction: Direction): Position {
        return new Position(this.x + direction.x, this.y + direction.y);
    }
}

export enum Move {
    Forward,
    Left,
    Right,
}

export const MOVES = [Move.Forward, Move.Left, Move.Right];

export class Path {
    readonly score: number;

    private constructor(positions: Position[], moves: Move[] = [], score = 0) {
        this._positions = positions;
        this._moves = moves;
        this.score = score;
    }

    static fromStart(start: Position): Path {
        return new Path([start]);
    }

    with(position: Position, move: Move): Path {
        return new Path([...this._positions, position], [...this._moves, move], this.score + (move === Move.Forward ? 1 : 1001));
    }

    get positions(): ReadonlyArray<Position> { return this._positions; }

    get moves(): ReadonlyArray<Move> { return this._moves; }

    private readonly _positions: Position[];
    private readonly _moves: Move[];
}

export class Reindeer {
    readonly position: Position;
    readonly direction: Direction;
    readonly path: Path;

    constructor(position: Position, direction = Direction.East, path = Path.fromStart(position)) {
        this.position = position;
        this.direction = direction;
        this.path = path;
    }

    moved(move: Move): Reindeer {
        let direction = this.direction;

        switch (move) {
            case Move.Left: direction = direction.left(); break;
            case Move.Right: direction = direction.right(); break;
        }

        const newPosition = this.position.shifted(direction);

        return new Reindeer(newPosition, direction, this.path.with(newPosition, move));
    }
}

export class Maze {
    static readonly EMPTY = ".";
    static readonly WALL = "#";
    static readonly START = "S";
    static readonly END = "E";

    constructor(map: string[][]) {
        this._map = map;
    }

    static fromInput(input: string): Maze {
        return new Maze(input.trim().split("\n").map((line) => line.trim().split("")));
    }

    bestPath(): Path | null {
        return this._path(new Reindeer(this._start()));
    }

    alternativePaths(path: Path, startDirection?: Direction): Path[] {
        const paths = [path];

        let reindeer = new Reindeer(path.positions[0], startDirection);

        for (const move of path.moves) {
            for (const maybeMove of MOVES) {
                if (maybeMove === move) continue;

                const maybeReindeer = reindeer.moved(maybeMove);

                if (this._at(maybeReindeer.position) === Maze.WALL) continue;

                const maybePath = this._path(maybeReindeer);

                if (maybePath === null) continue;

                if (maybePath.score === path.score) paths.push(maybePath);
            }

            reindeer = reindeer.moved(move);
        }

        return paths;
    }

    private readonly _map: string[][];

    private _at(position: Position): string {
        return this._map[position.y][position.x];
    }

    private _start(): Position {
        for (let y = 0; y < this._map.length; y++) {
            for (let x = 0; x < this._map[y].length; x++) {
                if (this._map[y][x] === Maze.START) return new Position(x, y);
            }
        }

        return new Position(-1, -1);
    }

    private _path(start: Reindeer): Path | null {
        const explored: boolean[][] = this._map.map((row) => Array(row.length).fill(false));

        explored[start.position.y][start.position.x] = true;

        const queue = [start];

        while (queue.length > 0) {
            const reindeer = queue.pop()!;

            if (this._at(reindeer.position) === Maze.END) return reindeer.path;

            for (const move of MOVES) {
                const movedReindeer = reindeer.moved(move);

                if (this._at(movedReindeer.position) === Maze.WALL || explored[movedReindeer.position.y][movedReindeer.position.x]) continue;

                explored[movedReindeer.position.y][movedReindeer.position.x] = true;

                // Inserts the moved reindeer into the queue in the correct order, so that the lowest score is last
                if (queue.length === 0) queue.push(movedReindeer);
                else {
                    for (let i = 0; i < queue.length; i++) {
                        if (queue[i].path.score < movedReindeer.path.score) {
                            queue.splice(i, 0, movedReindeer);
                            break;
                        }
                        
                        if (i === queue.length - 1) {
                            queue.push(movedReindeer);
                            break;
                        }
                    }
                }
            }
        }

        return null;
    }
}

export function uniquePositionCount(paths: Path[]): number {
    return paths.reduce((set, path) => set.union(new Set(path.positions.map((pos) => pos.toString()))), new Set()).size;
}

if (import.meta.main) {
    const maze = Maze.fromInput(await Deno.readTextFile("./days/inputs/16.txt"));
    const bestPath = maze.bestPath()!;

    console.log("Answer 1:", bestPath.score);

    const bestPaths = maze.alternativePaths(bestPath);

    console.log("Answer 2:", uniquePositionCount(bestPaths));
}
