import { useState, useEffect, useRef } from "react";
import { Form, Button } from 'react-bootstrap';
import { EMPTY_TIMER, TWO, THREE, FOUR, FIVE, BLD, MULTI, PYRAMINX, MEGAMINX } from "../constants";
import Scramble from "../scramblers/provider";
import "../assets/styles/rubikTimer.css";

const TIMER_REFRESH_RATE = 50;
const MULTI_UNPROCESSED = "MULTI_UNPROCESSED";

const RubikTimer = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);

    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerPrepared, setIsTimerPrepared] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [scrambleDisplayMode, setScrambleDisplaymode] = useState("none");
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);
    const [isSelectMultiLengthVisible, setIsSelectMultiLengthVisible] = useState(false);
    const [isMultiQuantityInvalidVisible, setIsMultiQuantityInvalidVisible] = useState(false);
    const [focusTimer, setShouldFocusTimer] = useState("");
    const [recentTimes, setRecentTimes] = useState([]);
    const [isHorizontal, setIsHorizontal] = useState(window.matchMedia("(orientation: landscape)").matches && isAndroid);

    const startTime = useRef(0);
    const wakeLock = useRef(null);
    const selectedPuzzle = useRef("");
    const timer = useRef(null);
    const timerInterval = useRef(null)
    const isTouched = useRef(null);
    const newScramble = useRef(true);
    const multiQuantity = useRef(0);

    useEffect(() => {
        const prepareTrigger = isAndroid ? "touchstart" : "keydown";
        const handlePrepare = (event) => {
            if ((isAndroid && event.target.tagName !== "BUTTON" && event.target.tagName !== "INPUT") || event.key === " ") {
                event.preventDefault();
                if (isAndroid) {
                    isTouched.current = true;
                }
                setIsTimerPrepared(true);
                setIsRestartButtonVisible(false);
                setScrambleDisplaymode("none");
            }
        };
        if (isTimerVisible && !isTimerRunning && !isTimerPrepared) {
            setTimeout(() => {
                document.addEventListener(prepareTrigger, handlePrepare);
            }, 200)
        } else {
            document.removeEventListener(prepareTrigger, handlePrepare);
        }
        return () => {
            document.removeEventListener(prepareTrigger, handlePrepare);
        }
    }, [isAndroid, isTimerPrepared, isTimerRunning, isTimerVisible])

    useEffect(() => {
        const abortTrigger = isAndroid ? "touchmove" : "keydown";
        const handleInterrupt = (event) => {
            if (isAndroid && isTouched.current) {
                event.preventDefault();
                setTimeout(() => {
                    if (isTouched.current) {
                        newScramble.current = false;
                        setIsTimerPrepared(false);
                        setScrambleDisplaymode("block");
                        setIsRestartButtonVisible(true);
                    }
                }, 100)
            } else if (event.key !== " ") {
                newScramble.current = false;
                event.preventDefault();
                setIsTimerPrepared(false);
                setScrambleDisplaymode("block");
                setIsRestartButtonVisible(true);
            }
        }
        if (isTimerPrepared) {
            document.addEventListener(abortTrigger, handleInterrupt, { passive: false });
        } else {
            document.removeEventListener(abortTrigger, handleInterrupt);
        }
        return () => {
            document.removeEventListener(abortTrigger, handleInterrupt);
        }
    }, [isAndroid, isTimerPrepared])

    useEffect(() => {
        const dragAfterStopTrigger = "touchmove";
        const handleTouchAfterStop = (event) => {
            if (isTouched.current) {
                event.preventDefault();
                setTimeout(() => {
                    isTouched.current = false;
                }, 100)
            }
        }
        if (isTimerVisible && isAndroid) {
            document.addEventListener(dragAfterStopTrigger, handleTouchAfterStop, { passive: false });
        } else {
            document.removeEventListener(dragAfterStopTrigger, handleTouchAfterStop);
        }
        return () => {
            document.removeEventListener(dragAfterStopTrigger, handleTouchAfterStop);
        }
    }, [isAndroid, isTimerVisible]);

    useEffect(() => {
        const startTrigger = isAndroid ? "touchend" : "keyup";
        const handleStart = (event) => {
            if (isAndroid || event.key === " ") {
                event.preventDefault();
                isTouched.current = false;
                const now = performance.now(); // instant time fetch
                startTime.current = now;
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
        if (isTimerPrepared) {
            document.addEventListener(startTrigger, handleStart);
        } else {
            document.removeEventListener(startTrigger, handleStart);
        }
        return () => {
            document.removeEventListener(startTrigger, handleStart);
        }
    }, [isAndroid, isTimerPrepared]);

    useEffect(() => {
        const stopTrigger = isAndroid ? "touchstart" : "keydown";
        const handleStop = (event) => {
            if ((isAndroid || event.key !== "Escape")) {
                event.preventDefault();
                const now = performance.now(); // instant time fetch
                clearInterval(timerInterval.current);
                const finalTime = now - startTime.current;
                setElapsedTime(finalTime);
                setRecentTimes((previousTimes) => [...previousTimes, finalTime]);
                setIsTimerRunning(false);
                newScramble.current = true;
                setScrambleDisplaymode("block");
                if (isAndroid) {
                    isTouched.current = true;
                    setShouldFocusTimer("end");
                }
                setIsRestartButtonVisible(true);
            }
        };
        if (isTimerRunning) {
            document.addEventListener(stopTrigger, handleStop);
        } else {
            document.removeEventListener(stopTrigger, handleStop);
        }
        return () => {
            document.removeEventListener(stopTrigger, handleStop);
        }
    }, [isAndroid, isTimerRunning])

    useEffect(() => {
        if (isTimerVisible || isTimerPrepared || isTimerRunning) { // small hack to screen lock after phone unlock
            document.body.classList.add("nonSelectable");
        } else {
            wakeLock.current?.release();
        }
        return () => {
            wakeLock.current?.release();
        };
    }, [isTimerPrepared, isTimerRunning, isTimerVisible])


    useEffect(() => {
        async function requestWakeLock() {
            if (navigator.wakeLock) {
                try {
                    wakeLock.current = await navigator.wakeLock.request('screen');
                } catch (error) {
                    console.error(error);
                }
            }
        };
        if (isTimerVisible) {
            requestWakeLock();
            document.body.classList.add("nonSelectable");
        } else {
            wakeLock.current?.release();
            document.body.classList.remove("nonSelectable");
        }
        return () => {
            wakeLock.current?.release();
            document.body.classList.remove("nonSelectable");
        };
    }, [isTimerPrepared, isTimerRunning, isTimerVisible]) // extra dependencies to trigger the effect

    useEffect(() => {
        const resizeTrigger = "resize";
        const handleOrientationChange = () => {
            setShouldFocusTimer(isTimerRunning ? "center" : "end");
            if (!isTimerRunning) {
                setIsHorizontal(window.matchMedia("(orientation: landscape)").matches);
            }
        }
        if (isAndroid && isTimerVisible) {
            if (!isTimerRunning) {
                setIsHorizontal(window.matchMedia("(orientation: landscape)").matches);
            }
            window.addEventListener(resizeTrigger, handleOrientationChange);
        } else {
            window.removeEventListener(resizeTrigger, handleOrientationChange);
        }
        return () => {
            window.removeEventListener(resizeTrigger, handleOrientationChange);
        }
    }, [isAndroid, isTimerRunning, isTimerVisible])

    useEffect(() => {
        const goBackTrigger = "keydown"
        const handleGoBack = (event) => {
            if (event.key === "Escape") {
                hideEverything();
                restoreDefaults();
            }
        };
        if ((isTimerVisible || isFormVisible) && !isAndroid) {
            document.addEventListener(goBackTrigger, handleGoBack);
        } else {
            document.removeEventListener(goBackTrigger, handleGoBack);
        };
        return () => {
            document.removeEventListener(goBackTrigger, handleGoBack);
        };
    }, [isAndroid, isFormVisible, isTimerVisible]);

    useEffect(() => {
        if (focusTimer !== "" && isAndroid) {
            timer.current.scrollIntoView({
                block: focusTimer
            })
            setShouldFocusTimer("");
        }
    }, [isAndroid, focusTimer]);

    const renderForm = () => {
        return (
            <>
                <Form>
                    <Button className="fifty-percent" id={TWO} onClick={handleSubmit}>2x2</Button>
                    <Button className="fifty-percent" id={THREE} onClick={handleSubmit}>3x3</Button>
                    <Button className="fifty-percent" id={FOUR} onClick={handleSubmit}>4x4</Button>
                    <Button className="fifty-percent" id={FIVE} onClick={handleSubmit}>5X5</Button>
                    <Button className="fifty-percent" id={BLD} onClick={handleSubmit}>BLD</Button>
                    <Button className="fifty-percent" id={MULTI_UNPROCESSED} onClick={handleSubmit}>MultiBLD</Button>
                    <Button className="fifty-percent" id={PYRAMINX} onClick={handleSubmit}>Pyraminx</Button>
                    <Button className="fifty-percent" id={MEGAMINX} onClick={handleSubmit}>Megaminx</Button>
                </Form>
            </>
        );
    };

    const renderTimer = () => {
        let timerValue = isTimerPrepared ? "0:00:000" : formatTime(elapsedTime);
        let timerClass = isTimerRunning ? "running-timer" : isTimerPrepared ? "green-timer" : "";
        return (
            <h3 ref={timer} className={timerClass}>{timerValue}</h3>
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
                        <h4 key={label} style={{ textAlign: align }}>{align === "left" ? label + " " + displayTime : displayTime + " " + label}</h4>
                    );
                })}
            </div>
        );
    }

    const renderSelectMultiLength = () => {
        return (
            <>
                <Form id={MULTI} onSubmit={handleSubmit}>
                    <Form.Label>Number of scrambles:</Form.Label>
                    <Form.Control inputMode="numeric" onChange={(event) => multiQuantity.current = event.target.value} />
                    <Button type="submit" variant="success">Generate</Button>
                </Form>
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
        if (puzzle === MULTI_UNPROCESSED) {
            hideEverything();
            setIsSelectMultiLengthVisible(true);
            setIsRestartButtonVisible(true);
        } else {
            if (MULTI === puzzle && (isNaN(multiQuantity.current) || multiQuantity.current < 1 || multiQuantity.current > 200)) {
                hideEverything();
                setIsMultiQuantityInvalidVisible(true);
                setTimeout(() => {
                    setIsMultiQuantityInvalidVisible(false);
                    setIsSelectMultiLengthVisible(true);
                    setIsRestartButtonVisible(true);
                }, 1000)
                return;
            }
            hideEverything();
            selectedPuzzle.current = puzzle;
            setScrambleDisplaymode("block");
            setIsTimerVisible(true);
            if (isAndroid) {
                setShouldFocusTimer("end");
            }
            setIsRestartButtonVisible(true);
        }
    };

    const hideEverything = () => {
        setIsFormVisible(false);
        setScrambleDisplaymode("none");
        setIsTimerVisible(false);
        setIsRestartButtonVisible(false);
        setIsSelectMultiLengthVisible(false);
    };

    const restoreDefaults = () => {
        selectedPuzzle.current = "";
        startTime.current = 0;
        newScramble.current = true;
        setElapsedTime(0);
        setIsTimerRunning(false);
        setIsFormVisible(true);
        setScrambleDisplaymode("none");
        setIsTimerVisible(false);
        setIsRestartButtonVisible(true);
        setIsSelectMultiLengthVisible(false);
        setRecentTimes([]);
    };

    return (
        <>
            <h1 id="rubikTimer">Rubik timer</h1>
            <div className="app rubikTimer">
                {isFormVisible && renderForm()}
                {isSelectMultiLengthVisible && renderSelectMultiLength()}
                {isMultiQuantityInvalidVisible && <h2>Enter a number between 1 and 200</h2>}
                <div className="timerContainer">
                    {isTimerVisible && renderAverages()}
                    <Scramble puzzle={selectedPuzzle.current} display={scrambleDisplayMode} new={newScramble.current} quantity={multiQuantity.current} />
                    {isTimerVisible && renderTimer()}
                </div>
                {isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
            </div>
        </>
    );
};

export default RubikTimer;
