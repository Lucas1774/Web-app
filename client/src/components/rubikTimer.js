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

    // use effect instead of conditional rendering to avoid event target issues
    useEffect(() => {
        let element = document.getElementById("scramble");
        element.style.display = isScrambleVisible ? "block" : "none";
    }, [isScrambleVisible]);

    useEffect(() => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const prepareEvent = isAndroid ? "touchstart" : "keydown";
        const startEvent = isAndroid ? "touchend" : "keyup";
        const abort = isAndroid ? "touchmove" : "keydown";
        const handleDrag = (event) => {
            event.preventDefault()
            if (isAndroid || event.key !== " ") {
                document.removeEventListener(startEvent, handleStartEvent);
                document.removeEventListener(abort, handleDrag);
                setIsTimerRunning(false);
                setIsScrambleVisible(true);
                setIsTimerVisible(true);
                setIsRestartButtonVisible(true);
                document.body.classList.remove("nonSelectable");
                document.getElementById("timer").classList.remove("green-timer");
                document.addEventListener(prepareEvent, handlePrepareEvent);
            }
        }
        const handleStartEvent = (event) => {
            if (isAndroid || event.key === " ") {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                document.removeEventListener(abort, handleDrag);
                document.removeEventListener(startEvent, handleStartEvent);
                setStartTime(now);
                timerID.current = setInterval(() => {
                    setElapsedTime(performance.now() - now);
                }, TIMER_REFRESH_RATE);
                setIsTimerRunning(true);
                let timer = document.getElementById("timer");
                timer.classList.remove("green-timer");
                timer.classList.add("running-timer");
                if (isAndroid) {
                    timer.scrollIntoView({
                        block: "center"
                    });
                }
            };
        }
        const handlePrepareEvent = (event) => {
            if (!isTimerRunning && ((isAndroid && event.target.tagName !== "BUTTON" && event.target.tagName !== "INPUT") || event.key === " ")) {
                event.preventDefault();
                hideEverything();
                setElapsedTime(0);
                setIsTimerVisible(true);
                if (navigator.wakeLock) {
                    navigator.wakeLock.request("screen");
                }
                document.body.classList.add("nonSelectable");
                document.removeEventListener(prepareEvent, handlePrepareEvent);
                document.getElementById("timer").classList.add("green-timer");
                document.addEventListener(abort, handleDrag);
                document.addEventListener(startEvent, handleStartEvent);
            } else if (isTimerRunning && (isAndroid || event.key !== "Escape")) {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                hideEverything();
                clearInterval(timerID.current);
                setElapsedTime(now - startTime);
                setIsTimerRunning(false);
                setScramble(Scramble(selectedPuzzle));
                setIsScrambleVisible(true);
                setIsTimerVisible(true);
                let timer = document.getElementById("timer");
                timer.classList.remove("running-timer");
                if (isAndroid) {
                    setTimeout(() => { // wait a little to not accidentally click something
                        setIsRestartButtonVisible(true);
                        document.body.classList.remove("nonSelectable");
                        if (window.matchMedia("(orientation: landscape)").matches) {
                            timer.scrollIntoView({
                                block: "end"
                            })
                        }
                    }, 200);
                    if (navigator.wakeLock) {
                        navigator.wakeLock.release();
                    }
                } else {
                    setIsRestartButtonVisible(true);
                }
            }
        };
        if (isTimerVisible) {
            document.addEventListener(prepareEvent, handlePrepareEvent);
        } else {
            document.removeEventListener(prepareEvent, handlePrepareEvent);
            clearInterval(timerID.current);
        };
        return () => {
            document.removeEventListener(prepareEvent, handlePrepareEvent);
            document.removeEventListener(startEvent, handleStartEvent);
            document.removeEventListener(abort, handleDrag);
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
        const minutes = parseInt(Math.floor(elapsedTime / 60000)).toString();
        const seconds = parseInt(Math.floor((elapsedTime % 60000) / 1000)).toString().padStart(2, '0');
        const milliseconds = parseInt((elapsedTime % 1000)).toString().padStart(3, '0');
        return (
            <>
                <h3 id="timer">{minutes}:{seconds}:{milliseconds}</h3>
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
            <h1 id="rubikTimer">Rubik timer</h1>
            <div className="app rubikTimer">
                {isFormVisible && renderForm()}
                {<h2 id="scramble" className={selectedPuzzle}>{scramble}</h2>}
                {isTimerVisible && renderTimer()}
                {isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
            </div>
        </>
    );
};

export default RubikTimer;
