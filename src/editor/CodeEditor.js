import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
//import Grammar from './../utils/monarch-grammar';
//import BAL_LANG_CONFIG from '../utils/monaco-lang-config';

const BAL_LANGUAGE = 'ballerina-lang';

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
        // monaco.languages.setMonarchTokensProvider(BAL_LANGUAGE, Grammar);
        // monaco.languages.setLanguageConfiguration(BAL_LANGUAGE, BAL_LANG_CONFIG);
    }

    /**
     * @inheritDoc
     */
    render() {
        const { width, height } = this.props;
        return (
            <div className='ballerina-code-editor'>
                <MonacoEditor
                    language={BAL_LANGUAGE}
                    theme='vs-dark'
                    value={this.props.content}
                    editorDidMount={this.editorDidMount}
                    onChange={(newValue) => {
                        this.props.onChange(newValue);
                    }}
                    options={{
                        autoIndent: true,
                        fontSize: 14,
                        contextmenu: false,
                        renderIndentGuides: true,
                        autoClosingBrackets: true,
                        matchBrackets: true,
                        automaticLayout: true,
                        glyphMargin: true,
                        folding: true,
                        lineNumbersMinChars: 2,
                    }}
                    width={width}
                    height={height}
                />
            </div>
        );
    }
}

CodeEditor.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    content: PropTypes.string,
    onChange: PropTypes.func,
};

CodeEditor.defaultProps = {
    content: '',
    onChange: () => {},
};

export default CodeEditor;
