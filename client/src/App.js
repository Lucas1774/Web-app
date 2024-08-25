import React from "react";
import { Col, Row } from "react-bootstrap";
import Calculator from "./components/Calculator/Calculator";
import SecretSanta from "./components/SecretSanta/SecretSanta";
import ParsedAbout from "./components/ParsedAbout/ParsedAbout";
import Sudoku from "./components/Sudoku/Sudoku";
import RubikTimer from "./components/RubikTimer/RubikTimer";
import "./App.css"

const App = () => {
  return (
    <><div style={{ display: "flex", flexWrap: "wrap" }}>
      <ParsedAbout />
      <br></br>
    </div>
      <Row>
        <Col>
          <Calculator />
        </Col>
        <Col>
          <Sudoku />
        </Col>
        <Col>
          <SecretSanta />
        </Col>
        <Col>
          <RubikTimer />
        </Col>
      </Row>
    </>
  );
}

export default App;
