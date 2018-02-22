import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import './Console.css';

const MONACO_OPTIONS = {
    autoIndent: true,
    fontSize: 14,
    contextmenu: false,
    renderIndentGuides: false,
    autoClosingBrackets: true,
    matchBrackets: false,
    automaticLayout: true,
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 0,
    scrollBeyondLastLine: false,
    minimap: {
        enabled: false
    },
    lineNumbers: 'off',
    theme: 'vs',
    renderLineHighlight: 'none',
    scrollbar: {
        useShadows: false,
    },
    hideCursorInOverviewRuler: true,
}

/**
 * Console component which wraps monaco editor
 */
class Console extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.state = {
          content: ''
        }
        this.monaco = undefined;
        this.editorInstance = undefined;
        this.editorDidMount = this.editorDidMount.bind(this);
        this.editorWillMount = this.editorWillMount.bind(this);
    }

    /**
     * Life-cycle hook for editor will mount
     * 
     * @param {Object} monaco Monaco API
     */
    editorWillMount(monaco) {
        this.monaco = monaco;
        monaco.editor.setTheme('vs');
    }

    /**
     * Life-cycle hook for editor did mount
     *
     * @param {IEditor} editorInstance Current editor instance
     * @param {Object} monaco Monaco API
     */
    editorDidMount(editorInstance, monaco) {
        this.editorInstance = editorInstance;
    }

    /**
     * set
     */
    clearAndPrint(content) {
        this.setState({
          content,
        });
    }

    /**
     * append to console
     */
    append(content) {
        this.setState({
          content: this.state.content + '\n' + content
        })
    }

    /**
     * clear console
     */
    clear() {
      this.setState({
        content: ''
      })
  }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div className='monaco-editor'>
                <MonacoEditor
                    language={'custom-console-language'} // TODO
                    value={this.state.content}
                    editorWillMount={this.editorWillMount}
                    editorDidMount={this.editorDidMount}
                    onChange={(newValue) => {
                        this.props.onChange(newValue);
                    }}
                    options={MONACO_OPTIONS}
                />
            </div>
        );
    }
}

Console.propTypes = {
    onChange: PropTypes.func,
};

Console.defaultProps = {
    onChange: () => {},
};

export default Console;
