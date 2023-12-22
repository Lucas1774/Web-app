import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Calculator from './components/calculator';
import SecretSanta from './components/secretSanta';
import "./assets/styles/App.css"

function App() {
  return (
    <>
      <Row>
        <Col>
          <Calculator />
        </Col>
        <Col>
          <SecretSanta />
        </Col>
      </Row>
    </>
  );
}

export default App;
