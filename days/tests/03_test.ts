import { assertEquals } from "@std/assert";
import { evalInput1, evalInput2 } from "../03.ts";

Deno.test(function day03Test() {
    const input1 = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

    assertEquals(evalInput1(input1), 161);

    const input2 = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

    assertEquals(evalInput2(input2), 48);
});