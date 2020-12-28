import './App.css';
// import Button from './Button';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';

const code = '#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n\tputs("Hello world");\n\treturn 0;\n}';

function App() {
  return (
    <div className="App">
      <div className="Code-Edit">
        <CodeMirror
          value={code}
          options={{
            theme: 'monokai',
            keyMap: 'sublime',
            mode: 'cpp'
          }}
          height="100vh"
          width="100vw"
        />

      </div>
    </div>
  );
}

export default App;
