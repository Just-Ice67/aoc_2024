export type Blocks = string[];

export function parseInput(input: string): Blocks {
    return input.trim().split("").flatMap(
        (char, i) => {
            if (i % 2 === 1) return ".".repeat(parseInt(char)).split("");
            else return `${i / 2} `.repeat(parseInt(char)).trim().split(" ");
        }
    );
}

export function sortBlocks(blocks: Blocks): Blocks {
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i] !== ".") {
            const empty = blocks.indexOf(".");

            if (empty === -1 || empty > i) continue;
            
            blocks[empty] = blocks[i];
            blocks[i] = ".";
        }
    }

    return blocks;
}

export function calculateChecksum(blocks: Blocks): number {
    return blocks.reduce(
        (acc, block, i) => {
            if (block === ".") return acc;
            else return acc += i * parseInt(block);
        }, 0
    );
}

export function moveBlocks(blocks: Blocks): Blocks {
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i] !== ".") {
            const blockEnd = i;

            while (i !== 0 && blocks[i - 1] === blocks[blockEnd]) i--;

            const blockLength = blockEnd - i + 1;
            
            let emptySearchStart = 0;
            let empty = -1;
            let emptyLength = 0;

            while (true) {
                empty = blocks.indexOf(".", emptySearchStart);
    
                if (empty === -1 || empty > i) break;
    
                emptyLength = 1;

                while (blocks[empty + emptyLength] === blocks[empty]) emptyLength++;

                if (emptyLength < blockLength) emptySearchStart = empty + emptyLength;
                else break;
            }

            if (empty === -1 || emptyLength < blockLength) continue;
            
            blocks.splice(empty, blockLength, ...blocks.slice(i, blockEnd + 1));
            blocks.splice(i, blockLength, ...".".repeat(blockLength).split(""));
        }
    }

    return blocks;
}

if (import.meta.main) {
    const blocks = parseInput(await Deno.readTextFile("./days/inputs/09.txt"));

    const fragmented = sortBlocks([...blocks]);

    console.log("Answer 1:", calculateChecksum(fragmented));

    moveBlocks(blocks);

    console.log("Answer 2:", calculateChecksum(blocks));
}
