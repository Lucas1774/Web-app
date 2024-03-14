import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import "../assets/styles/secretSanta.css";

const SecretSanta = () => {

    const initialState = {
        participantCounter: 1,
        participants: [],
        targets: [],
        input: "",
        isFormVisible: true,
        isSavingVisible: false,
        isCalculatingVisible: false,
        isNoParticipantsVisible: false,
        isChosenVisible: false,
        isTargetVisible: false,
        isRestartButtonVisible: true,
        isParticipantListVisible: true,
    };

    const [state, setState] = useState(initialState);

    const setAppState = (field, value) => {

        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleKeyDown = (event) => {

        event.preventDefault();
        setAppState("input", event.target.value);
    }

    const handleSubmit = (event) => {

        event.preventDefault();
        hideEverything();
        setAppState("isSavingVisible", true);
        let delay = 1000
        if (state.input !== "" && !state.participants.includes(state.input)) {
            setAppState("participants", [...state.participants, state.input]);
            delay = 0;
        }
        setTimeout(() => {
            setAppState("input", "");
            setAppState("isSavingVisible", false);
            setAppState("isFormVisible", true);
            setAppState("isRestartButtonVisible", true);
            setAppState("isParticipantListVisible", true);
        }, delay);
    }

    const handleStartLottery = () => {

        hideEverything();
        if (state.participants.length >= 3) {
            generateRandomCycle(state.participants);
            setAppState("isCalculatingVisible", true);
            setTimeout(() => {
                setAppState("isCalculatingVisible", false);
                setAppState("isChosenVisible", true);
                setAppState("isRestartButtonVisible", true);
            }, 1000);
        } else {
            setAppState("isNoParticipantsVisible", true);
            setTimeout(() => {
            setAppState("input", "");
            setAppState("isSavingVisible", false);
            setAppState("isFormVisible", true);
            setAppState("isRestartButtonVisible", true);
            setAppState("isParticipantListVisible", true);
                setAppState("isNoParticipantsVisible", false);
            }, 1000);
        }
    }

    const showTarget = () => {

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

    const renderForm = () => {

        return (
            <Form onSubmit={handleSubmit}>
                <Form.Label>Enter your name:</Form.Label>
                <Form.Control type="text" value={state.input} onChange={handleKeyDown} />
                <Button type="submit" variant="success">Add player</Button>
                <Button variant="success" onClick={handleStartLottery}>Start raffle</Button>
            </Form>
        );
    }

    const renderChosen = () => {

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

    const renderTarget = () => {

        const participant = state.participants[state.participantCounter - 1];
        const target = state.targets[(state.targets.indexOf(participant) + 1) % state.participants.length];
        return (
            <>
                <h2 style={{ textAlign: "center" }}>{target}!</h2>
            </>
        );
    }

    const renderParticipantList = () => {

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

    const generateRandomCycle = (originalArray) => {

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

    const hideEverything = () => {

        setAppState("isFormVisible", false);
        setAppState("isSavingVisible", false);
        setAppState("isCalculatingVisible", false);
        setAppState("isNoParticipantsVisible", false);
        setAppState("isChosenVisible", false);
        setAppState("isTargetVisible", false);
        setAppState("isRestartButtonVisible", false);
        setAppState("isParticipantListVisible", false);
    }

    const restoreDefaults = () => {

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
            <div className="app secretSanta">
                {state.isFormVisible && renderForm()}
                {state.isSavingVisible && (state.input === ""
                    ? <div>Type a name</div> : state.participants.includes(state.input)
                        ? <div>Player already registered</div> : <div></div>)}
                {state.isCalculatingVisible && <div>Calculating...</div>}
                {state.isNoParticipantsVisible && (
                    <>
                        <div>Not enough participants</div>
                    </>
                )}
                {state.isChosenVisible && renderChosen()}
                {state.isTargetVisible && renderTarget()}
                {state.isRestartButtonVisible && <Button className="restart" onClick={() => { hideEverything(); restoreDefaults(); }}
                >Restart</Button>}
                {state.isParticipantListVisible && renderParticipantList()}
            </div>
        </>
    );
}

export default SecretSanta;
