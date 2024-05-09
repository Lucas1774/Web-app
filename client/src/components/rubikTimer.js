import { useState, useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import { TWO, THREE, BLD, MEGAMINX } from "../constants";
import Scramble from "../scramblers/provider";
import "../assets/styles/rubikTimer.css";

const TIMER_REFRESH_RATE = 50;
const EMPTY_TIMER = "-:--:---";

const RubikTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [isTimerPrepared, setIsTimerPrepared] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [scrambleDisplayMode, setScrambleDisplaymode] = useState("block");
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);
    const [focusTimer, setShouldFocusTimer] = useState("");
    const [shouldLockScreen, setIsScreenLocked] = useState(false);
    const [recentTimes, setRecentTimes] = useState([]);

    const selectedPuzzle = useRef("");
    const scramble = useRef(null);
    const timer = useRef(null);
    const timerInterval = useRef(null);
    const isAndroid = /Android/i.test(navigator.userAgent);

    useEffect(() => {
        const prepareEvent = isAndroid ? "touchstart" : "keydown";
        const startEvent = isAndroid ? "touchend" : "keyup";
        const abort = isAndroid ? "touchmove" : "keydown";
        const stopEvent = isAndroid ? "touchstart" : "keydown";

        const handlePrepare = (event) => {
            if (!isTimerRunning && !isTimerPrepared && ((isAndroid && event.target.tagName !== "BUTTON" && event.target.tagName !== "INPUT") || event.key === " ")) {
                event.preventDefault();
                setIsTimerPrepared(true);
                setIsRestartButtonVisible(false);
                setScrambleDisplaymode("none");
                document.body.classList.add("nonSelectable");
            }
        };
        const handleInterrupt = (event) => {
            if (isTimerPrepared && (isAndroid || event.key !== " ")) {
                event.preventDefault();
                setIsTimerPrepared(false);
                setScrambleDisplaymode("block");
                setIsRestartButtonVisible(true);
                document.body.classList.remove("nonSelectable");
            }
        };
        const handleStart = (event) => {
            if (isTimerPrepared && (isAndroid || event.key === " ")) {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                setStartTime(now);
                timerInterval.current = setInterval(() => {
                    setElapsedTime(performance.now() - now);
                }, TIMER_REFRESH_RATE);
                setIsTimerPrepared(false);
                setIsTimerRunning(true);
                if (isAndroid) {
                    setShouldFocusTimer("center");
                }
            };
        };
        const handleStop = (event) => {
            if (isTimerRunning && (isAndroid || event.key !== "Escape")) {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                clearInterval(timerInterval.current);
                const finalTime = now - startTime;
                setElapsedTime(finalTime);
                setRecentTimes((previousTimes) => [...previousTimes, finalTime]);
                setIsTimerRunning(false);
                scramble.current = Scramble(selectedPuzzle.current);
                setScrambleDisplaymode("block");
                if (isAndroid) {
                    setTimeout(() => { // wait a little to not accidentally click something
                        setIsRestartButtonVisible(true);
                        document.body.classList.remove("nonSelectable");
                        setShouldFocusTimer("end");
                    }, 200);
                } else {
                    setIsRestartButtonVisible(true);
                }
            }
        };
        if (isTimerVisible) {
            setIsScreenLocked(true);
            document.addEventListener(prepareEvent, handlePrepare);
            document.addEventListener(startEvent, handleStart);
            document.addEventListener(abort, handleInterrupt);
            document.addEventListener(stopEvent, handleStop);
        } else {
            setIsScreenLocked(false);
            document.removeEventListener(prepareEvent, handlePrepare);
            document.removeEventListener(startEvent, handleStart);
            document.removeEventListener(abort, handleInterrupt);
            document.removeEventListener(stopEvent, handleStop);
        }
        return () => {
            setIsScreenLocked(false);
            document.removeEventListener(prepareEvent, handlePrepare);
            document.removeEventListener(startEvent, handleStart);
            document.removeEventListener(abort, handleInterrupt);
            document.removeEventListener(stopEvent, handleStop);
        };
    }, [isAndroid, isTimerPrepared, isTimerRunning, isTimerVisible, startTime]);

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

    useEffect(() => {
        if (focusTimer !== "" && isAndroid) {
            timer.current.scrollIntoView({
                block: focusTimer
            })
            setShouldFocusTimer("");
        }
    }, [isAndroid, focusTimer]);

    useEffect(() => {
        if (navigator.wakeLock) {
            if (shouldLockScreen) {
                navigator.wakeLock.request("screen");
            } else {
                navigator.wakeLock.release();
            }
        }
    }, [shouldLockScreen]);

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
        let timerValue = isTimerPrepared ? "0:00:000" : formatTime(elapsedTime);
        let timerClass = isTimerRunning ? "running-timer" : isTimerPrepared ? "green-timer" : "";
        return (
            <h3 id="timer" ref={timer} className={timerClass}>{timerValue}</h3>
        );
    };

    const renderAverages = () => {
        let averageDisplay = isTimerRunning || isTimerPrepared ? "none" : "grid";
        return (
            <>
                <div className="background" style={{ display: averageDisplay }}>
                    <h4>best {recentTimes.length > 0
                        ? formatTime(Math.min(...recentTimes))
                            .substring(0, EMPTY_TIMER.length)
                        : EMPTY_TIMER}</h4>
                    {isAndroid && window.matchMedia("(orientation: landscape)").matches && <h4> </h4>}
                    <h4>avg5 {recentTimes.length >= 5
                        ? formatTime(recentTimes.slice(-5)
                            .sort((a, b) => a - b)
                            .slice(1, -1)
                            .reduce((sum, time) => sum + time, 0) / 3)
                            .substring(0, EMPTY_TIMER.length)
                        : EMPTY_TIMER}</h4>
                    <h4>avg12 {recentTimes.length >= 12
                        ? formatTime(recentTimes.slice(-12)
                            .sort((a, b) => a - b)
                            .slice(1, -1)
                            .reduce((sum, time) => sum + time, 0) / 10)
                            .substring(0, EMPTY_TIMER.length)
                        : EMPTY_TIMER}</h4>
                    <h4 style={{ textAlign: "right" }}>{recentTimes.length >= 50
                        ? formatTime(recentTimes.slice(-50)
                            .reduce((sum, time) => sum + time, 0) / 50)
                            .substring(0, EMPTY_TIMER.length)
                        : EMPTY_TIMER} avg50</h4>
                    <h4 style={{ textAlign: "right" }}>{recentTimes.length >= 100
                        ? formatTime(recentTimes.slice(-100)
                            .reduce((sum, time) => sum + time, 0) / 100)
                            .substring(0, EMPTY_TIMER.length)
                        : EMPTY_TIMER} avg100</h4>
                </div>
            </>
        );
    }

    const formatTime = (elapsedTime) => {
        const minutes = parseInt(Math.floor(elapsedTime / 60000)).toString();
        const seconds = parseInt(Math.floor((elapsedTime % 60000) / 1000)).toString().padStart(2, '0');
        const milliseconds = parseInt((elapsedTime % 1000)).toString().padStart(3, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let puzzle = event.target.id;
        hideEverything();
        selectedPuzzle.current = puzzle;
        scramble.current = Scramble(puzzle);
        setScrambleDisplaymode("block");
        setIsTimerVisible(true);
        setIsRestartButtonVisible(true);
        setShouldFocusTimer("center");
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
        setStartTime(0);
        setElapsedTime(0);
        setIsTimerRunning(false);
        setIsFormVisible(true);
        setScrambleDisplaymode("none");
        setIsTimerVisible(false);
        setIsRestartButtonVisible(true);
        setRecentTimes([]);
    };

    return (
        <>
            <h1 id="rubikTimer">Rubik timer</h1>
            <div className="app rubikTimer">
                {isFormVisible && renderForm()}
                <div className="timerContainer">
                    {isTimerVisible && renderAverages()}
                    {<h2 id="scramble" className={selectedPuzzle.current} style={{ display: scrambleDisplayMode }}>{scramble.current}</h2>}
                    {isTimerVisible && renderTimer()}
                </div>
                {isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
            </div>
        </>
    );
};

export default RubikTimer;
