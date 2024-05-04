import React, { useState, useEffect } from "react";

const SudokuGrid = ({ sudokuString, onSudokuChange, solved }) => {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!solved() && !started) {
            const input = document.querySelector(`.sudoku-cell:nth-child(1) input`);
            input.focus();
            setStarted(true);
        }
    }, [solved, started]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const arrowKeyMap = {
                ArrowUp: -9,
                ArrowDown: 9,
                ArrowLeft: -1,
                ArrowRight: 1,
            };

            const key = event.key;
            if (key in arrowKeyMap && focusedIndex !== null) {
                event.preventDefault();
                const newIndex = focusedIndex + arrowKeyMap[key];
                if (newIndex >= 0 && newIndex < 81) {
                    const input = document.querySelector(`.sudoku-cell:nth-child(${newIndex + 1}) input`);
                    if (input) {
                        input.focus();
                        setFocusedIndex(newIndex);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [focusedIndex]);

    return (
        <><div className="sudoku-grid">
            {sudokuString.split('').map((digit, index) => (
                <span className="sudoku-cell" key={index}>
                    <input
                        index={index}
                        inputMode="numeric"
                        value={digit === '0' ? '' : digit}
                        onKeyDown={(event) => onSudokuChange(index, event)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)} />
                </span>
            ))}
        </div><br></br></>
    );
};

export default SudokuGrid;
