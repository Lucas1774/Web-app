import React, { useState, useEffect } from "react";

function SudokuGrid({ sudokuString, initialSudokuState }) {
    const [sudokuState, setSudokuState] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(null);

    useEffect(() => {
        setSudokuState(sudokuString.split(''));
    }, [sudokuString]);

    useEffect(() => {
        function handleKeyDown(event) {
            let key = event.key;
            if (key.startsWith('Arrow')) {
                event.preventDefault();
                let aux;
                switch (key) {
                    case 'ArrowUp':
                        aux = focusedIndex - 9
                        break;
                    case 'ArrowDown':
                        aux = focusedIndex + 9;
                        break;
                    case 'ArrowLeft':
                        aux = focusedIndex - 1;
                        break;
                    case 'ArrowRight':
                        aux = focusedIndex + 1;
                        break;
                    default:
                        return;
                }
                if (aux < 0 || aux >= 81) {
                    return;
                }
                const input = document.querySelector(`.sudoku-cell:nth-child(${aux + 1}) input`);
                input.focus();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [focusedIndex]);

    function handleChange(index, event) {
        const newValue = event.target.value;
        if (!newValue || (newValue >= 1 && newValue <= 9)) {
            if (initialSudokuState[index] === '0') {
                setSudokuState((previous) => {
                    const newState = [...previous];
                    newState[index] = newValue;
                    return newState;
                });
            }
        }
    }

    return (
        <><div className="sudoku-grid">
            {sudokuState.map((digit, index) => (
                <span className="sudoku-cell" key={index}>
                    <input
                        value={digit === '0' ? '' : digit}
                        onChange={(event) => handleChange(index, event)}
                        onFocus={() => setFocusedIndex(index)} />
                </span>
            ))}
        </div><br></br></>
    );
}
export default SudokuGrid;
