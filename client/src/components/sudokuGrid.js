import React from 'react';

function SudokuGrid({ sudokuString }) {
    return (
        <><div className="sudoku-grid">
            {sudokuString.split('').map((digit) => (
                <span className="sudoku-cell">{digit === '0' ? '' : digit}</span>
            ))}
        </div>
            <br /></>
    );
}
export default SudokuGrid;
