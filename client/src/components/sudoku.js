import SudokuGrid from "./sudokuGrid";
import React, { useState } from "react";
import { post, get } from "../components/api";
import { Form, Button } from 'react-bootstrap';
import FileImporter from './fileImporter';
import "../assets/styles/sudoku.css";

function Sudoku() {
    const initialState = {
        sudoku: [],
        difficulty: 1,
        isGenerateOrImportVisible: true,
        isSuccessfullyUploadedVisible: false,
        isPickDifficultyVisible: false,
        isSudokuVisible: false,
        isSolveBUttonVisible: false,
        isRestartButtonVisible: true,
    };

    const [state, setState] = useState(initialState);

    function setAppState(field, value) {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    function handleGenerate() {
        hideEverything();
        setAppState("isPickDifficultyVisible", true);
        setAppState("isRestartButtonVisible", true);
    }

    function handleKeyDown(event) {
        event.preventDefault();
        if (!isNaN(event.target.value) && parseInt(event.target.value) >= 1 && parseInt(event.target.value) <= 9) {
            setAppState("difficulty", parseInt(event.target.value));
        } else {
            event.target.value = state.difficulty;
        }
        event.target.select();
    }

    function generate() {
        hideEverything();
        get(`/generate/sudoku?difficulty=${state.difficulty}`)
            .then(response => {
                setAppState("sudoku", response.data);
                setAppState("isSudokuVisible", true);
                setAppState("isSolveButtonVisible", true);
                setAppState("isRestartButtonVisible", true);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }

    function sendFile(content) {
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

    function solve() {
        hideEverything();
        get(`/solve/sudoku?sudoku=${state.sudoku}`)
            .then(response => {
                setAppState("sudoku", response.data);
                setAppState("isSudokuVisible", true);
                setAppState("isRestartButtonVisible", true);
            })
            .catch(error => {
                alert("Error sending data: " + error.message);
                restoreDefaults();
            });
    }

    function renderGenerateOrImport() {
        return (
            <>
                <Button variant="success" onClick={handleGenerate}>Generate</Button>
                <FileImporter onFileContentChange={sendFile} />
            </>
        );
    }

    function renderDifficultyForm() {
        return (
            <Form>
                <Form.Label>Pick difficulty:</Form.Label>
                <Form.Control value={state.difficulty} onChange={handleKeyDown} onFocus={(e) => e.target.select()} onClick={(e) => e.target.select()} />
                <Button type="submit" variant="success" onClick={generate}>Generate</Button>
            </Form>
        );
    }

    function hideEverything() {
        setAppState("isGenerateOrImportVisible", false);
        setAppState("isSuccessfullyUploadedVisible", false);
        setAppState("isPickDifficultyVisible", false);
        setAppState("isSudokuVisible", false);
        setAppState("isSolveButtonVisible", false);
        setAppState("isRestartButtonVisible", false);
    }

    function restoreDefaults() {
        setState(initialState);
    }

    return (
        <>
            <h1 id="sudoku">Sudoku</h1>
            <div className="sudoku">
                {state.isGenerateOrImportVisible && renderGenerateOrImport()}
                {state.isSuccessfullyUploadedVisible && <div>Successfully uploaded!</div>}
                {state.isPickDifficultyVisible && renderDifficultyForm()}
                {state.isSudokuVisible && <SudokuGrid sudokuString={state.sudoku} />}
                {state.isSolveButtonVisible && <Button type="submit" variant="success" onClick={solve}>Solve</Button>}
                {state.isRestartButtonVisible && <Button className="restart" onClick={restoreDefaults}>Restart</Button>}
            </div>
        </>
    );
}
export default Sudoku;
