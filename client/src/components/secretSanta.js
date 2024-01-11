import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from 'react-bootstrap';
import "../assets/styles/secretSanta.css";

function SecretSanta() {
    const initialState = {
        participantCounter: 1,
        participants: [],
        targets: [],
        input: "",
        isFormVisible: true,
        isSavingVisible: false,
        isCalculatingVisible: false,
        isResettingVisible: false,
        isNoParticipantsVisible: false,
        isChosenVisible: false,
        isTargetVisible: false,
        isRestartButtonVisible: true,
        isParticipantListVisible: true,
    };

    const [state, setState] = useState(initialState);
    const inputRef = useRef(null);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    useEffect(() => {
        function focusForm() {
            if (!isMobile && state.isFormVisible) {
                inputRef.current.focus();
            }
        };
        window.addEventListener('focus', focusForm);
        focusForm();
        return () => {
            window.removeEventListener('focus', focusForm);
        };
    },);

    function setAppState(field, value) {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    function handleKeyDown(event) {
        event.preventDefault();
        setAppState("input", event.target.value);
    }

    function handleSubmit() {
        hideEverything();
        setAppState("isSavingVisible", true);
        if (state.input !== "") {
            setAppState("participants", [...state.participants, state.input]);
        }
        setTimeout(() => {
            setAppState("input", "");
            setAppState("isSavingVisible", false);
            setAppState("isFormVisible", true);
            setAppState("isRestartButtonVisible", true);
            setAppState("isParticipantListVisible", true);
        }, 1000);
    }

    function handleReset() {
        hideEverything();
        setAppState("isResettingVisible", true);
        setTimeout(() => {
            restoreDefaults();
            setAppState("isResettingVisible", false);
        }, 1000);
    }

    function handleStartLottery() {
        hideEverything();
        if (state.participants.length >= 3) {
            generateRandomCycle(state.participants);
            setAppState("isCalculatingVisible", true);
            setTimeout(() => {
                setAppState("isCalculatingVisible", false);
                setAppState("isChosenVisible", true);
                setAppState("isRestartButtonVisible", true);
                setAppState("isParticipantListVisible", true);
            }, 1000);
        } else {
            setAppState("isNoParticipantsVisible", true);
            setTimeout(() => {
                restoreDefaults();
                setAppState("isNoParticipantsVisible", false);
            }, 2000);
        }
    }

    function showTarget() {
        hideEverything();
        setAppState("isTargetVisible", true);
        setTimeout(() => {
            setAppState("isTargetVisible", false);
            setAppState("participantCounter", state.participantCounter + 1);
            if (state.participants.length > state.participantCounter) {
                setAppState("isChosenVisible", true);
                setAppState("isRestartButtonVisible", true);
            } else {
                restoreDefaults();
            }
        }, 2000);
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Label>Enter your name:</Form.Label>
                <Form.Control type="text" value={state.input} onChange={handleKeyDown} ref={inputRef} />
                <Button type="submit" variant="success">Add player</Button>
                <Button variant="success" onClick={handleStartLottery}>Start raffle</Button>
            </Form>
        );
    }

    function renderChosen() {
        return (
            <>
                <div>{state.participants[state.participantCounter - 1]} is the secret santa for...</div>
                <div>
                    <Button className="pressMeToShow" variant="success" onClick={showTarget}>
                        Press me to show!
                    </Button>
                </div>
            </>
        )
    }

    function renderTarget() {
        const participant = state.participants[state.participantCounter - 1];
        const target = state.targets[(state.targets.indexOf(participant) + 1) % state.participants.length];
        return (
            <>
                <h2 style={{ textAlign: "center" }}>{target}!</h2>
            </>
        );
    }

    function renderParticipantList() {
        return (
            <>
                <h2 style={{ marginTop: '20px' }}>Participants</h2>
                <div>
                    {state.participants.map((participant) => (
                        <div key={participant}>{participant}</div>
                    ))}
                </div>
            </>
        );
    }

    function generateRandomCycle(originalArray) {
        const unusedElements = [...originalArray];
        let newTargets = [];
        while (unusedElements.length !== 0) {
            const randomIndex = Math.floor(Math.random() * unusedElements.length);
            const newTarget = unusedElements[randomIndex].toString();
            newTargets = [...newTargets, newTarget];
            unusedElements.splice(randomIndex, 1);
        }
        setAppState("targets", newTargets);
    }

    function hideEverything() {
        setAppState("isFormVisible", false);
        setAppState("isSavingVisible", false);
        setAppState("isCalculatingVisible", false);
        setAppState("isResettingVisible", false);
        setAppState("isNoParticipantsVisible", false);
        setAppState("isChosenVisible", false);
        setAppState("isTargetVisible", false);
        setAppState("isRestartButtonVisible", false);
        setAppState("isParticipantListVisible", false);
    }

    function restoreDefaults() {
        setAppState("participantCounter", 1);
        setAppState("participants", []);
        setAppState("targets", []);
        setAppState("input", "");
        setAppState("isFormVisible", true);
        setAppState("isRestartButtonVisible", true);
        setAppState("isParticipantListVisible", true);
    }

    return (
        <>
            <h1 id="secretSanta">Secret Santa</h1>
            <div className="secretSanta">
                {state.isFormVisible && renderForm()}
                {state.isSavingVisible && (state.input !== "" ? <div>Saving...</div> : <div>Type a name</div>)}
                {state.isCalculatingVisible && <div>Calculating...</div>}
                {state.isResettingVisible && <div>Resetting...</div>}
                {state.isNoParticipantsVisible && (
                    <>
                        <div>Not enough participants</div>
                        <div>Deleting all previous data...</div>
                    </>
                )}
                {state.isChosenVisible && renderChosen()}
                {state.isTargetVisible && renderTarget()}
                {state.isRestartButtonVisible && <Button className="restart" onClick={handleReset}>Restart</Button>}
                {state.isParticipantListVisible && renderParticipantList()}
            </div>
        </>
    );
}

export default SecretSanta;
