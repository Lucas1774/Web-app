import React, { useState, useEffect } from "react";

const SudokuGrid = ({ sudokuString, onSudokuChange }) => {

    const [focusedIndex, setFocusedIndex] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {

            let key = event.key;
            if (key.startsWith('Arrow') && focusedIndex !== null) {
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

    return (
        <><div className="sudoku-grid">
            {sudokuString.split('').map((digit, index) => (
                <span className="sudoku-cell">
                    <input
                        index={index}
                        inputMode="numeric"
                        value={digit === '0' ? '' : digit}
                        onChange={(event) => { onSudokuChange(index, event); event.target.select() }}
                        onFocus={(event) => { setFocusedIndex(index); event.target.select() }}
                        onBlur={() => setFocusedIndex(null)} />
                </span>
            ))}
        </div><br></br></>
    );
}
export default SudokuGrid;
