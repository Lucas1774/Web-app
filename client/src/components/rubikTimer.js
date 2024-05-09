import { useState, useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import { EMPTY_TIMER, TWO, THREE, BLD, MEGAMINX } from "../constants";
import Scramble from "../scramblers/provider";
import "../assets/styles/rubikTimer.css";

const TIMER_REFRESH_RATE = 50;

const RubikTimer = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);

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
    const [isHorizontal, setIsHorizontal] = useState(window.matchMedia("(orientation: landscape)").matches && isAndroid);

    const wakeLock = useRef(null);
    const selectedPuzzle = useRef("");
    const scramble = useRef(null);
    const timer = useRef(null);
    const timerInterval = useRef(null)

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
        const handleOrientationChange = () => {
            setIsHorizontal(window.matchMedia("(orientation: landscape)").matches && isAndroid);
        }
        window.addEventListener('resize', handleOrientationChange);
        return () => {
            window.removeEventListener('resize', handleOrientationChange);
        }
    }, [isAndroid])

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
        async function requestWakeLock() {
            try {
                wakeLock.current = await navigator.wakeLock.request('screen');
            } catch (error) {
                console.error(error);
            }
        }
        if (navigator.wakeLock && shouldLockScreen) {
            requestWakeLock();
        } else if (wakeLock.current) {
            wakeLock.current.release();
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
        const averageDisplay = isTimerRunning || isTimerPrepared ? "none" : "grid";
        const params = [
            { label: "best", length: 1, removeBestAndWorst: false, align: "left" },
            { label: "mo3", length: 3, removeBestAndWorst: false, align: "left" },
            { label: "avg5", length: 5, removeBestAndWorst: true, align: "left" },
            { label: "avg12", length: 12, removeBestAndWorst: true, align: isHorizontal ? "left" : "right" },
            { label: "mo50", length: 50, removeBestAndWorst: false, align: "right" },
            { label: "mo100", length: 100, removeBestAndWorst: false, align: "right" },
        ];
        return (
            <div className="background" style={{ display: averageDisplay }}>
                {params.map(({ label, length, removeBestAndWorst, align }) => {
                    let displayTime = EMPTY_TIMER;
                    if (removeBestAndWorst) {
                        if (recentTimes.length === length - 1) { // 4/5, 11/12 -> make average without best
                            displayTime = formatTime(recentTimes.sort((a, b) => a - b)
                                .slice(1)
                                .reduce((sum, time) => sum + time, 0) / (length - 2));
                        } else if (recentTimes.length >= length) { // otherwise -> make average without best and worst
                            displayTime = formatTime(recentTimes.slice(-length)
                                .sort((a, b) => a - b)
                                .slice(1, -1)
                                .reduce((sum, time) => sum + time, 0) / (length - 2));
                        }
                    } else if (recentTimes.length >= length) {
                        if (length === 1) { // best -> pick
                            displayTime = formatTime(Math.min(...recentTimes));
                        } else { // otherwise -> make mean
                            displayTime = formatTime(recentTimes.slice(-length)
                                .reduce((sum, time) => sum + time, 0) / length);
                        }
                    }
                    return (
                        <h4 style={{ textAlign: align }}>{align === "left" ? label + " " + displayTime : displayTime + " " + label}</h4>
                    );
                })}
            </div>
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
        setShouldFocusTimer("end");
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
