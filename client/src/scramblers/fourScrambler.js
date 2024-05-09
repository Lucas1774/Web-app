import {
    Scramble as ThreeScramble,
    SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH,
    SCRAMBLE_MOVES as THREE_SCRAMBLE_MOVES
} from './threeScrambler.js';

export const SCRAMBLE_LENGTH = 45;
const SCRAMBLE_MOVES = [
    ["Uw ", "Uw2 ", "Uw' "],
    ["Dw ", "Dw2 ", "Dw' "],
    ["Fw ", "Fw2 ", "Fw' "],
    ["Bw ", "Bw2 ", "Bw' "],
    ["Rw ", "Rw2 ", "Rw' "],
    ["Lw ", "Lw2 ", "Lw' "],
];

export const Scramble = () => {
    let scramble = ThreeScramble();
    let lastSimpleMoveLayer = { 'U': 0, 'D': 1, 'F': 2, 'B': 3, 'R': 4, 'L': 5 }[scramble.split(" ")[THREE_SCRAMBLE_LENGTH - 1][0]];
    let secondToLastSimpleMoveLayer = { 'U': 0, 'D': 1, 'F': 2, 'B': 3, 'R': 4, 'L': 5 }[scramble.split(" ")[THREE_SCRAMBLE_LENGTH - 2][0]];
    let lastDoubleMoveLayer = -2;
    let lastTurnWidth = 0;
    let turnLayer, turnIterator, turnWidth;
    for (let i = 0; i < SCRAMBLE_LENGTH - THREE_SCRAMBLE_LENGTH; i++) {
        turnWidth = Math.floor(Math.random() * 2);
        if (turnWidth === 1 && lastTurnWidth === 1) {
            turnLayer = Math.floor(Math.random() * 6);
        }
        let axisHasBeenBroken = turnWidth !== lastTurnWidth
            ? parseInt(lastDoubleMoveLayer / 2) !== parseInt(lastSimpleMoveLayer / 2)
            : turnWidth === 0
                ? parseInt(lastSimpleMoveLayer / 2) !== parseInt(secondToLastSimpleMoveLayer / 2)
                : false; // no consecutive same-axis wide moves
        if (axisHasBeenBroken) {
            if (turnWidth !== lastTurnWidth  || turnWidth) {
                turnLayer = Math.floor(Math.random() * 6);
            } else {
                turnLayer = Math.floor(Math.random() * 5);
                let layerIsTheSame = lastTurnWidth === 0
                    ? lastSimpleMoveLayer === turnLayer
                    : lastDoubleMoveLayer === turnLayer;
                if (layerIsTheSame) {
                    turnLayer++;
                }
            }
        } else {
            turnLayer = Math.floor(Math.random() * 4);
            let axisIsTheSame = lastTurnWidth === 0
                ? parseInt(turnLayer / 2) === parseInt(lastSimpleMoveLayer / 2)
                : parseInt(turnLayer / 2) === parseInt(lastDoubleMoveLayer / 2);
            if (axisIsTheSame) {
                if (turnLayer % 2 === 0) {
                    turnLayer += 2;
                } else {
                    turnLayer++;
                }
            }
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += turnWidth === 0 ? THREE_SCRAMBLE_MOVES[turnLayer][turnIterator] : SCRAMBLE_MOVES[turnLayer][turnIterator];
        if (turnWidth === 0) {
            secondToLastSimpleMoveLayer = lastSimpleMoveLayer;
            lastSimpleMoveLayer = turnLayer;
        } else {
            lastDoubleMoveLayer = turnLayer;
        }
        lastTurnWidth = turnWidth;
    }
    return scramble;
}
