export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: Position) {
        return this.x === other.x && this.y === other.y;
    }

    add(other: Position) {
        return new Position(this.x + other.x, this.y + other.y);
    }

    scale(scale: number) {
        return new Position(this.x * scale, this.y * scale);
    }
}

export class ClawMachine {
    static readonly CONVERSION_ERROR = new Position(10000000000000, 10000000000000);

    prize: Position;

    buttonA: Position;
    buttonB: Position;

    constructor(prize: Position, buttonA: Position, buttonB: Position) {
        this.prize = prize;
        this.buttonA = buttonA;
        this.buttonB = buttonB;
    }

    fewestTokens(): number {
        /*
        So, this solution is based on the equations for the prize x and y values:
        x₁ = x₂a + x₃b
        y₁ = y₂a + y₃b
        Where x₁ and y₁ is the position of the prize, x₂ and y₂ is the vector of button A, and x₃ and y₃ is the vector of button B.

        We can solve the top equation for b and use that to solve the bottom equation for a:
        x₁ = x₂a + x₃b; initial equation
        x₁ - x₂a = x₃b; subtract x₂a from both sides
        (x₁ - x₂a) ÷ x₃ = b; divide both sides by x₃
        b = (x₁ - x₂a) ÷ x₃; swap the sides of the equation

        Now we can solve the bottom equation for a:
        y₁ = y₂a + y₃b; initial equation
        y₁ = y₂a + y₃((x₁ - x₂a) ÷ x₃); substitute (x₁ - x₂a) ÷ x₃ for b
        y₁ = y₂a + y₃(x₁ ÷ x₃ - x₂a ÷ x₃); distribute (x₁ - x₂a) ÷ x₃
        y₁ = y₂a + y₃(x₁ ÷ x₃) - y₃(x₂a ÷ x₃); distribute y₃(x₁ ÷ x₃ - x₂a ÷ x₃)
        y₁ - y₃(x₁ ÷ x₃) = y₂a - y₃(x₂a ÷ x₃); subtract y₃(x₁ ÷ x₃) from both sides
        y₁ - y₃(x₁ ÷ x₃) = a(y₂ - y₃(x₂ ÷ x₃)); factor out a from y₂a - y₃(x₂a ÷ x₃)
        (y₁ - y₃(x₁ ÷ x₃)) ÷ (y₂ - y₃(x₂ ÷ x₃)) = a; divide both sides by (y₂ - y₃(x₂ ÷ x₃))
        a = (y₁ - y₃(x₁ ÷ x₃)) ÷ (y₂ - y₃(x₂ ÷ x₃)); swap the sides of the equation

        Valid solutions are when a and b are integers.
        Rounding a and b to the nearest integer before calculating the claw position and checking if the claw position is equal to the prize will give valid solutions.
        */

        let a = (this.prize.y - this.buttonB.y * (this.prize.x / this.buttonB.x)) / (this.buttonA.y - this.buttonB.y * (this.buttonA.x / this.buttonB.x));
        let b = (this.prize.x - this.buttonA.x * a) / this.buttonB.x;

        a = Math.round(a);
        b = Math.round(b);

        const clawPos = this.buttonA.scale(a).add(this.buttonB.scale(b));
        if (clawPos.equals(this.prize)) return (a * 3) + b;

        return -1;
    }

    fewestTokensWithErrorCorrection(): number {
        return new ClawMachine(this.prize.add(ClawMachine.CONVERSION_ERROR), this.buttonA, this.buttonB).fewestTokens();
    }
}

export function parseInput(input: string): ClawMachine[] {
    return input.trim().split("\n\n").map(
        (machineInfo) => {
            const [buttonALine, buttonBLine, prizeLine] = machineInfo.trim().split("\n").map((line) => line.trim());

            const buttonA = new Position(...buttonALine.replace("Button A: X", "").replace("Y", "").split(", ").map((num) => +num) as [number, number]);
            const buttonB = new Position(...buttonBLine.replace("Button B: X", "").replace("Y", "").split(", ").map((num) => +num) as [number, number]);

            const prize = new Position(...prizeLine.replace("Prize: X=", "").replace("Y=", "").split(", ").map((num) => +num) as [number, number]);

            return new ClawMachine(prize, buttonA, buttonB);
        }
    )
}

export function fewestTokens(machines: ClawMachine[], errorCorrection = false): number {
    return machines.reduce(
        (sum, machine) => {
            const tokens = errorCorrection ? machine.fewestTokensWithErrorCorrection() : machine.fewestTokens();

            if (tokens === -1) return sum;
            else return sum + tokens;
        }, 0
    );
}

if (import.meta.main) {
    const machines = parseInput(await Deno.readTextFile("./days/inputs/13.txt"));

    console.log("Answer 1:", fewestTokens(machines));
    console.log("Answer 2:", fewestTokens(machines, true));
}
