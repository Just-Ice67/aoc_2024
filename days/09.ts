export class DiskBlocks {
    static readonly EMPTY = ".";

    blocks: string[];

    constructor(blocks: string[]) {
        this.blocks = blocks;
    }

    static fromInput(input: string): DiskBlocks {
        return new DiskBlocks(input.trim().split("").flatMap(
            (blockSize, i) => {
                if (i % 2 === 0) {
                    return Array(+blockSize).fill(`${i / 2}`);
                } else {
                    return Array(+blockSize).fill(DiskBlocks.EMPTY);
                }
            }
        ));
    }

    clone(): DiskBlocks {
        return new DiskBlocks([...this.blocks]);
    }

    sort(): DiskBlocks {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            if (this.blocks[i] === DiskBlocks.EMPTY) continue;
            
            const nextEmpty = this.blocks.indexOf(DiskBlocks.EMPTY);

            if (nextEmpty === -1 || nextEmpty > i) continue;
            
            this.blocks[nextEmpty] = this.blocks[i];
            this.blocks[i] = DiskBlocks.EMPTY;
        }

        return this;
    }

    move(): DiskBlocks {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            if (this.blocks[i] === DiskBlocks.EMPTY) continue;

            const blockEnd = i;

            while (i !== 0 && this.blocks[i - 1] === this.blocks[blockEnd]) i--;

            const blockLength = blockEnd - i + 1;
            
            let emptySearchStart = 0;
            let empty = -1;
            let emptyLength = 0;

            while (true) {
                empty = this.blocks.indexOf(DiskBlocks.EMPTY, emptySearchStart);
    
                if (empty === -1 || empty > i) break;
    
                emptyLength = 1;

                while (this.blocks[empty + emptyLength] === DiskBlocks.EMPTY) emptyLength++;

                if (emptyLength < blockLength) emptySearchStart = empty + emptyLength;
                else break;
            }

            if (empty === -1 || emptyLength < blockLength) continue;
            
            this.blocks.splice(empty, blockLength, ...this.blocks.slice(i, blockEnd + 1));
            this.blocks.splice(i, blockLength, ...Array(blockLength).fill(DiskBlocks.EMPTY));
        }

        return this;
    }

    checksum(): number {
        return this.blocks.reduce(
            (checksum, block, i) => {
                if (block === ".") return checksum;
                else return checksum += i * +block;
            }, 0
        );
    }
}

if (import.meta.main) {
    const blocks = DiskBlocks.fromInput(await Deno.readTextFile("./days/inputs/09.txt"));

    const fragmented = blocks.clone().sort();

    console.log("Answer 1:", fragmented.checksum());

    blocks.move();

    console.log("Answer 2:", blocks.checksum());
}
