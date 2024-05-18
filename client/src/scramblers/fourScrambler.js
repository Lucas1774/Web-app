import {
    Scramble as threeScramble,
    SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH,
    SCRAMBLE_MOVES as THREE_SCRAMBLE_MOVES
} from './threeScrambler.js';
import { SCRAMBLE_LENGTH as TWO_SCRAMBLER_LENGTH } from './twoScrambler.js';

export const SCRAMBLE_LENGTH = 48;
const MOVES_TO_REMOVE = 3
const SCRAMBLE_MOVES = [
    ["Uw ", "Uw2 ", "Uw' "],
    ["Fw ", "Fw2 ", "Fw' "],
    ["Rw ", "Rw2 ", "Rw' "]
];

export const Scramble = () => {
    let scramble = threeScramble().trim().split(" ").slice(0, -(MOVES_TO_REMOVE)); // remove the last three moves of the generated 3x3 scramble
    let lastSimpleMoveLayer = { 'U': 0, 'D': 1, 'F': 2, 'B': 3, 'R': 4, 'L': 5 }[scramble[scramble.length - 1].charAt(0)];
    let secondToLastSimpleMoveLayer = { 'U': 0, 'D': 1, 'F': 2, 'B': 3, 'R': 4, 'L': 5 }[scramble[scramble.length - 2].charAt(0)];
    scramble = scramble.join(" ").concat(" ");
    let lastDoubleMoveLayer = -2;
    let lastTurnWidth = 0;
    let turnLayer, turnIterator;
    let widths = Array(SCRAMBLE_LENGTH - ((THREE_SCRAMBLE_LENGTH - MOVES_TO_REMOVE) + TWO_SCRAMBLER_LENGTH)).fill(0).concat(Array(TWO_SCRAMBLER_LENGTH).fill(1));
    for (let i = widths.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [widths[i], widths[j]] = [widths[j], widths[i]];
    }
    for (let turnWidth of widths) {
        if (turnWidth === 1) {
            let axisHasBeenBroken = lastTurnWidth === 0
                ? parseInt(lastDoubleMoveLayer) !== parseInt(lastSimpleMoveLayer / 2)
                : false;
            if (axisHasBeenBroken) {
                turnLayer = Math.floor(Math.random() * 3);
            } else {
                turnLayer = Math.floor(Math.random() * 2);
                let axisIsTheSame = lastDoubleMoveLayer === turnLayer;
                if (axisIsTheSame) {
                    turnLayer++;
                }
            }
        } else {
            let axisHasBeenBroken = lastTurnWidth === 1
                ? parseInt(lastDoubleMoveLayer) !== parseInt(lastSimpleMoveLayer / 2)
                : parseInt(lastSimpleMoveLayer / 2) !== parseInt(secondToLastSimpleMoveLayer / 2);
            if (axisHasBeenBroken) {
                if (lastTurnWidth === 1) {
                    turnLayer = Math.floor(Math.random() * 6);
                } else {
                    turnLayer = Math.floor(Math.random() * 5);
                    let layerIsTheSame = lastSimpleMoveLayer === turnLayer;
                    if (layerIsTheSame) {
                        turnLayer++;
                    }
                }
            } else {
                turnLayer = Math.floor(Math.random() * 4);
                let axisIsTheSame = lastTurnWidth === 0
                    ? parseInt(turnLayer / 2) === parseInt(lastSimpleMoveLayer / 2)
                    : parseInt(turnLayer / 2) === parseInt(lastDoubleMoveLayer);
                if (axisIsTheSame) {
                    if (turnLayer % 2 === 0) {
                        turnLayer += 2;
                    } else {
                        turnLayer++;
                    }
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
};
