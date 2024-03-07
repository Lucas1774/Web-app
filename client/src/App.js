import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Calculator from './components/calculator';
import SecretSanta from './components/secretSanta';
import About from './components/parsedAbout';
import Sudoku from './components/sudoku';
import video from './assets/video/sudoku_demo.webm';
import "./assets/styles/App.css"

function App() {
  return (
    <><div style={{ display: "flex", flexWrap: "wrap" }}>
      <About />
      <br></br>
      <video controls height="200px" width="400px">
        <source src={video} type="video/webm" />
      </video>
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
      </Row>
    </>
  );
}

export default App;
