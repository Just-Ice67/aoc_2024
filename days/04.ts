export function parseInput(input: string): string[] {
    return input.trim().split("\n").map((line) => line.trim());

}

export function findWord(wordSearch: string[], word: string): number {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]] as [number, number][];

    let found = 0;

    for (let y = 0; y < wordSearch.length; y++) {
        for (let x = 0; x < wordSearch[y].length; x++) {
            if (wordSearch[y][x] === word[0]) {
                for (const direction of directions) {
                    const maxX = x + (direction[0] * (word.length - 1));
                    const maxY = y + (direction[1] * (word.length - 1));

                    if (maxX < 0 || maxX >= wordSearch[y].length || maxY < 0 || maxY >= wordSearch.length) continue;

                    for (let i = 1; i < word.length; i++) {
                        if (wordSearch[y + (direction[1] * i)][x + (direction[0] * i)] !== word[i]) break;
                        if (i === word.length - 1) found++;
                    }
                }
            }
        }
    }

    return found;
}

export function findWordX(wordSearch: string[], word: string): number {
    function search(traversal: (i: number) => string): boolean {
        for (let i = 0; i < word.length; i++) {
            if (traversal(i) !== word[i]) return false;
        }

        return true;
    }

    if (word.length % 2 !== 1) return -1;

    const middle = Math.floor(word.length / 2);

    let found = 0;

    for (let y = 0; y < wordSearch.length; y++) {
        for (let x = 0; x < wordSearch[y].length; x++) {
            if (wordSearch[y][x] === word[middle]) {
                if (x - middle < 0 || x + middle >= wordSearch[y].length || y - middle < 0 || y + middle >= wordSearch.length) continue;

                // Calls the `search` function for both diagonals in each direction
                // This expression returns true if the word isn't found on both diagonals in either direction
                if (
                    // Calls the `search` function with the traversal function for tl->br and br->tl diagonals
                    (!search((i) => wordSearch[(y + i) - middle][(x + i) - middle]) && !search((i) => wordSearch[(y - i) + middle][(x - i) + middle])) ||
                    // Calls the `search` function with the traversal function for tr->bl and bl->tr diagonals
                    (!search((i) => wordSearch[(y + i) - middle][(x - i) + middle]) && !search((i) => wordSearch[(y - i) + middle][(x + i) - middle]))
                ) continue;

                found++;
            }
        }
    }

    return found;
}

if (import.meta.main) {
    const wordSearch = parseInput(await Deno.readTextFile("./days/inputs/04.txt"));

    console.log("Answer 1:", findWord(wordSearch, "XMAS"));
    console.log("Answer 2:", findWordX(wordSearch, "MAS"));
}
