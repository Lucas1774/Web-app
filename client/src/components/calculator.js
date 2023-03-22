import React, { useState, useEffect, useRef } from "react";
import {post, get} from "../components/api";
import { Form, FormControl, Button, Row, Col, Container } from 'react-bootstrap';
import "../assets/styles/calculator.css"

function Calculator() {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isMobile) {
      inputRef.current.focus();
      const handleWindowFocus = () => {
        inputRef.current.focus();
      };
      window.addEventListener('focus', handleWindowFocus);
      return () => {
        window.removeEventListener('focus', handleWindowFocus);
      };
    }
  });

  function handleKeyDown(event) {
    event.preventDefault();
    setInput(event.target.value);
  }  
  
  function handleClick(event) {
    event.preventDefault();
    setInput(input + event.target.value);
  }

  function handleDelete() {
    setInput(input.substring(0, input.length - 1));
  }
  
  function handleClear() {
    setInput("");
  }
    
  function handleSubmit(event) {
    event.preventDefault();
    post('/ans', input)
    .then(response => {
      setInput(response.data.toString());
    })
    .catch(error => {
      alert("Error sending data: " + error.message);
    });
  }

  function handleReceive() {
    get('/ans')
    .then(response => {
      setInput (input + response.data.toString());
    })
    .catch(error => {
      alert("Error receiving data: " + error.message);
    });
  }
  return (
    <Container className="calculator">
      <Form onSubmit={handleSubmit}>
        <FormControl ref={inputRef} value={input} onChange={handleKeyDown} />
      </Form>
      <Row className="first">
        <Col><Button onClick={handleClick} value="(">{'('}</Button></Col>
        <Col><Button onClick={handleClick} value=")">{')'}</Button></Col>
        <Col><Button onClick={handleClick} value="sqrt">{'\u221A'}</Button></Col>
        <Col><Button onClick={handleClick} value="^">^</Button></Col>
        <Col><Button onClick={handleClick} value="log">log</Button></Col>
      </Row>
      <Row >
        <Col><Button onClick={handleClick} value="7">7</Button></Col>
        <Col><Button onClick={handleClick} value="8">8</Button></Col>
        <Col><Button onClick={handleClick} value="9">9</Button></Col>  
        <Col><Button onClick={handleDelete}>{'\u2190'}</Button></Col>  
        <Col><Button onClick={handleClear}>C</Button></Col>
      </Row>
      <Row>
        <Col><Button onClick={handleClick} value="4">4</Button></Col>
        <Col><Button onClick={handleClick} value="5">5</Button></Col>
        <Col><Button onClick={handleClick} value="6">6</Button></Col>  
        <Col><Button onClick={handleClick} value="*">*</Button></Col>  
        <Col><Button onClick={handleClick} value="/">/</Button></Col>  
      </Row>
      <Row>
        <Col><Button onClick={handleClick} value="1">1</Button></Col>
        <Col><Button onClick={handleClick} value="2">2</Button></Col>
        <Col><Button onClick={handleClick} value="3">3</Button></Col>
        <Col><Button onClick={handleClick} value="+">+</Button></Col>
        <Col><Button onClick={handleClick} value="-">-</Button></Col>
      </Row>
      <Row>
        <Col><Button onClick={handleClick} value="0">0</Button></Col>
        <Col><Button onClick={handleClick} value=".">.</Button></Col>
        <Col><Button onClick={handleClick} value="*10^">EXP</Button></Col>
        <Col><Button onClick={handleReceive}>Ans</Button></Col>
        <Col><Button type="submit" variant="success" onClick={handleSubmit}>=</Button></Col>
      </Row>
    </Container>
  );
}    
export default Calculator;
