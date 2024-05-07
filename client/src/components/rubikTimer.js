import { useState, useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import { TWO, THREE, BLD, MEGAMINX } from "../constants";
import Scramble from "../scramblers/provider";
import "../assets/styles/rubikTimer.css";

const TIMER_REFRESH_RATE = 50;

const RubikTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerPrepared, setIsTimerPrepared] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [scrambleDisplayMode, setScrambleDisplaymode] = useState("block");
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);
    const [shouldFocusTimer, setShouldFocusTimer] = useState(false);

    const selectedPuzzle = useRef("");
    const scramble = useRef(null);
    const timer = useRef(null);
    const startTime = useRef(0);
    const timerID = useRef(null);
    const isAndroid = /Android/i.test(navigator.userAgent);

    useEffect(() => {
        const prepareEvent = isAndroid ? "touchstart" : "keydown";
        const startEvent = isAndroid ? "touchend" : "keyup";
        const abort = isAndroid ? "touchmove" : "keydown";
        const handleDrag = (event) => {
            event.preventDefault()
            if (isAndroid || event.key !== " ") {
                document.removeEventListener(startEvent, handleStartEvent);
                document.removeEventListener(abort, handleDrag);
                setIsTimerPrepared(false);
                setScrambleDisplaymode("block");
                setIsTimerVisible(true);
                setIsRestartButtonVisible(true);
                document.body.classList.remove("nonSelectable");
                document.addEventListener(prepareEvent, handlePrepareEvent);
            }
        }
        const handleStartEvent = (event) => {
            if (isAndroid || event.key === " ") {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                document.removeEventListener(abort, handleDrag);
                document.removeEventListener(startEvent, handleStartEvent);
                startTime.current = now;
                timerID.current = setInterval(() => {
                    setElapsedTime(performance.now() - now);
                }, TIMER_REFRESH_RATE);
                setIsTimerPrepared(false);
                setIsTimerRunning(true);
                if (isAndroid) {
                    timer.current.scrollIntoView({
                        block: "center"
                    });
                }
            };
        }
        const handlePrepareEvent = (event) => {
            if (!isTimerRunning && ((isAndroid && event.target.tagName !== "BUTTON" && event.target.tagName !== "INPUT") || event.key === " ")) {
                event.preventDefault();
                hideEverything();
                setIsTimerVisible(true);
                setIsTimerPrepared(true);
                if (navigator.wakeLock) {
                    navigator.wakeLock.request("screen");
                }
                document.body.classList.add("nonSelectable");
                document.removeEventListener(prepareEvent, handlePrepareEvent);
                document.addEventListener(abort, handleDrag);
                document.addEventListener(startEvent, handleStartEvent);
            } else if (isTimerRunning && (isAndroid || event.key !== "Escape")) {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                hideEverything();
                clearInterval(timerID.current);
                setElapsedTime(now - startTime.current);
                setIsTimerRunning(false);
                scramble.current = Scramble(selectedPuzzle.current);
                setScrambleDisplaymode("block");
                setIsTimerVisible(true);
                if (isAndroid) {
                    setTimeout(() => { // wait a little to not accidentally click something
                        setIsRestartButtonVisible(true);
                        document.body.classList.remove("nonSelectable");
                        if (window.matchMedia("(orientation: landscape)").matches) {
                            setShouldFocusTimer(true);
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
    }, [isAndroid, isTimerRunning, isTimerVisible]);

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
        selectedPuzzle.current = puzzle;
        scramble.current = Scramble(puzzle);
        setScrambleDisplaymode("block");
        setIsTimerVisible(true);
        setIsRestartButtonVisible(true);
        setShouldFocusTimer(true);
    };

    useEffect(() => {
        if (shouldFocusTimer && isAndroid) {
            timer.current.scrollIntoView({
                block: "end"
            })
            setShouldFocusTimer(false);
        }
    }, [isAndroid, shouldFocusTimer]);

    const renderForm = () => {
        return (
            <>
                <Button id={TWO} onClick={handleSubmit}>2x2</Button>
                <Button id={THREE} onClick={handleSubmit}>3x3</Button>
                <Button id={BLD} onClick={handleSubmit}>BLD</Button>
                <Button id={MEGAMINX} onClick={handleSubmit}>Megaminx</Button>
            </>
        );
    };

    const renderTimer = () => {
        let timerValue;
        if (timer.current && isTimerPrepared) {
            timerValue = "0:00:000";
        } else {
            const minutes = parseInt(Math.floor(elapsedTime / 60000)).toString();
            const seconds = parseInt(Math.floor((elapsedTime % 60000) / 1000)).toString().padStart(2, '0');
            const milliseconds = parseInt((elapsedTime % 1000)).toString().padStart(3, '0');
            timerValue = `${minutes}:${seconds}:${milliseconds}`;
        }
        let timerClass = "";
        if (isTimerRunning) {
            timerClass = "running-timer";
        } else if (isTimerPrepared) {
            timerClass = "green-timer";
        }
        return (
            <h3 id="timer" ref={timer} className={timerClass}>{timerValue}</h3>
        );
    };

    const hideEverything = () => {
        setIsFormVisible(false);
        setScrambleDisplaymode("none");
        setIsTimerVisible(false);
        setIsRestartButtonVisible(false);
    };

    const restoreDefaults = () => {
        selectedPuzzle.current = "";
        scramble.current = "";
        startTime.current = 0;
        setElapsedTime(0);
        setIsTimerRunning(false);
        setIsFormVisible(true);
        setScrambleDisplaymode("none");
        setIsTimerVisible(false);
        setIsRestartButtonVisible(true);
    };

    return (
        <>
            <h1 id="rubikTimer">Rubik timer</h1>
            <div className="app rubikTimer">
                {isFormVisible && renderForm()}
                {<h2 id="scramble" className={selectedPuzzle.current} style={{ display: scrambleDisplayMode }}>{scramble.current}</h2>}
                {isTimerVisible && renderTimer()}
                {isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
            </div>
        </>
    );
};

export default RubikTimer;
