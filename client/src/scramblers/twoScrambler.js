const SCRAMBLE_LENGTH = 10;
const SCRAMBLE_MOVES = [
    ["U ", "U2 ", "U' "],
    ["F ", "F2 ", "F' "],
    ["R ", "R2 ", "R' "],
];

export const Scramble = () => {
    let scramble = "";
    let lastMoveIndex = -1;
    let turnLayer, turnIterator;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        if (0 === i) {
            turnLayer = Math.floor(Math.random() * 3);
        }
        else {
            turnLayer = Math.floor(Math.random() * 2);
            if (turnLayer === lastMoveIndex) {
                turnLayer++;
            }
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += SCRAMBLE_MOVES[turnLayer][turnIterator];
        lastMoveIndex = turnLayer;
    }
    return scramble;
}
