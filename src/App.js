import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Calculator from './components/calculator';
import SecretSanta from './components/secretSanta';
import About from './components/parsedAbout';
import "./assets/styles/App.css"

function App() {
  return (
    <div>
      <About />
      <Container>
        <Row>
          <Calculator />
        </Row>
        <Row>
          <SecretSanta />
        </Row>
      </Container>
    </div>
  );
}

export default App;
