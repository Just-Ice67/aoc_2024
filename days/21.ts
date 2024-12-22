export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromControlPadKey(key: ControlPadKey): Vector {
        const vec = new Vector(0, 0);

        switch (key) {
            case "<": vec.x--; break;
            case ">": vec.x++; break;
            case "^": vec.y--; break;
            case "v": vec.y++; break;
        }

        return vec;
    }

    toControlPadKeys(): ControlPadKey[] {
        const keys: ControlPadKey[] = [];

        if (this.x < 0) keys.push(..."<".repeat(-this.x).split("") as ControlPadKey[]);
        else if (this.x > 0) keys.push(...">".repeat(this.x).split("") as ControlPadKey[]);

        if (this.y < 0) keys.push(..."^".repeat(-this.y).split("") as ControlPadKey[]);
        else if (this.y > 0) keys.push(..."v".repeat(this.y).split("") as ControlPadKey[]);

        return keys;
    }

    get magnitude(): number { return Math.abs(this.x) + Math.abs(this.y); }
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromString(str: string): Position {
        return new Position(...str.split(",").map(Number) as [number, number]);
    }

    toString(): string { return `${this.x},${this.y}`; }

    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }

    delta(other: Position): Vector {
        return new Vector(other.x - this.x, other.y - this.y);
    }

    shifted(vector: Vector): Position {
        return new Position(this.x + vector.x, this.y + vector.y);
    }
}

export interface Keypad<Key extends string> {
    readonly keys: ReadonlyMap<Key, Position>;
    readonly startKey: Key;

    readonly gaps: ReadonlyArray<Position>;
}

export interface KeypadInstruction<Key extends string> {
    readonly keys: ReadonlyArray<Key>;
}

export type NumericKeypadKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A";

export class NumericKeypad implements Keypad<NumericKeypadKey> {
    static readonly DEFAULT: Readonly<NumericKeypad> = new NumericKeypad(
        new Map([
            ["7", new Position(0, 0)],
            ["8", new Position(1, 0)],
            ["9", new Position(2, 0)],
            ["4", new Position(0, 1)],
            ["5", new Position(1, 1)],
            ["6", new Position(2, 1)],
            ["1", new Position(0, 2)],
            ["2", new Position(1, 2)],
            ["3", new Position(2, 2)],
            ["0", new Position(1, 3)],
            ["A", new Position(2, 3)],
        ]),
        "A",
        [new Position(0, 3)],
    );

    readonly keys: ReadonlyMap<NumericKeypadKey, Position>;
    readonly startKey: NumericKeypadKey;

    readonly gaps: ReadonlyArray<Position>;

    constructor(keys: ReadonlyMap<NumericKeypadKey, Position>, startKey: NumericKeypadKey, gaps: ReadonlyArray<Position>) {
        this.keys = keys;
        this.startKey = startKey;

        this.gaps = gaps;
    }
}

export class NumericKeypadInstruction implements KeypadInstruction<NumericKeypadKey> {
    readonly keys: ReadonlyArray<NumericKeypadKey>
    
    constructor(keys: ReadonlyArray<NumericKeypadKey>) {
        this.keys = keys;
    }

    static fromString(input: string): NumericKeypadInstruction {
        return new NumericKeypadInstruction(input.trim().split("") as NumericKeypadKey[]);
    }

    toString(): string { return this.keys.join(""); }

    complexity(finalInstructionLength: number): number {
        return finalInstructionLength * parseInt(this.toString(), 10);
    }
}

export type DirectionalKeypadKey = "^" | "v" | "<" | ">" | "A";

export class DirectionalKeypad implements Keypad<DirectionalKeypadKey> {
    static readonly DEFAULT: Readonly<DirectionalKeypad> = new DirectionalKeypad(
        new Map([
            ["^", new Position(1, 0)],
            ["A", new Position(2, 0)],
            ["<", new Position(0, 1)],
            ["v", new Position(1, 1)],
            [">", new Position(2, 1)],
        ]),
        "A",
        [new Position(0, 0)],
    );

    readonly keys: ReadonlyMap<DirectionalKeypadKey, Position>;
    readonly startKey: DirectionalKeypadKey;

    readonly gaps: ReadonlyArray<Position>;

    constructor(keys: ReadonlyMap<DirectionalKeypadKey, Position>, startKey: DirectionalKeypadKey, gaps: ReadonlyArray<Position>) {
        this.keys = keys;
        this.startKey = startKey;

        this.gaps = gaps;
    }
}

export type ControlPadKey = "^" | "v" | "<" | ">" | "A";

export class ControlPadInstruction implements KeypadInstruction<ControlPadKey> {
    readonly keys: ReadonlyArray<ControlPadKey>;

    constructor(keys: ReadonlyArray<ControlPadKey>) {
        this.keys = keys;
    }

    toString(): string { return this.keys.join(""); }
}

