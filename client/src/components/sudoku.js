import SudokuGrid from "./sudokuGrid";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { post, get } from "../components/api";
import { Form, Button } from 'react-bootstrap';
import FileImporter from './fileImporter';
import "../assets/styles/sudoku.css";

const Sudoku = () => {
    const initialState = useMemo(() => ({
        sudoku: "",
        initialSudoku: "",
        difficulty: 1,
        isGenerateOrImportVisible: true,
        isSuccessfullyUploadedVisible: false,
        isPickDifficultyVisible: false,
        isSudokuVisible: false,
        isRestartButtonVisible: true,
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
                setAppState("difficulty", state.difficulty + 1);
            } else if (event.key === 'ArrowDown' && state.difficulty > 1) {
                event.preventDefault();
                setAppState("difficulty", state.difficulty - 1);
            }
        };
        if (state.isPickDifficultyVisible) {
            document.addEventListener('keydown', arrowKeyListener);
            formRef.current.focus();
            formRef.current.select();
        } else {
            document.removeEventListener('keydown', arrowKeyListener);
        }
        return () => {
            document.removeEventListener('keydown', arrowKeyListener);
        };
    }, [state.difficulty, state.isPickDifficultyVisible]);

    const handleGenerate = () => {
        hideEverything();
        setAppState("isPickDifficultyVisible", true);
        setAppState("isRestartButtonVisible", true);
    }

    const handleKeyDown = (event) => {
        event.preventDefault();
        if (!isNaN(event.target.value) && parseInt(event.target.value) >= 1 && parseInt(event.target.value) <= 9) {
            setAppState("difficulty", parseInt(event.target.value));
        }
    }

    const handleSudokuChange = (index, event) => {
        event.preventDefault();
        const newValue = !event.target.value ? 0 : parseInt(event.target.value);
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
            setAppState("sudoku", auxSudoku.join(''));
        }
    }

    const hideEverything = useCallback(() => {
        setAppState("isGenerateOrImportVisible", false);
        setAppState("isSuccessfullyUploadedVisible", false);
        setAppState("isPickDifficultyVisible", false);
        setAppState("isSudokuVisible", false);
        setAppState("isRestartButtonVisible", false);
    }, []);

    const restoreDefaults = useCallback(() => {
        setState(initialState);
    }, [initialState]);

    const check = useCallback(() => {
        const showBorderThenRemove = async (grid, color) => {
            let numberOfFlashes = color === "green" && state.sudoku.indexOf('0') === -1 ? 3 : 1;
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
    }, [restoreDefaults, state.initialSudoku, state.sudoku]);

    useEffect(() => {
        if (state.sudoku.length === 81 && state.sudoku.indexOf('0') === -1 && state.initialSudoku.indexOf('0') !== -1) {
            check();
        }
    }, [check, state.initialSudoku, state.sudoku]);

    useEffect(() => {
        const enterListener = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                check();
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
    }, [check, state.isSudokuVisible])

    const generate = () => {
        hideEverything();
        get(`/generate/sudoku?difficulty=${state.difficulty}`)
            .then(response => {
                setAppState("sudoku", response.data);
                setAppState("initialSudoku", response.data);
                setAppState("isSudokuVisible", true);
                setAppState("isRestartButtonVisible", true);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }

    const sendFile = (content) => {
        hideEverything();
        post('/upload/sudoku', content)
            .then(() => {
                setAppState("isSuccessfullyUploadedVisible", true);
                setTimeout(() => {
                    restoreDefaults();
                }, 1000);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }

    const solve = () => {
        hideEverything();
        get(`/solve/sudoku?sudoku=${state.initialSudoku}`)
            .then(response => {
                setAppState("sudoku", response.data);
                setAppState("initialSudoku", response.data);
                setAppState("isSudokuVisible", true);
                setAppState("isRestartButtonVisible", true);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }

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
                        <Form.Control inputMode="numeric" value={state.difficulty} onChange={handleKeyDown} onFocus={(e) => e.target.select()} ref={formRef} />
                        <Button type="submit" variant="success" onClick={generate}>Generate</Button>
                    </Form>}
                {state.isSudokuVisible &&
                    <><SudokuGrid sudokuString={state.sudoku} onSudokuChange={handleSudokuChange} />
                        <Button type="submit" variant="success" onClick={solve}>Solve</Button>
                        <Button onClick={check}>Check</Button></>
                }
                {state.isRestartButtonVisible && <Button className="restart" onClick={restoreDefaults}>Restart</Button>}
            </div>
        </>
    );
}
export default Sudoku;
