export enum Gate {
    And,
    Or,
    Xor,
}

export enum InputType {
    Literal,
    Gate,
}

export class Input {
    inputType: InputType;
    value: bigint | [string, Gate, string];

    constructor(inputType: InputType.Literal, value: bigint)
    constructor(inputType: InputType.Gate, value: [string, Gate, string])
    constructor(inputType: InputType, value: bigint | [string, Gate, string]) {
        if (inputType === InputType.Literal && typeof value !== "bigint") throw new Error("Invalid input");

        this.inputType = inputType;
        this.value = value;
    }

    equals(other: Input): boolean {
        if (this.inputType !== other.inputType) return false;

        if (this.inputType === InputType.Literal) return this.value === other.value;

        const [leftOperand, gate, rightOperand] = this.value as [string, Gate, string];
        const [otherLeftOperand, otherGate, otherRightOperand] = other.value as [string, Gate, string];

        return (
            (
                (leftOperand === otherLeftOperand && rightOperand === otherRightOperand ) ||
                (leftOperand === otherRightOperand && rightOperand === otherLeftOperand)
            ) && gate === otherGate
        );
    }
}

export class FruitMonitor {
    wires: Map<string, Input>;

    constructor(wires: Map<string, Input>) {
        this.wires = wires;
    }

    static fromInput(input: string): FruitMonitor {
        const wires = new Map();
        const lines = input.trim().split("\n\n").join("\n").split("\n").map((line) => line.trim());
        
        for (const line of lines) {
            if (line.includes(":")) {
                const [wire, value] = line.split(": ");

                wires.set(wire, new Input(InputType.Literal, BigInt(value)));
            } else {
                const [inputStr, wire] = line.split(" -> ");
                const [leftOperand, gateStr, rightOperand] = inputStr.split(" ");

                let gate = Gate.Or;
                switch (gateStr) {
                    case "AND": gate = Gate.And; break;
                    case "OR": gate = Gate.Or; break;
                    case "XOR": gate = Gate.Xor; break;
                }

                wires.set(wire, new Input(InputType.Gate, [leftOperand, gate, rightOperand]));
            }
        }

        return new FruitMonitor(wires);
    }

    getValue(wirePrefix: string): bigint {
        let value = 0n;

        for (const wire of this.wires.keys().filter((wire) => wire.startsWith(wirePrefix))) {
            value += this.evaluate(wire) << BigInt(wire.slice(1));
        }

        return value;
    }

    xValue(): bigint {
        return this.getValue("x");
    }

    yValue(): bigint {
        return this.getValue("y");
    }

    zValue(): bigint {
        return this.getValue("z");
    }

    evaluate(wire: string): bigint {
        const input = this.wires.get(wire);

        if (input === undefined) return -1n;

        if (input.inputType === InputType.Literal) return input.value as bigint;

        const [leftOperand, gate, rightOperand] = input.value as [string, Gate, string];

        const leftValue = this.evaluate(leftOperand);
        const rightValue = this.evaluate(rightOperand);

        switch (gate) {
            case Gate.And: return leftValue & rightValue;
            case Gate.Or: return leftValue | rightValue;
            case Gate.Xor: return leftValue ^ rightValue;
        }
    }

    findInput(input: Input): string | null {
        for (const [wire, wireInput] of this.wires.entries()) {
            if (wireInput.equals(input)) return wire;
        }

        return null;
    }

    swap(wire1: string, wire2: string) {
        const input1 = this.wires.get(wire1);
        const input2 = this.wires.get(wire2);

        if (input1 === undefined || input2 === undefined) return;

        this.wires.set(wire1, input2);
        this.wires.set(wire2, input1);
    }

    fix(): string {
        const numBits = Math.max(
            this.wires.keys().filter((wire) => wire.startsWith("x")).toArray().length,
            this.wires.keys().filter((wire) => wire.startsWith("y")).toArray().length,
        );

        const swaps = [];
        let carry = null;

        for (let bit = 0; bit < numBits; bit++) {
            const xWire = "x" + bit.toString().padStart(2, "0");
            const yWire = "y" + bit.toString().padStart(2, "0");

            // These are the two base inputs for a half or full adder and should always be present
            let halfAdderSum = this.findInput(new Input(InputType.Gate, [xWire, Gate.Xor, yWire]))!;
            let halfAdderCarry = this.findInput(new Input(InputType.Gate, [xWire, Gate.And, yWire]))!;

            if (carry === null) { // The first bit
                carry = halfAdderCarry;
                continue;
            }

            let fullAdderCarry = this.findInput(new Input(InputType.Gate, [halfAdderSum, Gate.And, carry]));
            
            // We know that `carry` is always valid, so if `fullAdderCarry` is null, we know that `halfAdderSum` and `halfAdderCarry` need to be swapped
            if (fullAdderCarry === null) {
                this.swap(halfAdderSum, halfAdderCarry);

                [halfAdderSum, halfAdderCarry] = [halfAdderCarry, halfAdderSum];

                swaps.push(halfAdderSum, halfAdderCarry);

                fullAdderCarry = this.findInput(new Input(InputType.Gate, [halfAdderSum, Gate.And, carry]))!;
            }

            // At this point we know that `carry` and `halfAdderSum` are valid, so `fullAdderSum` is also valid
            let fullAdderSum: string = this.findInput(new Input(InputType.Gate, [halfAdderSum, Gate.Xor, carry]))!;

            if (halfAdderCarry.startsWith("z")) { // Check if `halfAdderCarry` is invalid
                this.swap(halfAdderCarry, fullAdderSum);

                [halfAdderCarry, fullAdderSum] = [fullAdderSum, halfAdderCarry];

                swaps.push(halfAdderCarry, fullAdderSum);
            } else if (fullAdderCarry.startsWith("z")) { // Check if `fullAdderCarry` is invalid
                this.swap(fullAdderCarry, fullAdderSum);

                [fullAdderCarry, fullAdderSum] = [fullAdderSum, fullAdderCarry];

                swaps.push(fullAdderCarry, fullAdderSum);
            }

            // `halfAdderCarry` and `fullAdderCarry` are now valid, so the new `carry` can be found
            carry = this.findInput(new Input(InputType.Gate, [halfAdderCarry, Gate.Or, fullAdderCarry]))!;

            if (bit !== numBits - 1 && carry.startsWith("z")) { // Check if `carry` is invalid (the invalid state is valid for the last bit)
                this.swap(carry, fullAdderSum);

                [carry, fullAdderSum] = [fullAdderSum, carry];

                swaps.push(carry, fullAdderSum);
            }
        }

        return swaps.sort((a, b) => a.localeCompare(b)).join(",");
    }
}

if (import.meta.main) {
    const monitor = FruitMonitor.fromInput(await Deno.readTextFile("./days/inputs/24.txt"));

    console.log("Answer 1:", monitor.zValue());
    console.log("Answer 2:", monitor.fix());
}
