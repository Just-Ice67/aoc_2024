import { assertEquals } from "@std/assert";
import { Operator, CalibrationEquation, parseInput, totalCalibrationResult } from "../07.ts";

Deno.test(function day07Test() {
    const input = `
        190: 10 19
        3267: 81 40 27
        83: 17 5
        156: 15 6
        7290: 6 8 6 15
        161011: 16 10 13
        192: 17 8 14
        21037: 9 7 18 13
        292: 11 6 16 20
    `;

    const equations = parseInput(input);

    assertEquals(equations, [
        new CalibrationEquation(190, [10, 19]),
        new CalibrationEquation(3267, [81, 40, 27]),
        new CalibrationEquation(83, [17, 5]),
        new CalibrationEquation(156, [15, 6]),
        new CalibrationEquation(7290, [6, 8, 6, 15]),
        new CalibrationEquation(161011, [16, 10, 13]),
        new CalibrationEquation(192, [17, 8, 14]),
        new CalibrationEquation(21037, [9, 7, 18, 13]),
        new CalibrationEquation(292, [11, 6, 16, 20]),
    ]);

    assertEquals(totalCalibrationResult(equations, Operator.Set1), 3749);
    assertEquals(totalCalibrationResult(equations, Operator.Set2), 11387);
});
