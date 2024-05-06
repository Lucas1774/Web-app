import Scramble from "./scramblers/provider";
import { TWO, THREE, BLD } from "./constants";
import { SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH } from "./scramblers/threeScrambler";
import { SCRAMBLE_LENGTH as TWO_SCRAMBLE_LENGTH } from "./scramblers/twoScrambler";
import { SCRAMBLE_LENGTH as BLD_SCRAMBLE_LENGTH } from "./scramblers/bldScrambler";

test("2x2", () => {
  for (let i = 0; i < 1000; i++) {
    const scramble = Scramble(TWO);
    console.log(scramble);
    const axisMoves = scramble.split(" ")
      .map(move => move[0])
      .join("");
    console.log(axisMoves);
    expect(axisMoves.length).toBe(TWO_SCRAMBLE_LENGTH);
    expect(axisMoves).not.toContain("UU");
    expect(axisMoves).not.toContain("FF");
    expect(axisMoves).not.toContain("RR");
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
    expect(axisMoves.length).toBe(THREE_SCRAMBLE_LENGTH);
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
  }
});

test("BLD", () => {
  for (let i = 0; i < 1000; i++) {
    const scramble = Scramble(BLD);
    console.log(scramble);
    const axisMoves = scramble.split(" ")
      .map(move => move[0])
      .join("");
    console.log(axisMoves);
    expect(axisMoves.length).toBe(BLD_SCRAMBLE_LENGTH);
    const nonWideAxisMoves = axisMoves.substring(0, axisMoves.length - 2);
    expect(nonWideAxisMoves).not.toContain("UU");
    expect(nonWideAxisMoves).not.toContain("DD");
    expect(nonWideAxisMoves).not.toContain("FF");
    expect(nonWideAxisMoves).not.toContain("BB");
    expect(nonWideAxisMoves).not.toContain("RR");
    expect(nonWideAxisMoves).not.toContain("LL");
    expect(nonWideAxisMoves).not.toContain("UDU");
    expect(nonWideAxisMoves).not.toContain("DUD");
    expect(nonWideAxisMoves).not.toContain("FBF");
    expect(nonWideAxisMoves).not.toContain("BFB");
    expect(nonWideAxisMoves).not.toContain("RLR");
    expect(nonWideAxisMoves).not.toContain("LRL");
    const secondAndThirdLastMoves = axisMoves.substring(axisMoves.length - 3, axisMoves.length - 1);
    expect(secondAndThirdLastMoves).not.toBe("UD");
    expect(secondAndThirdLastMoves).not.toBe("DU");
    expect(secondAndThirdLastMoves).not.toBe("FB");
    expect(secondAndThirdLastMoves).not.toBe("BF");
    expect(secondAndThirdLastMoves).not.toBe("RL");
    expect(secondAndThirdLastMoves).not.toBe("LR");
    const lastTwoMoves = axisMoves.substring(axisMoves.length - 2);
    expect(lastTwoMoves).not.toBe("UU");
    expect(lastTwoMoves).not.toBe("UD");
    expect(lastTwoMoves).not.toBe("DU");
    expect(lastTwoMoves).not.toBe("DD");
    expect(lastTwoMoves).not.toBe("FF");
    expect(lastTwoMoves).not.toBe("FB");
    expect(lastTwoMoves).not.toBe("BF");
    expect(lastTwoMoves).not.toBe("BB");
    expect(lastTwoMoves).not.toBe("RR");
    expect(lastTwoMoves).not.toBe("RL");
    expect(lastTwoMoves).not.toBe("LR");
    expect(lastTwoMoves).not.toBe("LL");
  }
});
