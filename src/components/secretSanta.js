import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from 'react-bootstrap';
import "../assets/styles/secretSanta.css";

function SecretSanta() {
    const [participantCounter, setParticipantCounter] = useState(1);
    const [participants, setParticipants] = useState([]);
    const [targets, setTargets] = useState([]);
    const [input, setInput] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isSavingVisible, setIsSavingVisible] = useState(false);
    const [isCalculatingVisible, setIsCalculatingVisible] = useState(false);
    const [isChosenVisible, setIsChosenVisible] = useState(false);
    const [isTargetVisible, setIsTargetVisible] = useState(false);
    const [isRestartButtonVisible, setIsRestartButtonVisible] = useState(true);
    const inputRef = useRef(null);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    useEffect(() => {
        if (!isMobile && inputRef.current) {
            inputRef.current.focus();
            const handleWindowFocus = () => {
                inputRef.current.focus();
            };
            window.addEventListener('focus', handleWindowFocus);
            return () => {
                window.removeEventListener('focus', handleWindowFocus);
            };
        }
    },);

    function handleKeyDown(event) {
        event.preventDefault();
        setInput(event.target.value);
    }

    function handleSubmit() {
        setParticipants((prevCollection) => [...prevCollection, input]);
        setIsFormVisible(false);
        setIsSavingVisible(true);
        setTimeout(() => {
            setIsSavingVisible(false);
            setIsFormVisible(true);
            setInput("");
        }, 1000);
    }

    function handleStartLottery() {
        generateRandomCycle(participants);
        setIsFormVisible(false);
        setIsCalculatingVisible(true);
        setTimeout(() => {
            setIsCalculatingVisible(false);
            setIsChosenVisible(true);
        }, 1000);
    }

    function showTarget() {
        setIsChosenVisible(false);
        setIsTargetVisible(true);
        setTimeout(() => {
            setIsTargetVisible(false);
            setParticipantCounter(prevCounter => prevCounter + 1);
            if (participants.length > participantCounter) {
                setIsChosenVisible(true);
            } else {
                restoreDefaults();
            }
        }, 1000);
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Label>Enter your name:</Form.Label>
                <Form.Control type="text" value={input} onChange={handleKeyDown} ref={inputRef} />
                <Button type="submit">Add player</Button>
                <Button onClick={handleStartLottery}>Start raffle</Button>
            </Form>
        );
    }

    function renderSaving() {
        return <div>Saving...</div>;
    }

    function renderCalculating() {
        return <div>Calculating...</div>;
    }

    function renderChosen() {
        return (
            <>
                <div>{participants[participantCounter - 1]} is the secret santa for...</div>
                <div><Button className="pressMeToShow" type="submit" variant="success" onClick={showTarget}>Press me to show!</Button></div>
            </>
        );
    }

    function renderTarget() {
        const participant = participants[participantCounter - 1];
        const target = targets[(targets.indexOf(participant) + 1) % participants.length];
        return (
            <>
                <div>{participant} is the secret santa for...</div>
                <div>{target}</div>
            </>
        );
    }

    function generateRandomCycle(originalArray) {
        const unusedElements = [...originalArray];
        while (unusedElements.length !== 0) {
            const randomIndex = Math.floor(Math.random() * unusedElements.length);
            const newTarget = unusedElements[randomIndex].toString();
            setTargets((prevCollection) => [...prevCollection, newTarget]);
            unusedElements.splice(randomIndex, 1);
        }
    }

    function restoreDefaults() {
        setInput("");
        setParticipantCounter(1);
        setParticipants([]);
        setTargets([]);
        setIsFormVisible(false);
        setIsSavingVisible(false);
        setIsCalculatingVisible(false);
        setIsChosenVisible(false);
        setIsTargetVisible(false);
        setIsRestartButtonVisible(false);
        setTimeout(() => {
            setIsFormVisible(true);
            setIsRestartButtonVisible(true);

        }, 1000);
    }

    return (
        <>
            <h1 id="secretSanta">Secret Santa</h1>
            <div className="secretSanta">
                {isFormVisible && renderForm()}
                {isSavingVisible && renderSaving()}
                {isCalculatingVisible && renderCalculating()}
                {isChosenVisible && renderChosen()}
                {isTargetVisible && renderTarget()}
                {isRestartButtonVisible && <Button className="restart" onClick={restoreDefaults}>Restart</Button>}
            </div>
        </>
    );
}

export default SecretSanta;