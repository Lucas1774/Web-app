import { SCRAMBLE_MOVES as THREE_SCRAMBLE_MOVES } from './threeScrambler.js';

export const SCRAMBLE_LENGTH = 60;
const FOUR_SCRAMBLE_MOVES = [
    ["Uw ", "Uw2 ", "Uw' "],
    ["Dw ", "Dw2 ", "Dw' "],
    ["Fw ", "Fw2 ", "Fw' "],
    ["Bw ", "Bw2 ", "Bw' "],
    ["Rw ", "Rw2 ", "Rw' "],
    ["Lw ", "Lw2 ", "Lw' "]
];

export const Scramble = () => {
    let scramble = "";
    let lastSimpleMoveLayer = -2;
    let secondToLastSimpleMoveLayer = -2;
    let lastDoubleMoveLayer = -2;
    let secondToLastDoubleMoveLayer = -2;
    let lastTurnWidth = -1;
    let turnLayer, turnIterator, turnWidth;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        turnWidth = Math.floor(Math.random() * 2);
        let axisHasBeenBroken = turnWidth !== lastTurnWidth
            ? (parseInt(lastDoubleMoveLayer / 2) !== parseInt(lastSimpleMoveLayer / 2) || 1 === i)
            : turnWidth === 0
                ? parseInt(lastSimpleMoveLayer / 2) !== parseInt(secondToLastSimpleMoveLayer / 2)
                : parseInt(lastDoubleMoveLayer / 2) !== parseInt(secondToLastDoubleMoveLayer / 2);
        if (axisHasBeenBroken) {
            if (turnWidth !== lastTurnWidth) {
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
        scramble += turnWidth === 0 ? THREE_SCRAMBLE_MOVES[turnLayer][turnIterator] : FOUR_SCRAMBLE_MOVES[turnLayer][turnIterator];
        if (turnWidth === 0) {
            secondToLastSimpleMoveLayer = lastSimpleMoveLayer;
            lastSimpleMoveLayer = turnLayer;
        } else {
            secondToLastDoubleMoveLayer = lastDoubleMoveLayer;
            lastDoubleMoveLayer = turnLayer;
        }
        lastTurnWidth = turnWidth;
    }
    return scramble;
};
