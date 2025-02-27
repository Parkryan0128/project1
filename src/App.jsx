import './App.css'
import GraphCanvas from './components/GraphCanvas.jsx'
import Input from './components/Input.jsx'
// import InputContent from './components/inputtest.jsx'
import InputList from './components/InputList.jsx'
import MainPage from './pages/MainPage.jsx';
import { derivative, differentiate } from './utils/Derivative.js'; // Import derivative function

function App() {
    return <div>
        <MainPage/>
      </div>
}

export default App