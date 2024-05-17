import {
    Scramble as skewbScramble,
    SCRAMBLE_LENGTH as SKEWB_SCRAMBLE_LENGTH
} from "./skewbScrambler";

export const SCRAMBLE_LENGTH = SKEWB_SCRAMBLE_LENGTH;
const TIP_SCRAMBLE_MOVES = [
    ["", "u ", "u' "],
    ["", "b ", "b' "],
    ["", "r ", "r' "],
    ["", "l ", "l' "]
];

export const Scramble = () => {
    let scramble = skewbScramble();
    for (let i = 0; i < TIP_SCRAMBLE_MOVES.length; i++) {
        scramble += TIP_SCRAMBLE_MOVES[i][Math.floor(Math.random() * 3)];
    }
    return scramble;
}
