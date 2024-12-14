export function mod(n: number, d: number): number {
    return ((n % d) + d) % d;
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    wrappingAdd(other: Position, width: number, height: number): Position {
        return new Position(mod(this.x + other.x, width), mod(this.y + other.y, height));
    }
}

export enum Quadrant {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
    None,
}

export class Robot {
    position: Position;
    velocity: Position;

    roomWidth: number;
    roomHeight: number;

    constructor(position: Position, velocity: Position, roomWidth: number, roomHeight: number) {
        this._startPosition = position;
        this.position = position;

        this.velocity = velocity;

        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
    }

    reset() {
        this.position = this._startPosition;
    }

    step(n: number) {
        for (let i = 0; i < n; i++) {
            this.position = this.position.wrappingAdd(this.velocity, this.roomWidth, this.roomHeight);
        }
    }

    quadrant(): Quadrant {
        const halfWidth = Math.round(this.roomWidth / 2) - 1;
        const halfHeight = Math.round(this.roomHeight / 2) - 1;

        if (this.position.x < halfWidth && this.position.y < halfHeight) return Quadrant.TopLeft;
        else if (this.position.x > halfWidth && this.position.y < halfHeight) return Quadrant.TopRight;
        else if (this.position.x < halfWidth && this.position.y > halfHeight) return Quadrant.BottomLeft;
        else if (this.position.x > halfWidth && this.position.y > halfHeight) return Quadrant.BottomRight;

        return Quadrant.None;
    }

    private _startPosition: Position;
}

export class BathroomSecurity {
    constructor(roomWidth: number, roomHeight: number, robots?: Robot[]) {
        this._robots = robots === undefined ? [] : robots;

        this._roomWidth = roomWidth;
        this._roomHeight = roomHeight;
        
        for (const robot of this._robots) {
            robot.roomWidth = this._roomWidth;
            robot.roomHeight = this._roomHeight;

            robot.reset();
        }
    }

    static fromInput(input: string, roomWidth: number, roomHeight: number): BathroomSecurity {
        const bathroomSecurity = new BathroomSecurity(roomWidth, roomHeight);

        for (const robotInfo of input.trim().split("\n")) {
            const [position, velocity] = robotInfo.trim().split(" ");

            const [posX, posY] = position.replace("p=", "").split(",").map((num) => +num) as [number, number];
            const [velX, velY] = velocity.replace("v=", "").split(",").map((num) => +num) as [number, number];

            bathroomSecurity.addRobot(new Position(posX, posY), new Position(velX, velY));
        }

        return bathroomSecurity;
    }

    addRobot(position: Position, velocity: Position) {
        this._robots.push(new Robot(position, velocity, this._roomWidth, this._roomHeight));
    }

    reset() {
        for (const robot of this._robots) {
            robot.reset();
        }
    }

    step(n: number) {
        for (const robot of this._robots) {
            robot.step(n);
        }
    }

    safetyFactor(): number {
        let tlQuadrant = 0;
        let trQuadrant = 0;
        let blQuadrant = 0;
        let brQuadrant = 0;

        for (const robot of this._robots) {
            switch (robot.quadrant()) {
                case Quadrant.TopLeft: tlQuadrant++; break;
                case Quadrant.TopRight: trQuadrant++; break;
                case Quadrant.BottomLeft: blQuadrant++; break;
                case Quadrant.BottomRight: brQuadrant++; break;
            }
        }

        return tlQuadrant * trQuadrant * blQuadrant * brQuadrant;
    }

    toString(): string {
        const map = Array(this._roomHeight).fill("").map(() => Array(this._roomWidth).fill("."));

        for (const robot of this._robots) {
            map[robot.position.y][robot.position.x] = "#";
        }

        return map.map((row) => row.join("")).join("\n");
    }

    private _robots: Robot[];

    private _roomWidth: number;
    private _roomHeight: number;
}

if (import.meta.main) {
    const bathroomSecurity = BathroomSecurity.fromInput(await Deno.readTextFile("./days/inputs/14.txt"), 101, 103);

    bathroomSecurity.step(100);

    console.log("Answer 1:", bathroomSecurity.safetyFactor());
    
    bathroomSecurity.reset();

    const output = "./days/outputs/14.txt";

    try {
        await Deno.remove(output);
    } catch (e) {
        if (!(e instanceof Deno.errors.NotFound)) throw e;
    }

    const outFile = await Deno.create(output);
    const textEncoder = new TextEncoder();

    for (let i = 1; i <= 10000; i++) {
        bathroomSecurity.step(1);

        await outFile.write(textEncoder.encode(`Step: ${i}\n`));
        await outFile.write(textEncoder.encode(bathroomSecurity.toString()));
        await outFile.write(textEncoder.encode("\n\n"));
    }

    await outFile.close();

    console.log(`Find the tree in the file ${output} for answer 2.`);
}
