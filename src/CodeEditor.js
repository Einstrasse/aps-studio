import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import React from 'react';

const defaultCode = {
    'cpp': '#include <iostream>\nusing namespace std;\nint main() {\n\tputs("Hello world");\n\treturn 0;\n}',
    'text': ''
};

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        //For debug usage
        if (this.props.varname) {
            window[this.props.varname] = this;
            console.log("OncCreate", this.props.varname);
        }
        
        this.state = {
            code: defaultCode[this.props.mode] || '',
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
                onCopy={(editor) => {
                    console.log("Copy event!");
                }}
                onChange={(editor) => {
                    const newCode = editor.getValue();
                    this.updateCode(newCode);
                }}
                onFocus={this.props.refresh ? (editor)=>{
                    editor.refresh();
                } : (editor)=> {}}
                onGutterClick={this.props.breakpoints ? (editor, line, gutter)=>{
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
                } : (editor, line, gutter) => {}}
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
            code: [this.state.code, newCode].filter(Boolean).join('\n')
        })
    }
    getCode() {
        return this.state.code;
    }
}

export default CodeEditor
