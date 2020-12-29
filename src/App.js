import './App.css';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';
import GridLayout from 'react-grid-layout';

function App() {
  const layout = [
    {
      i: "Toolbar", x:0, y:0, w: 12, h: 1, static: true
    },
    {
      i: "CodePanel", x:0, y:1, w:6, h:12
    }, 
    {
      i: "InputPanel", x:6, y:1, w:6, h:12
    }, 
    {
      i: "LogPanel", x:0, y:3, w:12, h:7
    }, 
  ]
  return (
    <div className="App">
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={25} width={900} height={800} isBounded={true}>
        <div key="Toolbar" className="grid-box">
          <Toolbar />
          <hr />
        </div>
        <div key="CodePanel" className="grid-box">
          <div className="grid-label">
            Code Editor
          </div>
          <CodeEditor varname="CodeEditor" mode="cpp" />
        </div>
        <div key="InputPanel" className="grid-box">
          <div className="grid-label">
            Input Texts
          </div>
          <CodeEditor varname="InputEditor" mode="txt" />
        </div>
        <div key="LogPanel" className="grid-box">
          <div className="grid-label">
            Log
          </div>
          <CodeEditor varname="LogView" mode="txt" />  
        </div>
      </GridLayout>      
    </div>
  );
}

export default App;
