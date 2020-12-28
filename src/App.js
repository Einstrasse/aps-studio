import './App.css';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';


function App() {
  return (
    <div className="App">
      <div className="VerticalBox">
        <Toolbar />
        <CodeEditor />
        <div className="footer"></div>
      </div>
    </div>
  );
}

export default App;
