import './App.css';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';


function App() {
  return (
    <div className="App">
      <div className="VerticalContainer">
        <Toolbar />
        <div className="CodePanel">
          <CodeEditor varname="CodeEditor" mode="cpp" />
        </div>
        <hr />
        <div className="footer">
          <CodeEditor varname="InputEditor" mode="txt" />
        </div>
      </div>
    </div>
  );
}

export default App;
