import {
    SCRAMBLE_LENGTH as THREE_SCRAMBLE_LENGTH,
    SCRAMBLE_MOVES
} from './threeScrambler.js';

export const FMC_PREFIX = "R' U' F "
export const SCRAMBLE_LENGTH = THREE_SCRAMBLE_LENGTH + ((FMC_PREFIX.trim().split(" ").length) * 2);

export const Scramble = () => {
    let scramble = FMC_PREFIX;
    const prefixAsArray = FMC_PREFIX.trim().split(" ")
    let lastMoveIndex = { 'U': 0, 'D': 1, 'F': 2, 'B': 3, 'R': 4, 'L': 5 }[prefixAsArray[prefixAsArray.length - 1].charAt(0)];
    let secondToLastMoveIndex = { 'U': 0, 'D': 1, 'F': 2, 'B': 3, 'R': 4, 'L': 5 }[prefixAsArray[prefixAsArray.length - 2].charAt(0)];
    let turnLayer, turnIterator;
    for (let i = 0; i < THREE_SCRAMBLE_LENGTH - 1; i++) {
        if (parseInt(lastMoveIndex / 2) !== parseInt(secondToLastMoveIndex / 2)) {
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
    let validIndexes = 5 !== lastMoveIndex && 4 !== lastMoveIndex ? [0, 1, 2, 3, 5] : [0, 1, 2, 3];
    if (parseInt(lastMoveIndex / 2) !== parseInt(secondToLastMoveIndex / 2)) {
        validIndexes.splice(validIndexes.indexOf(lastMoveIndex), 1);
    }
    else {
        validIndexes.splice(validIndexes.indexOf(lastMoveIndex), 1);
        validIndexes.splice(validIndexes.indexOf(secondToLastMoveIndex), 1);
    }
    turnLayer = validIndexes[Math.floor(Math.random() * validIndexes.length)];
    turnIterator = Math.floor(Math.random() * 3);
    scramble += SCRAMBLE_MOVES[turnLayer][turnIterator];
    scramble += FMC_PREFIX;
    return scramble;
};
