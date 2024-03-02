import React from 'react';

function SudokuGrid({ sudokuString }) {
    return (
        <div>
            {sudokuString.split('').map((digit, index) => (
                index % 9 === 8 ? <span key={index}>{digit}<br /></span> : <span key={index}>{digit}</span>
            ))}
        </div>
    );
}
export default SudokuGrid;
