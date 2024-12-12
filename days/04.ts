export class WordSearch {
    wordSearch: string[];

    constructor(wordSearch: string) {
        this.wordSearch = wordSearch.trim().split("\n").map((line) => line.trim());
    }

    findWord(word: string): number {
        const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]] as [number, number][];

        let found = 0;
    
        for (let y = 0; y < this.wordSearch.length; y++) {
            for (let x = 0; x < this.wordSearch[y].length; x++) {
                if (this.wordSearch[y][x] !== word[0]) continue;
    
                for (const direction of DIRECTIONS) {
                    const maxX = x + (direction[0] * (word.length - 1));
                    const maxY = y + (direction[1] * (word.length - 1));
    
                    if (maxX < 0 || maxX >= this.wordSearch[y].length || maxY < 0 || maxY >= this.wordSearch.length) continue;
    
                    for (let i = 1; i < word.length; i++) {
                        const currX = x + (direction[0] * i);
                        const currY = y + (direction[1] * i);
    
                        if (this.wordSearch[currY][currX] !== word[i]) break;
                        if (i === word.length - 1) found++;
                    }
                }
            }
        }
    
        return found;
    }

    findWordX(word: string): number {
        function search(traversal: (i: number) => string): boolean {
            for (let i = 0; i < word.length; i++) {
                if (traversal(i) !== word[i]) return false;
            }
    
            return true;
        }
    
        if (word.length % 2 !== 1) return -1;
    
        const middle = Math.floor(word.length / 2);
    
        let found = 0;
    
        for (let y = 0; y < this.wordSearch.length; y++) {
            for (let x = 0; x < this.wordSearch[y].length; x++) {
                if (this.wordSearch[y][x] !== word[middle]) continue;
                if (x - middle < 0 || x + middle >= this.wordSearch[y].length || y - middle < 0 || y + middle >= this.wordSearch.length) continue;

                // Calls the `search` function for both diagonals in each direction
                // This expression returns true if the word isn't found on both diagonals in either direction
                if (
                    // Calls the `search` function with the traversal function for tl->br and br->tl diagonals
                    (!search((i) => this.wordSearch[(y + i) - middle][(x + i) - middle]) && !search((i) => this.wordSearch[(y - i) + middle][(x - i) + middle])) ||
                    // Calls the `search` function with the traversal function for tr->bl and bl->tr diagonals
                    (!search((i) => this.wordSearch[(y + i) - middle][(x - i) + middle]) && !search((i) => this.wordSearch[(y - i) + middle][(x + i) - middle]))
                ) continue;

                found++;
            }
        }
    
        return found;
    }
}

if (import.meta.main) {
    const wordSearch = new WordSearch(await Deno.readTextFile("./days/inputs/04.txt"));

    console.log("Answer 1:", wordSearch.findWord("XMAS"));
    console.log("Answer 2:", wordSearch.findWordX("MAS"));
}
