import {
    Scramble as ThreeScramble,
    SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH
} from './threeScrambler.js';

const LAST_TWO = [
    ["Dw ", "Dw2 ", "Dw' "],
    ["Uw ", "Uw2 ", "Uw' "],
    ["Bw ", "Bw2 ", "Bw' "],
    ["Fw ", "Fw2 ", "Fw' "],
    ["Lw ", "Lw2 ", "Lw' "],
    ["Rw ", "Rw2 ", "Rw' "],
];

export const Scramble = () => {
    let scramble = ThreeScramble();
    let lastMoveIndex = { 'U': 0, 'D': 1, 'F': 2, 'B': 3, 'R': 4, 'L': 5 }[scramble.split(" ")[THREE_SCRAMBLE_LENGTH - 1][0]];
    let turnLayer, turnIterator;
    let firstWideMove = false;
    if (0 !== Math.floor(Math.random() * 6)) {
        turnLayer = Math.floor(Math.random() * 5);
        if (turnLayer === lastMoveIndex) {
            turnLayer++;
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += LAST_TWO[turnLayer][turnIterator];
        lastMoveIndex = turnLayer;
        firstWideMove = true;
    }
    if (0 !== Math.floor(Math.random() * 4)) {
        if (firstWideMove) {
            turnLayer = Math.floor(Math.random() * 4);
            if (parseInt(lastMoveIndex / 2) === parseInt(turnLayer / 2)) {
                if (turnLayer % 2 === 0) {
                    turnLayer += 2;
                } else {
                    turnLayer++;
                }
            }
        } else {
            turnLayer = Math.floor(Math.random() * 5);
            if (turnLayer === lastMoveIndex) {
                turnLayer++;
            }
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += LAST_TWO[turnLayer][turnIterator];
    }
    return scramble;
}
