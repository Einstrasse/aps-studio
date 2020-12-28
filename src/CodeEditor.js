import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import React from 'react';

const defaultCode = '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n\tputs("Hello world");\n\treturn 0;\n}';

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        //For debug usage
        window.CodeEditor = this;
        this.state = {
            code: defaultCode
        }
    }
    renderCodeMirror() {
        return (
            <CodeMirror
                value={this.state.code}
                options={{
                    theme: 'monokai',
                    keyMap: 'sublime',
                    mode: 'cpp'
                }}
                height="100vh"
                width="100vw"
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
