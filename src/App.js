import './App.css';
import React from 'react';
import CodeEditor from './CodeEditor';
import Toolbar from './Toolbar';
import GridLayout from 'react-grid-layout';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    window.App = this;
    this.state = {
      inputNames: [1]
    }
  }
  getInputNames() {
    return this.state.inputNames;
  }
  setNumInputs(inputs) {
    if (inputs > 5) {
      inputs = 5;
    }
    let newInputs = []
    for (let i=1; i <= inputs; i++) {
      newInputs.push(i)
    }
    //delete unused elems
    for (let i in this.state.inputNames) {
      let elem = this.state.inputNames[i];
      if (!(newInputs.includes(elem))) {
        console.log("Lets delete ", elem);
        delete window[`Input_${elem}`]
      }
    }
    this.setState({
      inputNames: newInputs
    })
  }

  render() {
    const layout = [
      {
        i: "Toolbar", x:0, y:0, w: 12, h: 1, static: true
      },
      {
        i: "CodePanel", x:0, y:1, w:8, h:15
      }, 
      {
        i: "InputPanel", x:8, y:1, w:4, h:15
      }, 
      {
        i: "LogPanel", x:0, y:3, w:12, h:10
      }, 
    ]
    return (
      <div className="App">
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={20} width={900} height={800} isBounded={true}>
          <div key="Toolbar" className="grid-box">
            <Toolbar />
            <hr />
          </div>
          <div key="CodePanel" className="grid-box">
            <div className="grid-label">
              Code Editor
            </div>
            <CodeEditor varname="CodeEditor" mode="cpp" breakpoints="true" />
          </div>
          <div key="InputPanel" className="grid-box">
            <div className="grid-label">
              Input Texts
            </div>
            <Tabs className="grid-contents" forceRenderTabPanel={true}>
              <TabList>
                  {this.state.inputNames.map((name, index) => {
                  return (<Tab key={name}>{name}</Tab>)
                })}
              </TabList>
            {this.state.inputNames.map((name, index) => {
              return (<TabPanel key={name}>
                <CodeEditor varname={`Input_${name}`} mode="txt" refresh={true} />
              </TabPanel>)
            })}
            </Tabs>
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
}

export default App;
