import React, { useState } from "react";
import { post, get } from "../components/api";
import { Form, Button, Row } from 'react-bootstrap';
import "../assets/styles/calculator.css"
import Spinner from "./spinner.js";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (event) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    setInput(input + event.target.value);
  };

  const handleDelete = () => {
    setInput(input.substring(0, input.length - 1));
  };

  const handleClear = () => {
    setInput("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    post('/ans', input)
      .then(response => {
        setIsLoading(false);
        setInput(response.data.toString());
      })
      .catch(error => {
        setIsLoading(false);
        alert("Error sending data: " + error.message);
      });
  };

  const handleReceive = () => {
    setIsLoading(true);
    get('/ans')
      .then(response => {
        setIsLoading(false);
        setInput(input + response.data.toString());
      })
      .catch(error => {
        setIsLoading(false);
        alert("Error receiving data: " + error.message);
      });
  };

  return (
    <><h1 id="calculator">Calculator</h1>
      <div className="app calculator">
        <Form onSubmit={handleSubmit}>
          <Form.Control value={input} onChange={handleKeyDown} />
          {isLoading && <Spinner color="#000" position="absolute" />}
        </Form>
        <Row className="first">
          <Button onClick={handleClick} value="(">{'('}</Button>
          <Button onClick={handleClick} value=")">{')'}</Button>
          <Button onClick={handleClick} value="sqrt">{'\u221A'}</Button>
          <Button onClick={handleClick} value="^">^</Button>
          <Button onClick={handleClick} value="log">log</Button>
        </Row>
        <Row>
          <Button onClick={handleClick} value="7">7</Button>
          <Button onClick={handleClick} value="8">8</Button>
          <Button onClick={handleClick} value="9">9</Button>
          <Button onClick={handleDelete}>{'\u2190'}</Button>
          <Button onClick={handleClear}>C</Button>
        </Row>
        <Row>
          <Button onClick={handleClick} value="6">6</Button>
          <Button onClick={handleClick} value="5">5</Button>
          <Button onClick={handleClick} value="4">4</Button>
          <Button onClick={handleClick} value="*">*</Button>
          <Button onClick={handleClick} value="/">/</Button>
        </Row>
        <Row>
          <Button onClick={handleClick} value="1">1</Button>
          <Button onClick={handleClick} value="2">2</Button>
          <Button onClick={handleClick} value="3">3</Button>
          <Button onClick={handleClick} value="+">+</Button>
          <Button onClick={handleClick} value="-">-</Button>
        </Row>
        <Row>
          <Button onClick={handleClick} value="0">0</Button>
          <Button onClick={handleClick} value=".">.</Button>
          <Button onClick={handleClick} value="*10^">EXP</Button>
          <Button onClick={handleReceive}>Ans</Button>
          <Button type="submit" variant="success" onClick={handleSubmit}>=</Button>
        </Row>
      </div></>
  );
};

export default Calculator;
