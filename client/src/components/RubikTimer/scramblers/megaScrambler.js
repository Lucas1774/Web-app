export const SCRAMBLE_LENGTH = 77;
const SCRAMBLE_MOVES = [
    ["R++ ", "R-- "],
    ["D++ ", "D-- "],
];
const ELEVENTH = ["U \n", "U' \n"];

export const Scramble = () => {
    let scramble = "";
    let turn = 0;
    let turnIterator;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        turnIterator = Math.floor(Math.random() * 2);
        if (0 !== (i + 1) % 11) {
            scramble += SCRAMBLE_MOVES[turn][turnIterator];
            turn = (turn + 1) % 2;
        } else {
            scramble += ELEVENTH[turnIterator];
        }
    }
    return scramble;
};
