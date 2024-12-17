import { assertEquals } from "@std/assert";
import { Program, ChronospatialComputer, part2Solver } from "../17.ts";

Deno.test(function day17Test() {
    const computer = new ChronospatialComputer();

    const input1 = `
        Register A: 729
        Register B: 0
        Register C: 0

        Program: 0,1,5,4,3,0
    `;

    const program1 = Program.fromInput(input1);

    assertEquals(program1, new Program(
        729,
        0,
        0,

        [0, 1, 5, 4, 3, 0],
    ));


    computer.runProgram(program1);

    assertEquals(computer.output.join(","), "4,6,3,5,6,3,5,2,1,0");

    const input2 = `
        Register A: 2024
        Register B: 0
        Register C: 0

        Program: 0,3,5,4,3,0
    `;

    const program2 = Program.fromInput(input2);

    assertEquals(part2Solver(computer, program2), 117440);
});
