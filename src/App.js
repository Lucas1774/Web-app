import React from 'react';
import { Container } from 'react-bootstrap';
import Calculator from './components/calculator';
import About from './components/parsedAbout';

function App() {
  return (
    <div>
      <About />
      <Container className="mt-3">
        <Calculator />
      </Container>
    </div>
  );
}

export default App;