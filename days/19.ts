export enum Stripe {
    White = "w",
    Blue = "u",
    Black = "b",
    Red = "r",
    Green = "g",
}

export class Pattern {
    stripes: Stripe[];

    constructor(stripes: Stripe[]) {
        this.stripes = stripes;
    }
}

export class TowelArranger {
    availablePatterns: Pattern[];
    designs: Pattern[];

    constructor(availablePatterns: Pattern[], designs: Pattern[]) {
        this.availablePatterns = availablePatterns;
        this.designs = designs;

        this._waysPossibleCache = new Map();
    }

    static fromInput(input: string): TowelArranger {
        const [availablePatterns, designs] = input.trim().split("\n\n");

        return new TowelArranger(
            availablePatterns.trim().split(",").map((pattern) => new Pattern(pattern.trim().split("") as Stripe[])),
            designs.trim().split("\n").map((design) => new Pattern(design.trim().split("") as Stripe[])),
        );
    }

    waysPossible(design: Pattern): number {
        const cached = (design: Pattern, sum = 0): number => {
            const inner = (design: Pattern): number => {                
                if (design.stripes.length === 0) return 1;

                let sum = 0;

                outer: for (const pattern of this.availablePatterns) {
                    for (let i = 0; i < pattern.stripes.length; i++) {
                        if (i >= design.stripes.length || design.stripes[i] !== pattern.stripes[i]) {
                            continue outer;
                        }
                    }
                    
                    sum = cached(new Pattern(design.stripes.slice(pattern.stripes.length)), sum);
                }
                
                return sum;
            }
    
            const designString = design.stripes.join("");
            if (this._waysPossibleCache.has(designString)) return sum + this._waysPossibleCache.get(designString)!;
    
            const res = inner(design);
    
            this._waysPossibleCache.set(designString, res);
            return sum + res;
        }

        return cached(design);
    }

    possibleDesigns(designs?: Pattern[]): [Pattern, number][] {
        designs = designs === undefined ? this.designs : designs;

        const possible = [];

        for (const design of designs) {
            const waysDesignPossible = this.waysPossible(design);

            if (waysDesignPossible > 0) possible.push([design, waysDesignPossible] as [Pattern, number]);
        }

        return possible;
    }

    private _waysPossibleCache: Map<string, number>;
}

export function sumPossibleDesignsWaysPossible(designs: [Pattern, number][]): number {
    return designs.reduce((sum, [_, waysPossible]) => sum + waysPossible, 0);
}

if (import.meta.main) {
    const towelArranger = TowelArranger.fromInput(await Deno.readTextFile("./days/inputs/19.txt"));

    const possibleDesigns = towelArranger.possibleDesigns();

    console.log("Answer 1:", possibleDesigns.length);
    console.log("Answer 2:", sumPossibleDesignsWaysPossible(possibleDesigns));
}
