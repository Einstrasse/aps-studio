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
    getCode() {
        return this.state.code;
    }
}

export default CodeEditor