export class Robot
    <
        OperatingPad extends Keypad<OperatingPadKey>,
        OperatingPadKey extends string,
        ControlPad extends Keypad<ControlPadKey>,
    >
{
    static readonly NUMERIC = new Robot(NumericKeypad.DEFAULT, DirectionalKeypad.DEFAULT);
    static readonly DIRECTIONAL = new Robot(DirectionalKeypad.DEFAULT, DirectionalKeypad.DEFAULT);

    readonly operatingPad: Readonly<OperatingPad>;
    readonly controlPad: Readonly<ControlPad>;

    constructor(operatingPad: OperatingPad, controlPad: ControlPad) {
        this.operatingPad = operatingPad;
        this.controlPad = controlPad;

        this._position = this.operatingPad.keys.get(this.operatingPad.startKey)!;
    }

    instructionsToPerformInstruction(instruction: KeypadInstruction<OperatingPadKey>): ControlPadInstruction[] {
        const result = [];

        for (const key of instruction.keys) {
            const [fromCache, cacheKey] = this._tryCache(key);

            if (fromCache !== null) {
                result.push(fromCache);
                continue;
            }

            const targetPosition = this.operatingPad.keys.get(key);

            if (targetPosition === undefined) throw new Error("Invalid instruction");

            const delta = this._position.delta(targetPosition);
            
            const returnInstructionKeys = delta.toControlPadKeys().sort(
                (a, b) => {
                    if (a === b) return 0;

                    const startPosition = this.controlPad.keys.get(this.controlPad.startKey)!;

                    const aPosition = this.controlPad.keys.get(a)!;
                    const bPosition = this.controlPad.keys.get(b)!;

                    const aScore = aPosition.delta(startPosition).magnitude;
                    const bScore = bPosition.delta(startPosition).magnitude;

                    const scoreDiff = bScore - aScore;

                    if (scoreDiff !== 0) return scoreDiff;

                    const aVector = startPosition.delta(aPosition);
                    const bVector = startPosition.delta(bPosition);

                    const vectorScore = (score: number, key: ControlPadKey) => score + this.controlPad.keys.get(key)!.delta(startPosition).magnitude;
                    
                    const aVectorScore = aVector.toControlPadKeys().reduce(vectorScore, 0);
                    const bVectorScore = bVector.toControlPadKeys().reduce(vectorScore, 0);

                    return bVectorScore - aVectorScore;
                }
            );

            const instructionVectors = returnInstructionKeys.map((key) => Vector.fromControlPadKey(key));

            for (const vector of instructionVectors) {
                this._position = this._position.shifted(vector);

                if (this.operatingPad.gaps.some((gap) => gap.equals(this._position))) {
                    returnInstructionKeys.reverse();

                    break;
                }
            }

            this._position = targetPosition;

            const returnInstruction = new ControlPadInstruction([...returnInstructionKeys, "A"]);

            this._getCache().set(cacheKey, returnInstruction);

            result.push(returnInstruction);
        }

        return result;
    }
    
    private static _cache: Map<Keypad<string>, Map<Keypad<string>, Map<string, ControlPadInstruction>>> = new Map();

    private _position: Position;

    private _getCache(): Map<string, ControlPadInstruction> {
        if (!Robot._cache.has(this.operatingPad)) Robot._cache.set(this.operatingPad, new Map());

        const operatingPadCache = Robot._cache.get(this.operatingPad)!;

        if (!operatingPadCache.has(this.controlPad)) operatingPadCache.set(this.controlPad, new Map());

        return operatingPadCache.get(this.controlPad)!;
    }

    private _cacheKey(key: string): string {
        return `${this._position.toString()}:${key}`;
    }

    private _tryCache(key: OperatingPadKey): [ControlPadInstruction | null, string] {
        const cache = this._getCache();
        const cacheKey = this._cacheKey(key);

        if (cache.has(cacheKey)) {
            this._position = this.operatingPad.keys.get(key)!;

            return [cache.get(cacheKey)!, cacheKey];
        }

        return [null, cacheKey];
    }
}

export function getLengthOfInstructionForRobotChain(initialInstruction: NumericKeypadInstruction, depth: number): number {
    const cache: Map<string, number> = new Map();
    
    function inner(instructions: ControlPadInstruction[], currDepth = 0) {
        if (currDepth === depth) return instructions.reduce((acc, instruction) => acc + instruction.keys.length, 0);
        
        const cacheKey = `${currDepth}:${instructions.map((instruction) => instruction.toString()).join("")}`;
        
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey)!;
        }
        
        let length = 0;

        for (const subInstruction of instructions) {
            const instructionsToPerformSubInstruction = Robot.DIRECTIONAL.instructionsToPerformInstruction(subInstruction);

            length += inner(instructionsToPerformSubInstruction, currDepth + 1);
        }

        cache.set(cacheKey, length);

        return length;
    }

    return inner(Robot.NUMERIC.instructionsToPerformInstruction(initialInstruction));
}

export function parseInput(input: string): NumericKeypadInstruction[] {
    return input.trim().split("\n").map((line) => NumericKeypadInstruction.fromString(line));
}

export function solution(instructions: NumericKeypadInstruction[], depth: number): number {
    let total = 0;

    for (const instruction of instructions) {
        const finalInstructionLength = getLengthOfInstructionForRobotChain(instruction, depth);

        total += instruction.complexity(finalInstructionLength);
    }

    return total;
}

if (import.meta.main) {
    const instructions = parseInput(await Deno.readTextFile("./days/inputs/21.txt"));

    console.log("Answer 1:", solution(instructions, 2));
    console.log("Answer 2:", solution(instructions, 25));
}
