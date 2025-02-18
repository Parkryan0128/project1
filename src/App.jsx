import './App.css'
import GraphCanvas from './components/GraphCanvas.jsx'
import Input from './components/Input.jsx'
import InputContent from './components/inputtest.jsx'
import InputList from './components/InputList.jsx'
import { derivative, differentiate } from './utils/Derivative.js'; // Import derivative function
import InputFraction from './components/InputFraction.jsx'

function App() {
    return <div>
        <InputFraction/>
      </div>
}

export default App