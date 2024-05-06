export const SCRAMBLE_LENGTH = 20;
const SCRAMBLE_MOVES = [
    ["U ", "U2 ", "U' "],
    ["D ", "D2 ", "D' "],
    ["F ", "F2 ", "F' "],
    ["B ", "B2 ", "B' "],
    ["R ", "R2 ", "R' "],
    ["L ", "L2 ", "L' "],
];
const LAST_TWO = [
    ["Dw ", "Dw2 ", "Dw' "],
    ["Uw ", "Uw2 ", "Uw' "],
    ["Bw ", "Bw2 ", "Bw' "],
    ["Fw ", "Fw2 ", "Fw' "],
    ["Lw ", "Lw2 ", "Lw' "],
    ["Rw ", "Rw2 ", "Rw' "],
];

export const Scramble = () => {
    let scramble = "";
    let lastMoveIndex = -2;
    let secondToLastMoveIndex = -2;
    let turnLayer, turnIterator;
    for (let i = 0; i < SCRAMBLE_LENGTH - 2; i++) {
        if (0 === i) {
            turnLayer = Math.floor(Math.random() * 6);
        }
        else if (parseInt(lastMoveIndex / 2) !== parseInt(secondToLastMoveIndex / 2)) {
            turnLayer = Math.floor(Math.random() * 5);
            if (turnLayer === lastMoveIndex) {
                turnLayer++;
            }
        }
        else {
            turnLayer = Math.floor(Math.random() * 4);
            if (turnLayer === lastMoveIndex || turnLayer === secondToLastMoveIndex) {
                if (turnLayer % 2 === 0) {
                    turnLayer += 2;
                } else {
                    turnLayer++;
                }
            }
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += SCRAMBLE_MOVES[turnLayer][turnIterator];
        secondToLastMoveIndex = lastMoveIndex;
        lastMoveIndex = turnLayer;
    }
    turnLayer = Math.floor(Math.random() * 5);
    if (turnLayer === lastMoveIndex) {
        turnLayer++;
    }
    turnIterator = Math.floor(Math.random() * 3);
    scramble += LAST_TWO[turnLayer][turnIterator];
    lastMoveIndex = turnLayer;
    turnLayer = Math.floor(Math.random() * 4);
    if (parseInt(lastMoveIndex / 2) === parseInt(turnLayer / 2)) {
        if (turnLayer % 2 === 0) {
            turnLayer += 2;
        } else {
            turnLayer++;
        }
    }
    turnIterator = Math.floor(Math.random() * 3);
    scramble += LAST_TWO[turnLayer][turnIterator];
    return scramble;
}
