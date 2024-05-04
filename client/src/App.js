import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Calculator from './components/calculator';
import SecretSanta from './components/secretSanta';
import Sudoku from './components/sudoku';
import RubikScramble from './components/rubikScramble';
import "./assets/styles/App.css"

const App = () => {
  return (
    <>
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
      </Row>
      <Row>
        <Col>
          <RubikScramble />
        </Col>
      </Row>
    </>
  );
}

export default App;
