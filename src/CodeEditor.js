import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import React from 'react';

const defaultCode = {
    'cpp': '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n\tputs("Hello world");\n\treturn 0;\n}',
    'text': ''
};

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        //For debug usage
        if (this.props.varname) {
            window[this.props.varname] = this;
        }
        this.state = {
            code: defaultCode[this.props.mode],
            breakPoints: {}
        }
    }

    renderCodeMirror() {
        
        return (
            <CodeMirror
                value={this.state.code}
                options={{
                    theme: 'monokai',
                    keyMap: 'sublime',
                    mode: this.props.mode
                }}
                height="100%"
                width="100%"
                onChange={(editor) => {
                    const newCode = editor.getValue();
                    this.updateCode(newCode);
                }}
                onGutterClick={(editor, line, gutter)=>{
                    console.log("CodeEditor - onGutterClick - ", line, gutter)
                    if (this.state.breakPoints[line] === true) {
                        editor.setGutterMarker(line, gutter, null);
                        //delete break point
                        let nextBreakPoints = Object.assign({}, this.state.breakPoints);
                        delete nextBreakPoints[line];
                        this.setState({
                            breakPoints: nextBreakPoints
                        })
                        console.log("1", this.state.breakPoints)
                    } else {
                        //TODO: replace dummy break point ui(button tag)
                        editor.setGutterMarker(line, gutter, document.createElement("button"));
                        //make break point
                        let nextBreakPoints = Object.assign({}, this.state.breakPoints);
                        nextBreakPoints[line] = true;
                        this.setState({
                            breakPoints: nextBreakPoints
                        })
                        console.log("2", this.state.breakPoints)
                    }
                }}
            />
        )
    }
    render() {
        return (
            <div className="Code-Editor">
                {this.renderCodeMirror()}
            </div>
        )
    }
    updateCode(newCode) {
        this.setState({
            code: newCode
        })
    }
    appendCode(newCode) {
        this.setState({
            code: this.state.code + '\n' + newCode
        })
    }
    getCode() {
        return this.state.code;
    }
}

export default CodeEditor
