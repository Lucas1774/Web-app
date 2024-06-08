import React, { useState, useRef, useEffect, useCallback } from "react";
import { post, get } from "../components/api";
import { Form, Button } from 'react-bootstrap';
import FileImporter from './fileImporter';
import SudokuGrid from "./sudokuGrid";
import "../assets/styles/sudoku.css";

const Sudoku = () => {
    const [sudoku, setSudoku] = useState("");
    const [initialSudoku, setInitialSudoku] = useState("");
    const [difficulty, setDifficulty] = useState(1);
    const [isGenerateOrImportVisible, setIsGenerateOrImportVisible] = useState(true);
    const [isUploadResponseVisible, setIsUploadResponseVisible] = useState(false);
    const [isPickDifficultyVisible, setIsPickDifficultyVisible] = useState(false);
    const [isSudokuVisible, setIsSudokuVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);

    const responseMessage = useRef("");
    const formRef = useRef(null);

    useEffect(() => {
        for (let i = 0; i < 81; i++) {
            if (initialSudoku[i] === '0') {
                let element = document.querySelector(`input[index="${i}"]`);
                element.classList.remove(`blue-background`);
                element.classList.add(`white-background`);
            }
        }
    }, [initialSudoku]);

    useEffect(() => {
        const arrowKeyListener = (event) => {
            if (event.key === 'ArrowUp' && difficulty < 9) {
                event.preventDefault();
                setDifficulty(prevDifficulty => prevDifficulty + 1);
            } else if (event.key === 'ArrowDown' && difficulty > 1) {
                event.preventDefault();
                setDifficulty(prevDifficulty => prevDifficulty - 1);
            }
        };
        if (isPickDifficultyVisible) {
            document.addEventListener('keydown', arrowKeyListener);
            formRef.current.focus();
        } else {
            document.removeEventListener('keydown', arrowKeyListener);
        }
        return () => {
            document.removeEventListener('keydown', arrowKeyListener);
        };
    }, [difficulty, isPickDifficultyVisible]);

    const handleGenerate = () => {
        hideEverything();
        setIsPickDifficultyVisible(true);
        setIsRestartButtonVisible(true);
    };

    const handleKeyDown = (event) => {
        let newValue = event.key;
        if (!isNaN(newValue) && parseInt(newValue) >= 1 && parseInt(newValue) <= 9) {
            event.preventDefault();
            setDifficulty(parseInt(newValue));
        }
    };

    const handleSudokuChange = (index, event) => {
        event.preventDefault();
        const newValue = (event.key === "Backspace" || event.key === "Delete") ? 0 : parseInt(event.key);
        if (newValue >= 0 && newValue <= 9 && initialSudoku[index] === '0') {
            let auxSudoku = [...sudoku];
            auxSudoku[index] = newValue.toString();
            let element = document.querySelector(`input[index="${index}"]`);
            if (0 !== newValue) {
                element.classList.remove(`white-background`);
                element.classList.add(`blue-background`);
            } else {
                element.classList.remove(`blue-background`);
                element.classList.add(`white-background`);
            }
            setSudoku(auxSudoku.join(''));
        }
    };

    const isSolved = useCallback(() => {
        return sudoku.indexOf('0') === -1;
    }, [sudoku]);

    const hideEverything = useCallback(() => {
        setIsGenerateOrImportVisible(false);
        setIsUploadResponseVisible(false);
        setIsPickDifficultyVisible(false);
        setIsSudokuVisible(false);
        setIsRestartButtonVisible(false);
    }, []);

    const restoreDefaults = useCallback(() => {
        setSudoku("");
        setInitialSudoku("");
        setDifficulty(1);
        setIsGenerateOrImportVisible(true);
        setIsUploadResponseVisible(false);
        setIsPickDifficultyVisible(false);
        setIsSudokuVisible(false);
        setIsRestartButtonVisible(true);
        responseMessage.current = "";
    }, []);

    const sendFile = (content) => {
        hideEverything();
        post('/upload/sudokus', content)
            .then((response) => {
                if (response.data === 1) {
                    responseMessage.current = "Successfully uploaded!";
                } else {
                    responseMessage.current = response.data.toString();
                }
                setIsUploadResponseVisible(true);
                setTimeout(() => {
                    restoreDefaults();
                }, 1000);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    };

    const generateOrFetchFromClick = (event) => {
        generateOrFetch(event.target.id);
    };

    const generateOrFetch = useCallback((generateOrFetch) => {
        let params = generateOrFetch === "generate" ? `?difficulty=${difficulty}` : "";
        hideEverything();
        get(`/${generateOrFetch}/sudoku${params}`)
            .then(response => {
                if (response.data.match(/^\d{81}$/)) {
                    setSudoku(response.data);
                    setInitialSudoku(response.data);
                    setIsSudokuVisible(true);
                    setIsRestartButtonVisible(true);
                }
                else {
                    responseMessage.current = response.data;
                    setIsUploadResponseVisible(true);
                    setTimeout(() => {
                        restoreDefaults();
                    }, 1000);
                }
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }, [difficulty, hideEverything, restoreDefaults]);

    const check = useCallback(() => {
        const showBorderThenRemove = async (grid, color) => {
            let numberOfFlashes = color === "green" && isSolved() ? 3 : 1;
            for (let i = 0; i < numberOfFlashes; i++) {
                grid.classList.add(`${color}-border`);
                await new Promise(resolve => setTimeout(resolve, 500));
                grid.classList.remove(`${color}-border`);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        get(`/check/sudoku?initialSudoku=${initialSudoku}&currentSudoku=${sudoku}`)
            .then(response => {
                if (response.data === 0 || response.data === 1) {
                    let color = response.data === 1 ? 'green' : 'red';
                    let grid = document.querySelector('.sudoku-grid');
                    if (grid !== null) {
                        showBorderThenRemove(grid, color);
                    }
                } else {
                    responseMessage.current = response.data;
                    setIsUploadResponseVisible(true);
                    setTimeout(() => {
                        restoreDefaults();
                    }, 1000);
                }
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }, [initialSudoku, isSolved, restoreDefaults, sudoku]);

    useEffect(() => {
        if (sudoku.length === 81 && isSolved() && initialSudoku.indexOf('0') !== -1) {
            check();
        }
    }, [check, initialSudoku, isSolved, sudoku.length]);

    const solve = useCallback(() => {
        hideEverything();
        get(`/solve/sudoku?sudoku=${initialSudoku}`)
            .then(response => {
                if (response.data.match(/^\d{81}$/)) {
                    setSudoku(response.data);
                    setInitialSudoku(response.data);
                    setIsSudokuVisible(true);
                    setIsRestartButtonVisible(true);
                }
                else {
                    responseMessage.current = response.data;
                    setIsUploadResponseVisible(true);
                    setTimeout(() => {
                        restoreDefaults();
                    }, 1000);
                }
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }, [hideEverything, initialSudoku, restoreDefaults]);

    useEffect(() => {
        const generateOrFetchFromKey = (event) => {
            generateOrFetch(event.ctrlKey ? "fetch" : "generate");
        }
        const enterListener = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                generateOrFetchFromKey(event);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                restoreDefaults();
            }
        };
        if (isPickDifficultyVisible) {
            document.addEventListener('keydown', enterListener);
        } else {
            document.removeEventListener('keydown', enterListener);
        }
        return () => {
            document.removeEventListener('keydown', enterListener);
        };
    }, [generateOrFetch, isPickDifficultyVisible, restoreDefaults]);

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
        if (isSudokuVisible) {
            document.addEventListener('keydown', enterListener);
        } else {
            document.removeEventListener('keydown', enterListener);
        }
        return () => {
            document.removeEventListener('keydown', enterListener);
        };
    }, [check, isSudokuVisible, restoreDefaults, solve]);

    return (
        <>
            <h1 id="sudoku">Sudoku</h1>
            <div className="app sudoku">
                {isGenerateOrImportVisible &&
                    <>
                        <Button variant="success" onClick={handleGenerate}>Generate</Button>
                        <FileImporter onFileContentChange={sendFile} />
                    </>}
                {isUploadResponseVisible && <div>{responseMessage.current}</div>}
                {isPickDifficultyVisible &&
                    <Form>
                        <Form.Label>Pick difficulty (only for generated sudoku):</Form.Label>
                        <Form.Control inputMode="numeric" value={difficulty} onKeyDown={handleKeyDown} ref={formRef} onChange={() => { }} />
                        <Button id="generate" variant="success" onClick={generateOrFetchFromClick}>Generate</Button>
                        <Button id="fetch" onClick={generateOrFetchFromClick}>Fetch</Button>
                    </Form>}
                {isSudokuVisible &&
                    <><SudokuGrid sudokuString={sudoku} onSudokuChange={handleSudokuChange} solved={isSolved} />
                        <Button type="submit" variant="success" onClick={solve}>Solve</Button>
                        <Button onClick={check}>Check</Button></>
                }
                {isRestartButtonVisible && <Button className="restart" onClick={restoreDefaults}>Restart</Button>}
            </div>
        </>
    );
};

export default Sudoku;
