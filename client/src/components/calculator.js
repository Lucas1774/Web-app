import React, { useState, useEffect } from "react";
import {post, get} from "../components/api";

function Calculator() {
  const [input, setInput] = useState("");
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (input !== "") {
      setDisplay(input);
    } else{
      setDisplay("0");
    }
  }, [input]);

  function handleKeyDown(event) {
    const disallowedChars = /[^0-9.+\-*/=\s]/;
    if (input !== ""){setInput(event.target.value.replace(disallowedChars, ''));}
    else {setInput(event.target.value.replace(disallowedChars, '').replace(/^\d/, ""));}
    
  }  
  
  function handleClick(event) {
    event.preventDefault();
    setInput(input + event.target.value);
  }
  
  function handleClear() {
    setInput("");
  }
    
  function handleSubmit(event) {
    event.preventDefault();
    post('/ans', input)
    .then(response => {
      setInput(response.data);
    })
    .catch(error => {
      alert("Error sending data: " + error.message);
    });
  }

  function handleReceive() {
    get('/ans')
    .then(response => {
      setInput (input + response.data);
    })
    .catch(error => {
      alert("Error receiving data: " + error.message);
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={display} onChange={handleKeyDown} />
        <button type="submit">=</button>
      </form>
        <button onClick={handleClick} value="1">1</button>
        <button onClick={handleClick} value="2">2</button>
        <button onClick={handleClick} value="3">3</button>
        <button onClick={handleClick} value="4">4</button>
        <button onClick={handleClick} value="5">5</button>
        <button onClick={handleClick} value="6">6</button>
        <button onClick={handleClick} value="7">7</button>
        <button onClick={handleClick} value="8">8</button>
        <button onClick={handleClick} value="9">9</button>
        <button onClick={handleClick} value="0">0</button>
        <button onClick={handleClick} value="+">+</button>
        <button onClick={handleClick} value="-">-</button>
        <button onClick={handleClick} value="*">*</button>
        <button onClick={handleClick} value="/">/</button>
        <button onClick={handleClear} value="C">C</button>
        <button onClick={handleReceive} value="=">Ans</button>
    </div>
  );
}

export default Calculator;
