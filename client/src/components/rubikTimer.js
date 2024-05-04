import { useState, useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import { TWO, THREE } from "../constants";
import Scramble from "../scramblers/provider";
import "../assets/styles/rubikTimer.css";

const TIMER_REFRESH_RATE = 50;

const RubikTimer = () => {
    const [selectedPuzzle, setSelectedPuzzle] = useState("");
    const [scramble, setScramble] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isScrambleVisible, setIsScrambleVisible] = useState(false);
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);

    const timerID = useRef(null);

    useEffect(() => {
        const handleKeyUp = (event) => {
            if (event.key === " " && !isTimerRunning) {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                setStartTime(now);
                document.getElementById("timer").classList.remove("green-timer");
                document.getElementById("timer").classList.add("running-timer");
                timerID.current = setInterval(() => {
                    setElapsedTime(performance.now() - now);
                }, TIMER_REFRESH_RATE);
                setIsTimerRunning(true);
                document.removeEventListener("keyup", handleKeyUp);
            };
        }
        const handleKeyDown = (event) => {
            if (event.key === " " && !isTimerRunning) {
                event.preventDefault();
                hideEverything();
                setElapsedTime(0);
                setIsTimerVisible(true);
                document.getElementById("timer").classList.add("green-timer");
                document.addEventListener("keyup", handleKeyUp);
            } else if (event.key !== "Escape" && isTimerRunning) {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                hideEverything();
                clearInterval(timerID.current);
                setElapsedTime(now - startTime);
                setIsTimerRunning(false);
                setScramble(Scramble(selectedPuzzle));
                setIsScrambleVisible(true);
                setIsTimerVisible(true);
                document.getElementById("timer").classList.remove("running-timer");
                setIsRestartButtonVisible(true);
            }
        };
        if (isTimerVisible) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
            clearInterval(timerID.current);
        };
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            clearInterval(timerID);
        };
    }, [isTimerRunning, isTimerVisible, selectedPuzzle, startTime]);

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
        setScramble(Scramble(puzzle));
        setIsScrambleVisible(true);
        setIsTimerVisible(true);
        setIsRestartButtonVisible(true);
    };

    const renderForm = () => {
        return (
            <>
                <Button id={TWO} onClick={handleSubmit}>2x2</Button>
                <Button id={THREE} onClick={handleSubmit}>3x3</Button>
            </>
        );
    };

    const renderTimer = () => {
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        const milliseconds = (elapsedTime % 1000).toString().padStart(3, '0');
        return (
            <>
                <h3 id="timer">{minutes}:{seconds.toString().padStart(2, '0')}:{milliseconds}</h3>
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
        setSelectedPuzzle("");
        setScramble("");
        setStartTime(0);
        setElapsedTime(0);
        setIsTimerRunning(false);
        setIsFormVisible(true);
        setIsScrambleVisible(false);
        setIsTimerVisible(false);
        setIsRestartButtonVisible(true);
    };

    return (
        <>
            <h1 id="rubikTimer">Scramble Generator</h1>
            <div className="app rubikTimer">
                {isFormVisible && renderForm()}
                {isScrambleVisible && <h2>{scramble}</h2>}
                {isTimerVisible && renderTimer()}
                {isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
            </div>
        </>
    );
};

export default RubikTimer;
