import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { post, get } from "../components/api";
import { Form, Button } from 'react-bootstrap';
import FileImporter from './fileImporter';
import SudokuGrid from "./sudokuGrid";
import "../assets/styles/sudoku.css";

const FieldNames = {
    SUDOKU: "sudoku",
    INITIAL_SUDOKU: "initialSudoku",
    DIFFICULTY: "difficulty",
    IS_GENERATE_OR_IMPORT_VISIBLE: "isGenerateOrImportVisible",
    IS_SUCCESSFULLY_UPLOADED_VISIBLE: "isSuccessfullyUploadedVisible",
    IS_PICK_DIFFICULTY_VISIBLE: "isPickDifficultyVisible",
    IS_SUDOKU_VISIBLE: "isSudokuVisible",
    IS_RESTART_BUTTON_VISIBLE: "isRestartButtonVisible",
};

const Sudoku = () => {
    const initialState = useMemo(() => ({
        [FieldNames.SUDOKU]: "",
        [FieldNames.INITIAL_SUDOKU]: "",
        [FieldNames.DIFFICULTY]: 1,
        [FieldNames.IS_GENERATE_OR_IMPORT_VISIBLE]: true,
        [FieldNames.IS_SUCCESSFULLY_UPLOADED_VISIBLE]: false,
        [FieldNames.IS_PICK_DIFFICULTY_VISIBLE]: false,
        [FieldNames.IS_SUDOKU_VISIBLE]: false,
        [FieldNames.IS_RESTART_BUTTON_VISIBLE]: true,
    }), []);

    const [state, setState] = useState(initialState);

    const formRef = useRef(null);

    const setAppState = (field, value) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    useEffect(() => {
        for (let i = 0; i < 81; i++) {
            if (state.initialSudoku[i] === '0') {
                let element = document.querySelector(`input[index="${i}"]`);
                element.classList.remove(`blue-background`);
                element.classList.add(`white-background`);
            }
        }
    }, [state.initialSudoku]);

    useEffect(() => {
        const arrowKeyListener = (event) => {
            if (event.key === 'ArrowUp' && state.difficulty < 9) {
                event.preventDefault();
                setAppState(FieldNames.DIFFICULTY, state.difficulty + 1);
            } else if (event.key === 'ArrowDown' && state.difficulty > 1) {
                event.preventDefault();
                setAppState(FieldNames.DIFFICULTY, state.difficulty - 1);
            }
        };
        if (state.isPickDifficultyVisible) {
            document.addEventListener('keydown', arrowKeyListener);
            formRef.current.focus();
        } else {
            document.removeEventListener('keydown', arrowKeyListener);
        }
        return () => {
            document.removeEventListener('keydown', arrowKeyListener);
        };
    }, [state.difficulty, state.isPickDifficultyVisible]);

    const handleGenerate = () => {
        hideEverything();
        setAppState(FieldNames.IS_PICK_DIFFICULTY_VISIBLE, true);
        setAppState(FieldNames.IS_RESTART_BUTTON_VISIBLE, true);
    }

    const handleKeyDown = (event) => {
        let newValue = event.key;
        if (!isNaN(newValue) && parseInt(newValue) >= 1 && parseInt(newValue) <= 9) {
            event.preventDefault();
            setAppState(FieldNames.DIFFICULTY, parseInt(newValue));
        }
    }

    const handleSudokuChange = (index, event) => {
        event.preventDefault();
        const newValue = (event.key === "Backspace" || event.key === "Delete") ? 0 : parseInt(event.key);
        if (newValue >= 0 && newValue <= 9 && state.initialSudoku[index] === '0') {
            let auxSudoku = [...state.sudoku];
            auxSudoku[index] = newValue.toString();
            let element = document.querySelector(`input[index="${index}"]`);
            if (0 !== newValue) {
                element.classList.remove(`white-background`);
                element.classList.add(`blue-background`);
            } else {
                element.classList.remove(`blue-background`);
                element.classList.add(`white-background`);
            }
            setAppState(FieldNames.SUDOKU, auxSudoku.join(''));
        }
    }

    const isSolved = useCallback(() => {
        return state.sudoku.indexOf('0') === -1;
    }, [state.sudoku])

    const hideEverything = useCallback(() => {
        setAppState(FieldNames.IS_GENERATE_OR_IMPORT_VISIBLE, false);
        setAppState(FieldNames.IS_SUCCESSFULLY_UPLOADED_VISIBLE, false);
        setAppState(FieldNames.IS_PICK_DIFFICULTY_VISIBLE, false);
        setAppState(FieldNames.IS_SUDOKU_VISIBLE, false);
        setAppState(FieldNames.IS_RESTART_BUTTON_VISIBLE, false);
    }, []);

    const restoreDefaults = useCallback(() => {
        setState(initialState);
    }, [initialState]);

    const sendFile = (content) => {
        hideEverything();
        post('/upload/sudoku', content)
            .then(() => {
                setAppState(FieldNames.IS_SUCCESSFULLY_UPLOADED_VISIBLE, true);
                setTimeout(() => {
                    restoreDefaults();
                }, 1000);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }

    const generate = () => {
        hideEverything();
        get(`/generate/sudoku?difficulty=${state.difficulty}`)
            .then(response => {
                setAppState(FieldNames.SUDOKU, response.data);
                setAppState(FieldNames.INITIAL_SUDOKU, response.data);
                setAppState(FieldNames.IS_SUDOKU_VISIBLE, true);
                setAppState(FieldNames.IS_RESTART_BUTTON_VISIBLE, true);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }

    const check = useCallback(() => {
        const showBorderThenRemove = async (grid, color) => {
            let numberOfFlashes = color === "green" && isSolved() ? 3 : 1;
            for (let i = 0; i < numberOfFlashes; i++) {
                grid.classList.add(`${color}-border`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                grid.classList.remove(`${color}-border`);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        get(`/check/sudoku?initialSudoku=${state.initialSudoku}&currentSudoku=${state.sudoku}`)
            .then(response => {
                let color = response.data === 1 ? 'green' : 'red';
                let grid = document.querySelector('.sudoku-grid');
                if (grid !== null) {
                    showBorderThenRemove(grid, color);
                }
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }, [isSolved, restoreDefaults, state.initialSudoku, state.sudoku]);

    useEffect(() => {
        if (state.sudoku.length === 81 && isSolved() && state.initialSudoku.indexOf('0') !== -1) {
            check();
        }
    }, [check, isSolved, state.initialSudoku, state.sudoku]);

    const solve = useCallback(() => {
        hideEverything();
        get(`/solve/sudoku?sudoku=${state.initialSudoku}`)
            .then(response => {
                setAppState(FieldNames.SUDOKU, response.data);
                setAppState(FieldNames.INITIAL_SUDOKU, response.data);
                setAppState(FieldNames.IS_SUDOKU_VISIBLE, true);
                setAppState(FieldNames.IS_RESTART_BUTTON_VISIBLE, true);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }, [hideEverything, restoreDefaults, state.initialSudoku])

    useEffect(() => {
        const enterListener = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (event.ctrlKey) {
                    solve();
                } else {
                    check();
                }
            } else if (event.key === 'Escape') {
                restoreDefaults();
            }
        };
        if (state.isSudokuVisible) {
            document.addEventListener('keydown', enterListener);
        } else {
            document.removeEventListener('keydown', enterListener);
        }
        return () => {
            document.removeEventListener('keydown', enterListener);
        };
    }, [check, restoreDefaults, solve, state.isSudokuVisible])

    return (
        <>
            <h1 id="sudoku">Sudoku</h1>
            <div className="app sudoku">
                {state.isGenerateOrImportVisible &&
                    <>
                        <Button variant="success" onClick={handleGenerate}>Generate</Button>
                        <FileImporter onFileContentChange={sendFile} />
                    </>}
                {state.isSuccessfullyUploadedVisible && <div>Successfully uploaded!</div>}
                {state.isPickDifficultyVisible &&
                    <Form>
                        <Form.Label>Pick difficulty:</Form.Label>
                        <Form.Control inputMode="numeric" value={state.difficulty} onKeyDown={handleKeyDown} ref={formRef} />
                        <Button type="submit" variant="success" onClick={generate}>Generate</Button>
                    </Form>}
                {state.isSudokuVisible &&
                    <><SudokuGrid sudokuString={state.sudoku} onSudokuChange={handleSudokuChange} solved={isSolved} />
                        <Button type="submit" variant="success" onClick={solve}>Solve</Button>
                        <Button onClick={check}>Check</Button></>
                }
                {state.isRestartButtonVisible && <Button className="restart" onClick={restoreDefaults}>Restart</Button>}
            </div>
        </>
    );
}
export default Sudoku;
