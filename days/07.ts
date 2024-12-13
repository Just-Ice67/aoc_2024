import { BaseN } from "js-combinatorics";

export class Operator {
    static readonly Addition = new Operator("+");
    static readonly Multiply = new Operator("*");
    static readonly Combine = new Operator("||");

    static readonly Set1 = [Operator.Addition, Operator.Multiply];
    static readonly Set2 = Operator.Set1.concat(Operator.Combine);

    perform(a: number, b: number): number {
        switch (this._symbol) {
            case "+": return a + b;
            case "*": return a * b;
            case "||": return +`${a}${b}`;
            default: return NaN;
        }
    }

    private constructor(symbol: string) {
        this._symbol = symbol;
    }

    private _symbol: string;
}

export class CalibrationEquation {
    target: number;
    operands: number[];

    constructor(target: number, operands: number[]) {
        this.target = target;
        this.operands = operands;
    }

    solvable(operators: Operator[]): boolean {
        const operatorPermutations = new BaseN(operators, this.operands.length - 1);
    
        for (const operatorPermutation of operatorPermutations) {
            let total = operatorPermutation[0].perform(this.operands[0], this.operands[1]);
    
            for (let i = 2; i < this.operands.length; i++) {
                total = operatorPermutation[i - 1].perform(total, this.operands[i]);
            }
    
            if (total === this.target) return true;
        }
    
        return false;
    }
}

export function parseInput(input: string): CalibrationEquation[] {
    const equations = [];

    for (const line of input.trim().split("\n")) {
        const [target, operands] = line.trim().split(": ");

        equations.push(new CalibrationEquation(+target, operands.split(" ").map((num) => +num)));
    }

    return equations;
}

export function totalCalibrationResult(equations: CalibrationEquation[], operators: Operator[]): number {
    let result = 0;

    for (const equation of equations) {
        if (equation.solvable(operators)) result += equation.target;
    }

    return result;
}

if (import.meta.main) {
    const equations = parseInput(await Deno.readTextFile("./days/inputs/07.txt"));

    console.log("Answer 1:", totalCalibrationResult(equations, Operator.Set1));
    console.log("Answer 2:", totalCalibrationResult(equations, Operator.Set2));
}
