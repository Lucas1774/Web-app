import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import "../assets/styles/scrambleGenerator.css";

const NONE = "none";
const TWO = "two";
const THREE = "three";

const RubikScramble = () => {
    const [selectedPuzzle, setSelectedPuzzle] = useState(NONE);
    const [scramble, setScramble] = useState("");
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isScrambleVisible, setIsScrambleVisible] = useState(false);
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === " " && !isTimerRunning) {
                event.preventDefault();
                hideEverything();
                setIsTimerRunning(true);
                setIsTimerVisible(true);
            } else if (event.key !== "Escape" && isTimerRunning) {
                event.preventDefault();
                hideEverything();
                setIsTimerRunning(false);
                setScramble(generateScramble(selectedPuzzle));
                setIsScrambleVisible(true);
                setIsTimerVisible(true);
                setIsRestartButtonVisible(true);
            }
        };
        if (isTimerVisible) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isTimerRunning, isTimerVisible, selectedPuzzle]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                hideEverything();
                restoreDefaults();
            }
        };
        if (isTimerVisible || isFormVisible) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        };
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFormVisible, isTimerVisible]);

    const handleSubmit = (event) => {
        event.preventDefault();
        let puzzle = event.target.id;
        hideEverything();
        setSelectedPuzzle(puzzle);
        setScramble(generateScramble(puzzle));
        setIsScrambleVisible(true);
        setIsTimerVisible(true);
        setIsRestartButtonVisible(true);
    };

    // TODO: implement
    const generateScramble = (puzzle) => {
        let scramble = "";
        if (puzzle === TWO) {
            scramble = "R U F";
        } else if (puzzle === THREE) {
            scramble = "R U F L D B";
        }
        return scramble;
    }

    const renderForm = () => {
        return (
            <>
                <Button id={TWO} onClick={handleSubmit}>2x2</Button>
                <Button id={THREE} onClick={handleSubmit}>3x3</Button>
            </>
        );
    };

    // TODO: implement
    const renderTimer = () => {
        return (
            <>
                <h2>Timer</h2>
            </>
        );
    };

    const hideEverything = () => {
        setIsFormVisible(false);
        setIsScrambleVisible(false);
        setIsTimerVisible(false);
        setIsRestartButtonVisible(false);
    };

    const restoreDefaults = () => {
        setSelectedPuzzle(NONE);
        setScramble("");
        setIsTimerRunning(false);
        setIsFormVisible(true);
        setIsScrambleVisible(false);
        setIsTimerVisible(false);
        setIsRestartButtonVisible(true);
    };

    return (
        <>
            <h1 id="scrambleGenerator">Scramble Generator</h1>
            <div className="app scrambleGenerator">
                {isFormVisible && renderForm()}
                {isScrambleVisible && <h2>{scramble}</h2>}
                {isTimerVisible && renderTimer()}
                {isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
            </div>
        </>
    );
};

export default RubikScramble;
