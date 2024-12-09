import { BaseN } from "js-combinatorics";

export type Operator = "+" | "*" | "||";
export type Operators = Operator[];
export type CalibrationEquation = [number, number[]];
export type CalibrationEquations = CalibrationEquation[];

export const Ops1 = ["+", "*"] as Operators;
export const Ops2 = Ops1.concat("||") as Operators;

export function parseInput(input: string): CalibrationEquations {
    const equations = [] as CalibrationEquations;

    for (const line of input.trim().split("\n")) {
        const [target, values] = line.trim().split(": ");

        equations.push([parseInt(target), values.split(" ").map((num) => parseInt(num))]);
    }

    return equations;
}

export function handleOperation(a: number, b: number, op: Operator): number {
    switch (op) {
        case "+":
            return a + b;
        case "*":
            return a * b;
        case "||":
            return parseInt(`${a}${b}`);
    }
}

export function canSolve(equation: CalibrationEquation, operators: Operators): boolean {
    const [target, values] = equation;

    const operatorPermutations = new BaseN(operators, values.length - 1);

    for (const operatorSet of operatorPermutations) {
        let total = handleOperation(values[0], values[1], operatorSet[0]);

        for (let i = 2; i < values.length; i++) {
            total = handleOperation(total, values[i], operatorSet[i - 1]);
        }

        if (total === target) return true;
    }

    return false;
}

export function totalCalibrationResult(equations: CalibrationEquations, operators: Operators): number {
    let result = 0;

    for (const equation of equations) {
        if (canSolve(equation, operators)) result += equation[0];
    }

    return result;
}

if (import.meta.main) {
    const equations = parseInput(await Deno.readTextFile("./days/inputs/07.txt"));

    console.log("Answer 1:", totalCalibrationResult(equations, Ops1));
    console.log("Answer 2:", totalCalibrationResult(equations, Ops2));
}
