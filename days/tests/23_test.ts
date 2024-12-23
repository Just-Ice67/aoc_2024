import { assertEquals } from "@std/assert";
import { ComputerNetwork, part1, part2 } from "../23.ts";

Deno.test(function day23Test() {
    const input = `
        kh-tc
        qp-kh
        de-cg
        ka-co
        yn-aq
        qp-ub
        cg-tb
        vc-aq
        tb-ka
        wh-tc
        yn-cg
        kh-ub
        ta-co
        de-co
        tc-td
        tb-wq
        wh-td
        ta-ka
        td-qp
        aq-cg
        wq-ub
        ub-vc
        de-ta
        wq-aq
        wq-vc
        wh-yn
        ka-de
        kh-ta
        co-tc
        wh-qp
        tb-vc
        td-yn
    `;

    const network = ComputerNetwork.fromInput(input);

    assertEquals(part1(network), 7);
    assertEquals(part2(network), "co,de,ka,ta");
});
