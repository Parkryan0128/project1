import './App.css'
import GraphCanvas from './components/GraphCanvas.jsx'
import Input from './components/Input.jsx'
import InputContent from './components/inputtest.jsx'
import InputList from './components/InputList.jsx'
import { derivative, differentiate } from './utils/Derivative.js'; // Import derivative function
import InputFraction from './components/InputFraction.jsx'
import InputSquareRoot from './components/InputSquareRoot.jsx';
import InputIntegral from './components/InputIntegral.jsx';
import InputLog from './components/InputLog.jsx';
// import Log from './components/Log.jsx'
import MainPage from './pages/MainPage.jsx'

function App() {
    return <div>
        <MainPage/>
      </div>
}

export default App