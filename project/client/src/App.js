

import { BrowserRouter as Router } from 'react-router-dom';
import Container from './components/Container';
function App() {
  return (

      <Router style={{minHeight: "100%"}}>
        <Container/>
      </Router>
  );
}

export default App;
