import React from 'react';
import { Container } from 'react-bootstrap';
import Calculator from './components/calculator';
import "./assets/styles/App.css"

function App() {
  return (
    <div>
      <Container className="mt-3">
        <Calculator />
      </Container>
    </div>
  );
}

export default App;
