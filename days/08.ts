export type Map = string[];
export type Position = [number, number];
export type FrequencyMap = { [frequency: string]: Position[] }

export const EMPTY = ".";

export function parseInput(input: string): Map {
    return input.trim().split("\n").map((line) => line.trim());
}

export function getAntennaMap(map: Map): FrequencyMap {
    const antennaMap = {} as FrequencyMap;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const frequency = map[y][x];

            if (frequency === EMPTY) continue;

            frequency in antennaMap ? antennaMap[frequency].push([x, y]) : antennaMap[frequency] = [[x, y]];
        }
    }

    return antennaMap;
}

export function getAntinodeMap(map: Map, resonantHarmonics: boolean): FrequencyMap {
    const antinodeMap = {} as FrequencyMap;

    const antennaMap = getAntennaMap(map);

    for (const [frequency, positions] of Object.entries(antennaMap)) {
        for (const pos1 of positions) {
            for (const pos2 of positions) {
                if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) continue;

                if (resonantHarmonics) {
                    const run = pos2[0] - pos1[0];
                    const rise = pos2[1] - pos1[1];

                    let x = pos1[0] + run;
                    let y = pos1[1] + rise;

                    while(y >= 0 && y < map.length && x >= 0 && x < map[y].length) {
                        frequency in antinodeMap ? antinodeMap[frequency].push([x, y]) : antinodeMap[frequency] = [[x, y]];

                        x += run;
                        y += rise;
                    }
                }
                else {
                    const run = (pos2[0] - pos1[0]) * 2;
                    const rise = (pos2[1] - pos1[1]) * 2;
                    
                    const x = pos1[0] + run;
                    const y = pos1[1] + rise;
                    
                    if (y < 0 || y >= map.length || x < 0 || x >= map[y].length) continue;
                    
                    frequency in antinodeMap ? antinodeMap[frequency].push([x, y]) : antinodeMap[frequency] = [[x, y]];
                }
            }
        }
    }

    return antinodeMap;
}

export function countUniqueAntinodePositions(antinodeMap: FrequencyMap): number {
    return Object.values(antinodeMap).reduce(
        (set, positions) => {
            return set.union(new Set(positions.map(
                (pos) => pos.join(",")
            )));
        }, new Set()
    ).size;
}

if (import.meta.main) {
    const map = parseInput(await Deno.readTextFile("./days/inputs/08.txt"));

    console.log("Answer 1:", countUniqueAntinodePositions(getAntinodeMap(map, false)));
    console.log("Answer 2:", countUniqueAntinodePositions(getAntinodeMap(map, true)));
}
