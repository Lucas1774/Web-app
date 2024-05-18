export const SCRAMBLE_LENGTH = 11;
const SCRAMBLE_MOVES = [
    ["U ", "U' "],
    ["B ", "B' "],
    ["R ", "R' "],
    ["L ", "L' "]
];

export const Scramble = () => {
    let scramble = "";
    let lastMoveIndex = -1;
    let turnLayer, turnIterator;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        if (0 === i) {
            turnLayer = Math.floor(Math.random() * 4);
        }
        else {
            turnLayer = Math.floor(Math.random() * 3);
            if (turnLayer === lastMoveIndex) {
                turnLayer++;
            }
        }
        turnIterator = Math.floor(Math.random() * 2);
        scramble += SCRAMBLE_MOVES[turnLayer][turnIterator];
        lastMoveIndex = turnLayer;
    }
    return scramble;
};
