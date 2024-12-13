import { assertEquals } from "@std/assert";
import { Position, ClawMachine, parseInput, fewestTokens } from "../13.ts";

Deno.test(function day13Test() {
    const input = `
        Button A: X+94, Y+34
        Button B: X+22, Y+67
        Prize: X=8400, Y=5400

        Button A: X+26, Y+66
        Button B: X+67, Y+21
        Prize: X=12748, Y=12176

        Button A: X+17, Y+86
        Button B: X+84, Y+37
        Prize: X=7870, Y=6450

        Button A: X+69, Y+23
        Button B: X+27, Y+71
        Prize: X=18641, Y=10279
    `;

    const machines = parseInput(input);

    assertEquals(machines, [
        new ClawMachine(new Position(8400, 5400), new Position(94, 34), new Position(22, 67)),
        new ClawMachine(new Position(12748, 12176), new Position(26, 66), new Position(67, 21)),
        new ClawMachine(new Position(7870, 6450), new Position(17, 86), new Position(84, 37)),
        new ClawMachine(new Position(18641, 10279), new Position(69, 23), new Position(27, 71)),
    ]);

    assertEquals(fewestTokens(machines), 480);
});
