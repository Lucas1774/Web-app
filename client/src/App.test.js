import Scramble from "./scramblers/provider";
import { TWO, THREE } from "./constants";
import {SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH} from "./scramblers/threeScrambler";
import {SCRAMBLE_LENGTH as TWO_SCRAMBLE_LENGTH} from "./scramblers/twoScrambler";

test("2x2", () => {
  for (let i = 0; i < 1000; i++) {
    const scramble = Scramble(TWO);
    console.log(scramble);
    const axisMoves = scramble.split(" ")
      .map(move => move[0])
      .join("");
    console.log(axisMoves);
    expect(axisMoves).not.toContain("UU");
    expect(axisMoves).not.toContain("FF");
    expect(axisMoves).not.toContain("RR");
    expect(axisMoves.length).toBe(TWO_SCRAMBLE_LENGTH);
  }
});

test("3x3", () => {
  for (let i = 0; i < 1000; i++) {
    const scramble = Scramble(THREE);
    console.log(scramble);
    const axisMoves = scramble.split(" ")
      .map(move => move[0])
      .join("");
    console.log(axisMoves);
    expect(axisMoves).not.toContain("UU");
    expect(axisMoves).not.toContain("DD");
    expect(axisMoves).not.toContain("FF");
    expect(axisMoves).not.toContain("BB");
    expect(axisMoves).not.toContain("RR");
    expect(axisMoves).not.toContain("LL");
    expect(axisMoves).not.toContain("UDU");
    expect(axisMoves).not.toContain("DUD");
    expect(axisMoves).not.toContain("FBF");
    expect(axisMoves).not.toContain("BFB");
    expect(axisMoves).not.toContain("RLR");
    expect(axisMoves).not.toContain("LRL");
    expect(axisMoves.length).toBe(THREE_SCRAMBLE_LENGTH);
  }
});
