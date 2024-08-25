import { SCRAMBLE_MOVES as THREE_SCRAMBLE_MOVES } from "./threeScrambler";
import { FOUR_SCRAMBLE_MOVES } from "./fiveScrambler";

export const SCRAMBLE_LENGTH = 100;
const SIX_SCRAMBLE_MOVES = [
    ["3Uw ", "3Uw2 ", "3Uw' "],
    ["3Dw ", "3Dw2 ", "3Dw' "],
    ["3Fw ", "3Fw2 ", "3Fw' "],
    ["3Bw ", "3Bw2 ", "3Bw' "],
    ["3Rw ", "3Rw2 ", "3Rw' "],
    ["3Lw ", "3Lw2 ", "3Lw' "]
];

export const Scramble = () => {
    let scramble = "";
    let lastMoveIndex = -2;
    let secondTolastMoveIndex = -2;
    let lastSimpleMoveLayer = -2;
    let secondToLastSimpleMoveLayer = -2;
    let lastDoubleMoveLayer = -2;
    let secondToLastDoubleMoveLayer = -2;
    let lastTripleMoveLayer = -2;
    let secondToLastTripleMoveLayer = -2;
    let lastTurnWidth = -1;
    let turnLayer, turnIterator, turnWidth;
    for (let i = 0; i < SCRAMBLE_LENGTH; i++) {
        turnWidth = Math.floor(Math.random() * 3);
        let axisHasBeenBroken = turnWidth !== lastTurnWidth
            ? (parseInt(lastMoveIndex / 2) !== parseInt(secondTolastMoveIndex / 2) || 1 === i)
            : turnWidth === 0
                ? parseInt(lastSimpleMoveLayer / 2) !== parseInt(secondToLastSimpleMoveLayer / 2)
                : turnWidth === 1
                    ? parseInt(lastDoubleMoveLayer / 2) !== parseInt(secondToLastDoubleMoveLayer / 2)
                    : parseInt(lastTripleMoveLayer / 2) !== parseInt(secondToLastTripleMoveLayer / 2);
        if (axisHasBeenBroken) {
            if (turnWidth !== lastTurnWidth) {
                turnLayer = Math.floor(Math.random() * 6);
            } else {
                turnLayer = Math.floor(Math.random() * 5);
                let layerIsTheSame = lastTurnWidth === 0
                    ? lastSimpleMoveLayer === turnLayer
                    : lastTurnWidth === 1
                        ? lastDoubleMoveLayer === turnLayer
                        : lastTripleMoveLayer === turnLayer;
                if (layerIsTheSame) {
                    turnLayer++;
                }
            }
        } else {
            turnLayer = Math.floor(Math.random() * 4);
            let axisIsTheSame = lastTurnWidth === 0
                ? parseInt(turnLayer / 2) === parseInt(lastSimpleMoveLayer / 2)
                : lastTurnWidth === 1
                    ? parseInt(turnLayer / 2) === parseInt(lastDoubleMoveLayer / 2)
                    : parseInt(turnLayer / 2) === parseInt(lastTripleMoveLayer / 2);
            if (axisIsTheSame) {
                if (turnLayer % 2 === 0) {
                    turnLayer += 2;
                } else {
                    turnLayer++;
                }
            }
        }
        turnIterator = Math.floor(Math.random() * 3);
        scramble += turnWidth === 0
            ? THREE_SCRAMBLE_MOVES[turnLayer][turnIterator]
            : turnWidth === 1
                ? FOUR_SCRAMBLE_MOVES[turnLayer][turnIterator]
                : SIX_SCRAMBLE_MOVES[turnLayer][turnIterator];
        if (turnWidth === 0) {
            secondToLastSimpleMoveLayer = lastSimpleMoveLayer;
            lastSimpleMoveLayer = turnLayer;
        } else if (turnWidth === 1) {
            secondToLastDoubleMoveLayer = lastDoubleMoveLayer;
            lastDoubleMoveLayer = turnLayer;
        } else {
            secondToLastTripleMoveLayer = lastTripleMoveLayer;
            lastTripleMoveLayer = turnLayer;
        }
        lastTurnWidth = turnWidth;
        secondTolastMoveIndex = lastMoveIndex;
        lastMoveIndex = turnLayer;
    }
    return scramble;
};
