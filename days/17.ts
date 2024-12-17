export type ThreeBit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export enum OperandType {
    Literal,
    Combo,
    Ignored,
}

export enum ComboOperand {
    Zero,
    One,
    Two,
    Three,
    RegA,
    RegB,
    RegC,
    Invalid,
}

export class Instruction {
    static readonly adv = new Instruction(0);
    static readonly bxl = new Instruction(1);
    static readonly bst = new Instruction(2);
    static readonly jnz = new Instruction(3);
    static readonly bxc = new Instruction(4);
    static readonly out = new Instruction(5);
    static readonly bdv = new Instruction(6);
    static readonly cdv = new Instruction(7);

    readonly opcode: ThreeBit
    
    constructor(opcode: ThreeBit) {
        this.opcode = opcode;
    }

    [Symbol.toPrimitive](hint: "number" | "string" | "default"): number | string | undefined {
        switch (hint) {
            case "number": return this.opcode;
            case "default":
            case "string": return this.opcode.toString();
        }
    }

    operandType(): OperandType {
        switch (this.opcode) {
            case 0: return OperandType.Combo;
            case 1: return OperandType.Literal;
            case 2: return OperandType.Combo;
            case 3: return OperandType.Literal;
            case 4: return OperandType.Ignored;
            case 5: return OperandType.Combo;
            case 6: return OperandType.Combo;
            case 7: return OperandType.Combo;
        }
    }
}

export class Program {
    regA: number;
    regB: number;
    regC: number;
    memory: ThreeBit[];

    constructor(regA: number, regB: number, regC: number, memory: ThreeBit[]) {
        this.regA = regA;
        this.regB = regB;
        this.regC = regC;
        this.memory = memory;
    }

    static fromInput(input: string): Program {
        const [registersString, memoryString] = input.trim().split("\n\n");

        const [regA, regB, regC] = registersString.trim().split("\n").map((reg) => +reg.split(":")[1].trim());
        const memory = memoryString.split(":")[1].trim().split(",").map((num) => +num as ThreeBit);

        return new Program(regA, regB, regC, memory);
    }
}

export class ChronospatialComputer {
    regA: number;
    regB: number;
    regC: number;
    
    constructor() {
        this.regA = 0;
        this.regB = 0;
        this.regC = 0;

        this._programCounter = 0;
        this._output = [];
    }

    reset(regA: number, regB: number, regC: number) {
        this.regA = regA;
        this.regB = regB;
        this.regC = regC;

        this._programCounter = 0;
        this._output = [];
    }

    get programCounter(): number { return this._programCounter; }
    get output(): ReadonlyArray<ThreeBit> { return this._output; }

    runProgram(program: Program, stopCondition: (computer: ChronospatialComputer) => boolean = () => false): ReadonlyArray<ThreeBit> {
        this.reset(program.regA, program.regB, program.regC);

        while (this._programCounter < program.memory.length) {
            const instruction = new Instruction(program.memory[this._programCounter]);
            const rawOperand = program.memory[this._programCounter + 1];

            this.evalInstruction(instruction, rawOperand);

            if (stopCondition(this)) break;
        }

        return this.output;
    }

    evalComboOperand(operand: ComboOperand): number {
        switch (operand) {
            case ComboOperand.Zero: return 0;
            case ComboOperand.One: return 1;
            case ComboOperand.Two: return 2;
            case ComboOperand.Three: return 3;
            case ComboOperand.RegA: return this.regA;
            case ComboOperand.RegB: return this.regB;
            case ComboOperand.RegC: return this.regC;
            case ComboOperand.Invalid: return NaN;
        }
    }

    evalInstruction(instruction: Instruction, rawOperand: number): number {
        this._programCounter += 2;

        let operand;
        switch (instruction.operandType()) {
            case OperandType.Literal: operand = rawOperand; break;
            case OperandType.Combo: operand = this.evalComboOperand(rawOperand); break;
            case OperandType.Ignored: operand = NaN; break;
        }

        switch (instruction.opcode) {
            case Instruction.adv.opcode: {
                return this.regA = this._dv(operand);
            }
            case Instruction.bxl.opcode: {
                return this.regB ^= operand;
            }
            case Instruction.bst.opcode: {
                return this.regB = this._modulo(operand, 8);
            }
            case Instruction.jnz.opcode: {
                if (this.regA === 0) return this._programCounter;

                return this._programCounter = operand;
            }
            case Instruction.bxc.opcode: {
                return this.regB ^= this.regC;
            }
            case Instruction.out.opcode: {
                const res = this._modulo(operand, 8) as ThreeBit;

                this._output.push(res);
                return res;
            }
            case Instruction.bdv.opcode: {
                return this.regB = this._dv(operand);
            }
            case Instruction.cdv.opcode: {
                return this.regC = this._dv(operand);
            }
            default:
                return NaN;
        }
    }

    private _programCounter: number;
    private _output: ThreeBit[];

    private _dv(operand: number): number {
        return Math.trunc(this.regA / (2 ** operand));
    }

    private _modulo(n: number, d: number): number {
        return ((n % d) + d) % d;
    }
}

export function part2Solver(computer: ChronospatialComputer, program: Program): number | null {
    const search = program.memory.toReversed();

    function inner(target: number, searchIndex: number): number | null {
        if (searchIndex === search.length) return target;

        const rangeStart = Number(BigInt(target) << 3n);
        const rangeEnd = rangeStart + 8;

        for (let maybeNextTarget = rangeStart; maybeNextTarget < rangeEnd; maybeNextTarget++) {
            if (maybeNextTarget === 0) continue;

            computer.reset(maybeNextTarget, program.regB, program.regC);

            while (computer.programCounter < program.memory.length) {
                const instruction = new Instruction(program.memory[computer.programCounter]);
                if (instruction.opcode === Instruction.jnz.opcode) break;

                computer.evalInstruction(instruction, program.memory[computer.programCounter + 1]);
            }

            if (computer.output[0] === search[searchIndex]) {
                const res = inner(maybeNextTarget, searchIndex + 1);
                if (res !== null) return res;
            }
        }

        return null;
    }

    return inner(0, 0)
}

if (import.meta.main) {
    const computer = new ChronospatialComputer();

    const program = Program.fromInput(await Deno.readTextFile("./days/inputs/17.txt"));

    console.log("Answer 1:", computer.runProgram(program).join(","));
    console.log("Answer 2:", part2Solver(computer, program));
}
