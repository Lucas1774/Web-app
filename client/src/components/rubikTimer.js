import { useState, useEffect, useRef, useCallback } from "react";
import { Form, Button } from 'react-bootstrap';
import * as constants from "../constants";
import Scramble from "../scramblers/provider";
import { renderStats, formatTime } from "./statsHelper";
import Popup from "./popup";
import "../assets/styles/rubikTimer.css";
const RubikTimer = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);

    const [elapsedTime, setElapsedTime] = useState(0);
    const [scramble, setScramble] = useState("");
    const [isTimerPrepared, setIsTimerPrepared] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [scrambleDisplayMode, setScrambleDisplaymode] = useState("none");
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);
    const [isSelectMultiLengthVisible, setIsSelectMultiLengthVisible] = useState(false);
    const [isMultiQuantityInvalidVisible, setIsMultiQuantityInvalidVisible] = useState(false);
    const [isShowMoreStatsVisible, setIsShowMoreStatsVisible] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [focusTimer, setShouldFocusTimer] = useState("");
    const [focusFormLabel, setShouldFocusFormLabel] = useState("");
    const [recentTimes, setRecentTimes] = useState([]);
    const [recentScrambles, setRecentScrambles] = useState([]);
    const [isHorizontal, setIsHorizontal] = useState(window.matchMedia("(orientation: landscape)").matches && isAndroid);

    const startTime = useRef(0);
    const wakeLock = useRef(null);
    const selectedPuzzle = useRef("");
    const timer = useRef(null);
    const timerInterval = useRef(null)
    const isTouched = useRef(null);
    const isNewScramble = useRef(true);
    const multiQuantity = useRef(0);
    const formLabel = useRef(null);

    const handlePrepare = useCallback((event) => {
        if ((isAndroid && event.target.tagName !== "BUTTON" && event.target.tagName !== "INPUT")
            || (selectedPuzzle.current === constants.MULTI)
            || event.key === " ") {
            event.preventDefault();
            if (isAndroid) {
                isTouched.current = true;
            }
            setIsTimerPrepared(true);
            setIsShowMoreStatsVisible(false);
            setIsRestartButtonVisible(false);
            setScrambleDisplaymode("none");
        }
    }, [isAndroid]);

    const handleInterrupt = useCallback((event) => {
        if (isAndroid && isTouched.current) {
            event.preventDefault();
            setTimeout(() => {
                if (isTouched.current) {
                    isNewScramble.current = false;
                    setIsTimerPrepared(false);
                    setScrambleDisplaymode("block");
                    setIsShowMoreStatsVisible(true);
                    setIsRestartButtonVisible(true);
                }
            }, 100)
        } else if (event.key !== " ") {
            isNewScramble.current = false;
            event.preventDefault();
            setIsTimerPrepared(false);
            setScrambleDisplaymode("block");
            setIsShowMoreStatsVisible(true);
            setIsRestartButtonVisible(true);
        }
    }, [isAndroid]);

    const handleTouchAfterStop = useCallback((event) => {
        if (isTouched.current) {
            event.preventDefault();
            setTimeout(() => {
                isTouched.current = false;
            }, 100)
        }
    }, []);

    const handleStart = useCallback((event) => {
        if (isAndroid || event.key === " ") {
            event.preventDefault();
            isTouched.current = false;
            const now = performance.now(); // instant time fetch
            startTime.current = now;
            timerInterval.current = setInterval(() => {
                setElapsedTime(performance.now() - now);
            }, constants.TIMER_REFRESH_RATE);
            setIsTimerPrepared(false);
            setIsTimerRunning(true);
            if (isAndroid) {
                setShouldFocusTimer("center");
            }
        };
    }, [isAndroid]);

    const handleStop = useCallback((event) => {
        if ((isAndroid || event.key !== "Escape")) {
            event.preventDefault();
            const now = performance.now(); // instant time fetch
            clearInterval(timerInterval.current);
            const finalTime = now - startTime.current;
            setElapsedTime(finalTime);
            setRecentTimes((previousTimes) => [...previousTimes, finalTime]);
            setRecentScrambles((previousScrambles) => [...previousScrambles, scramble]);
            setIsTimerRunning(false);
            isNewScramble.current = true;
            setScrambleDisplaymode("block");
            if (isAndroid) {
                isTouched.current = true;
                setTimeout(() => {
                    setShouldFocusTimer("end");
                });
                setTimeout(() => {
                    setIsShowMoreStatsVisible(true);
                    setIsRestartButtonVisible(true);
                }, 300);
            } else {
                setIsShowMoreStatsVisible(true);
                setIsRestartButtonVisible(true);
            }
        }
    }, [isAndroid, scramble]);

    // Set up prepare event listener
    useEffect(() => {
        const prepareTrigger = isAndroid ? "touchstart" : "keydown";
        if (isTimerVisible && !isTimerRunning && !isTimerPrepared && (selectedPuzzle.current !== constants.MULTI || !isAndroid)) {
            setTimeout(() => {
                document.addEventListener(prepareTrigger, handlePrepare);
            }, 300)
        } else {
            document.removeEventListener(prepareTrigger, handlePrepare);
        }
        return () => {
            document.removeEventListener(prepareTrigger, handlePrepare);
        }
    }, [handlePrepare, isAndroid, isTimerPrepared, isTimerRunning, isTimerVisible]);

    // Set up interrupt event listener
    useEffect(() => {
        const abortTrigger = isAndroid ? "touchmove" : "keydown";
        if (isTimerPrepared) {
            document.addEventListener(abortTrigger, handleInterrupt, { passive: false });
        } else {
            document.removeEventListener(abortTrigger, handleInterrupt);
        }
        return () => {
            document.removeEventListener(abortTrigger, handleInterrupt);
        }
    }, [handleInterrupt, isAndroid, isTimerPrepared]);

    // Set up drag after stop event listener
    useEffect(() => {
        const dragAfterStopTrigger = "touchmove";
        if (isTimerVisible && isAndroid) {
            document.addEventListener(dragAfterStopTrigger, handleTouchAfterStop, { passive: false });
        } else {
            document.removeEventListener(dragAfterStopTrigger, handleTouchAfterStop);
        }
        return () => {
            document.removeEventListener(dragAfterStopTrigger, handleTouchAfterStop);
        }
    }, [handleTouchAfterStop, isAndroid, isTimerVisible]);

    // Set up start event listener
    useEffect(() => {
        const startTrigger = isAndroid ? "touchend" : "keyup";
        if (isTimerPrepared) {
            document.addEventListener(startTrigger, handleStart);
        } else {
            document.removeEventListener(startTrigger, handleStart);
        }
        return () => {
            document.removeEventListener(startTrigger, handleStart);
        }
    }, [handleStart, isAndroid, isTimerPrepared]);

    // Set up stop event listener
    useEffect(() => {
        const stopTrigger = isAndroid ? "touchstart" : "keydown";
        if (isTimerRunning) {
            document.addEventListener(stopTrigger, handleStop);
        } else {
            document.removeEventListener(stopTrigger, handleStop);
        }
        return () => {
            document.removeEventListener(stopTrigger, handleStop);
        }
    }, [handleStop, isAndroid, isTimerRunning, scramble]);

    // Set up non-selectable document
    useEffect(() => {
        if (isTimerVisible) {
            document.body.classList.add("nonSelectable");
        } else {
            document.body.classList.remove("nonSelectable");
        }
        return () => {
            document.body.classList.remove("nonSelectable");
        };
    }, [isTimerVisible]);

    // Set up screen lock
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
        if (isTimerVisible || isTimerPrepared || isTimerRunning) { // small hack to screen lock after phone unlock
            requestWakeLock();
        } else {
            wakeLock.current?.release();
        }
        return () => {
            wakeLock.current?.release();
        };
    }, [isTimerPrepared, isTimerRunning, isTimerVisible]); // extra dependencies to trigger the effect

    // Set up orientation change event listener
    useEffect(() => {
        const resizeTrigger = "resize";
        const handleOrientationChange = () => {
            if (isTimerVisible) {
                setShouldFocusTimer(isTimerRunning ? "center" : "end");
                setIsHorizontal(window.matchMedia("(orientation: landscape)").matches);
            }
            if (isSelectMultiLengthVisible) {
                setShouldFocusFormLabel("start");
            }
        }
        if (isAndroid) {
            window.addEventListener(resizeTrigger, handleOrientationChange);
        } else {
            window.removeEventListener(resizeTrigger, handleOrientationChange);
        }
        return () => {
            window.removeEventListener(resizeTrigger, handleOrientationChange);
        }
    }, [isAndroid, isSelectMultiLengthVisible, isTimerRunning, isTimerVisible]);

    // Set up escape press event listener
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
        if (focusTimer !== "" && timer.current) {
            timer.current.scrollIntoView({
                block: focusTimer
            })
            setShouldFocusTimer("");
        }
    }, [focusTimer]);

    // Auto-scroll effect
    useEffect(() => {
        if (focusFormLabel !== "") {
            formLabel.current.scrollIntoView({
                block: focusFormLabel
            })
            setShouldFocusFormLabel("");
        }
    }, [isAndroid, focusFormLabel]);

    const renderForm = () => {
        return (
            <>
                <Form>
                    <Button className="thirty-percent" id={constants.THREE} onClick={handleSubmit}>3x3</Button>
                    <Button className="thirty-percent" id={constants.TWO} onClick={handleSubmit}>2x2</Button>
                    <Button className="thirty-percent" id={constants.FOUR} onClick={handleSubmit}>4x4</Button>
                    <Button className="thirty-percent" id={constants.FIVE} onClick={handleSubmit}>5X5</Button>
                    <Button className="thirty-percent" id={constants.SEVEN} onClick={handleSubmit}>7X7</Button>
                    <Button className="thirty-percent" id={constants.SIX} onClick={handleSubmit}>6X6</Button>
                    <Button className="thirty-percent" id={constants.BLD} onClick={handleSubmit}>BLD</Button>
                    <Button className="thirty-percent" id={constants.FMC} onClick={handleSubmit}>FMC</Button>
                    <Button className="thirty-percent" id={constants.OH} onClick={handleSubmit}>OH</Button>
                    <Button className="thirty-percent" id={constants.CLOCK} onClick={handleSubmit}>Clock</Button>
                    <Button className="thirty-percent" id={constants.MEGAMINX} onClick={handleSubmit}>Mega</Button>
                    <Button className="thirty-percent" id={constants.PYRAMINX} onClick={handleSubmit}>Pyra</Button>
                    <Button className="thirty-percent" id={constants.SKEWB} onClick={handleSubmit}>Skewb</Button>
                    <Button className="thirty-percent" id={constants.SQUARE} onClick={handleSubmit}>Sq-1</Button>
                    <Button className="thirty-percent" id={constants.FOUR_BLD} onClick={handleSubmit}>4BLD</Button>
                    <Button className="fifty-percent" id={constants.FIVE_BLD} onClick={handleSubmit}>5BLD</Button>
                    <Button className="fifty-percent" id={constants.MULTI_UNPROCESSED} onClick={handleSubmit}>Multi</Button>
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
            { label: "best", length: 1, what: "best", removeBestAndWorst: false, align: "left" },
            { label: "mo3", length: 3, what: "last", removeBestAndWorst: false, align: "left" },
            { label: "avg5", length: 5, what: "last", removeBestAndWorst: true, align: "left" },
            { label: "avg12", length: 12, what: "last", removeBestAndWorst: true, align: isHorizontal ? "left" : "right" },
            { label: "mo50", length: 50, what: "last", removeBestAndWorst: false, align: "right" },
            { label: "mo100", length: 100, what: "last", removeBestAndWorst: false, align: "right" },
        ];
        return renderStats({ times: recentTimes, averageDisplay: averageDisplay, className: "background", params: params });
    };

    const renderSelectMultiLength = () => {
        return (
            <>
                <Form id={constants.MULTI} onSubmit={handleSubmit}>
                    <Form.Label ref={formLabel}>Number of scrambles:</Form.Label>
                    <Form.Control inputMode="numeric" onChange={(event) => multiQuantity.current = event.target.value} />
                    <Button type="submit" variant="success">Generate</Button>
                </Form>
            </>
        );
    };

    const renderScramble = () => {
        return (
            <>
                <Scramble
                    isNewScramble={isNewScramble.current}
                    onScrambleChange={(s) => { setScramble(s); isNewScramble.current = false }}
                    puzzle={selectedPuzzle.current}
                    display={scrambleDisplayMode}
                    quantity={multiQuantity.current}>
                </Scramble>
            </>
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let puzzle = event.target.id;
        if (puzzle === constants.MULTI_UNPROCESSED) {
            hideEverything();
            setIsSelectMultiLengthVisible(true);
            setIsRestartButtonVisible(true);
            if (isAndroid) {
                setShouldFocusFormLabel("start");
            }
        } else {
            if (constants.MULTI === puzzle && (isNaN(multiQuantity.current) || multiQuantity.current < 1 || multiQuantity.current > 200)) {
                hideEverything();
                setIsMultiQuantityInvalidVisible(true);
                setTimeout(() => {
                    setIsMultiQuantityInvalidVisible(false);
                    setIsSelectMultiLengthVisible(true);
                    setIsRestartButtonVisible(true);
                    if (isAndroid) {
                        setShouldFocusFormLabel("start");
                    }
                }, 1000)
                return;
            }
            hideEverything();
            selectedPuzzle.current = puzzle;
            setScrambleDisplaymode("block");
            setIsTimerVisible(true);
            if (isAndroid) {
                setTimeout(() => {
                    setShouldFocusTimer("end");
                });
            }
            setIsShowMoreStatsVisible(true);
            setIsRestartButtonVisible(true);
        }
    };

    const hideEverything = () => {
        setIsFormVisible(false);
        setScrambleDisplaymode("none");
        setIsTimerVisible(false);
        setIsRestartButtonVisible(false);
        setIsSelectMultiLengthVisible(false);
        setIsMultiQuantityInvalidVisible(false);
        setIsShowMoreStatsVisible(false);
        setIsPopupVisible(false);
    };

    const restoreDefaults = () => {
        setElapsedTime(0);
        setScramble("");
        setIsTimerPrepared(false);
        setIsTimerRunning(false);
        setIsFormVisible(true);
        setScrambleDisplaymode("none");
        setIsTimerVisible(false);
        setIsRestartButtonVisible(true);
        setIsSelectMultiLengthVisible(false);
        setIsMultiQuantityInvalidVisible(false);
        setIsShowMoreStatsVisible(false);
        setIsPopupVisible(false);
        setRecentTimes([]);
        setRecentScrambles([]);
        startTime.current = 0;
        selectedPuzzle.current = "";
        isTouched.current = false;
        isNewScramble.current = true;
        multiQuantity.current = 0;
    };

    return (
        <>
            <h1 id="rubikTimer">Rubik timer</h1>
            <div className="app rubikTimer">
                {isFormVisible && renderForm()}
                {isSelectMultiLengthVisible && renderSelectMultiLength()}
                {isMultiQuantityInvalidVisible && <h2>Enter a number between 1 and 200</h2>}
                <div className="timerContainer">
                    {isPopupVisible
                        ? <>
                            <Popup
                                content={{ recentTimes: recentTimes, recentScrambles: recentScrambles }}
                                onPopupClose={() => {
                                    setIsPopupVisible(false);
                                    setScrambleDisplaymode("block");
                                    setIsTimerVisible(true);
                                    setIsShowMoreStatsVisible(true);
                                }}>
                            </Popup>
                            {renderScramble()}
                        </>
                        : <>
                            {(isTimerVisible && renderAverages())}
                            {renderScramble()}
                            {(isTimerVisible && renderTimer())}
                        </>
                    }
                </div>
                <Button style={{ display: isShowMoreStatsVisible && isAndroid && selectedPuzzle.current === constants.MULTI ? "block" : "none" }} variant="success" onTouchStart={handlePrepare}>Start</Button>
                {isShowMoreStatsVisible && <Button onClick={() => {
                    setIsShowMoreStatsVisible(false);
                    setIsTimerVisible(false);
                    setScrambleDisplaymode("none");
                    setIsPopupVisible(true);
                }}>Session stats</Button>}
                {isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
            </div>
        </>
    );
};

export default RubikTimer;
