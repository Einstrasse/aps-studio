import './App.css';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';
import { Resize, ResizeVertical, ResizeHorizon } from "react-resize-layout";

function App() {
  return (
    <div className="App">
      <div className="VerticalContainer">
        <Toolbar />
        <hr />
        <Resize handleWidth="3px" handleColor="#30f">
          <ResizeVertical height="100%" className="resizable-code-panel">
            <div className="CodePanel panel">
              <CodeEditor varname="CodeEditor" mode="cpp" />
            </div>  
          </ResizeVertical>
          <ResizeVertical minHeight="150px" className="resizable-input-panel">
            <div className="inputPanel panel">
              <CodeEditor varname="InputEditor" mode="txt" />
            </div>
          </ResizeVertical>
        </Resize>
      </div>
      {/* <div className="VerticalContainer">
        <Toolbar />
        <div className="CodePanel">
          <CodeEditor varname="CodeEditor" mode="cpp" />
        </div>
        <hr />
        <div className="footer">
          <CodeEditor varname="InputEditor" mode="txt" />
        </div>
      </div> */}
    </div>
  );
}

export default App;
