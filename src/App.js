import './App.css';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';
import { Resize, ResizeVertical, ResizeHorizon } from "react-resize-layout";

function App() {
  return (
    <div className="App">
      <Resize handleWidth="3px" handleColor="#30f">
        <ResizeVertical height="20px" minHeight="20px">
          <Toolbar />
          <hr />
        </ResizeVertical>
        <ResizeVertical height="100%" className="resizable-code-panel">
        <Resize handleColor="red" handleWidht="8px">
          <ResizeHorizon width="400px">
            <div className="CodePanel panel">
              <CodeEditor varname="CodeEditor" mode="cpp" />
            </div>  
          </ResizeHorizon>
          <ResizeHorizon minWidth="100px">
          <div className="CodePanel panel">
              <CodeEditor varname="InputEditor" mode="txt" />
            </div>  
          </ResizeHorizon>
        </Resize>
        </ResizeVertical>
        <ResizeVertical minHeight="150px" className="resizable-input-panel">
          <div className="inputPanel panel">
            <CodeEditor varname="LogView" mode="txt" />
          </div>
        </ResizeVertical>
      </Resize>
    </div>
  );
}

export default App;
