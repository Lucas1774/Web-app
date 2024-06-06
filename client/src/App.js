import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Calculator from './components/calculator';
import SecretSanta from './components/secretSanta';
import About from './components/parsedAbout';
import Sudoku from './components/sudoku';
import RubikTimer from './components/rubikTimer';
import "./assets/styles/App.css"

const App = () => {
  return (
    <><div style={{ display: "flex", flexWrap: "wrap" }}>
      <About />
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
