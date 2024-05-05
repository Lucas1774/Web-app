const SCRAMBLE_LENGTH = 20;
const SCRAMBLE_MOVES = [
    ["U ", "U2 ", "U' "],
    ["D ", "D2 ", "D' "],
    ["F ", "F2 ", "F' "],
    ["B ", "B2 ", "B' "],
    ["R ", "R2 ", "R' "],
    ["L ", "L2 ", "L' "],
];

export const Scramble = () => {
    let scramble = "";
    let lastMoveIndex = -1;
    let secondToLastMoveIndex = -1;
    let turnLayer, turnIterator;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        if (0 === i) {
            turnLayer = Math.floor(Math.random() * 6);
        }
        else if (1 === i || lastMoveIndex / 2 !== secondToLastMoveIndex / 2) {
            turnLayer = Math.floor(Math.random() * 5);
            if (turnLayer === lastMoveIndex) {
                turnLayer++;
            }
        }
        else {
            turnLayer = Math.floor(Math.random() * 4);
            if (turnLayer === secondToLastMoveIndex) {
                turnLayer += 2;
            }
            else if (turnLayer === lastMoveIndex) {
                turnLayer++;
            }
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += SCRAMBLE_MOVES[turnLayer][turnIterator];
        secondToLastMoveIndex = lastMoveIndex;
        lastMoveIndex = turnLayer;
    }
    return scramble;
}
