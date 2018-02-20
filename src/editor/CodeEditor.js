import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import Theme from './theme';
import './CodeEditor.css';
//import Grammar from './../utils/monarch-grammar';
//import BAL_LANG_CONFIG from '../utils/monaco-lang-config';

const BAL_LANGUAGE = 'ballerina-lang';
const BAL_WIDGET_MONACO_THEME = 'bal-widget-monaco-theme';
const MONACO_OPTIONS = {
    autoIndent: true,
    fontSize: 14,
    contextmenu: false,
    renderIndentGuides: true,
    autoClosingBrackets: true,
    matchBrackets: true,
    automaticLayout: true,
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 2,
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
 * Source editor component which wraps monaco editor
 */
class CodeEditor extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.monaco = undefined;
        this.editorInstance = undefined;
        this.editorDidMount = this.editorDidMount.bind(this);
    }

    /**
     * Life-cycle hook for editor did mount
     *
     * @param {IEditor} editorInstance Current editor instance
     * @param {Object} monaco Monaco API
     */
    editorDidMount(editorInstance, monaco) {
        this.monaco = monaco;
        this.editorInstance = editorInstance;
        monaco.languages.register({ id: BAL_LANGUAGE });
        monaco.editor.defineTheme(BAL_WIDGET_MONACO_THEME, Theme);
        monaco.editor.setTheme('vs');
        // monaco.languages.setMonarchTokensProvider(BAL_LANGUAGE, Grammar);
        // monaco.languages.setLanguageConfiguration(BAL_LANGUAGE, BAL_LANG_CONFIG);
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div className='monaco-editor'>
                <MonacoEditor
                    language={BAL_LANGUAGE}
                    theme='vs-dark'
                    value={this.props.content}
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

CodeEditor.propTypes = {
    content: PropTypes.string,
    onChange: PropTypes.func,
};

CodeEditor.defaultProps = {
    content: '',
    onChange: () => {},
};

export default CodeEditor;
