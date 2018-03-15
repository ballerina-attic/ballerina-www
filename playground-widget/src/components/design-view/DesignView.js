import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';
import Diagram from 'Diagram';
import TreeBuilder from 'TreeBuilder'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PackageScopedEnvironment from 'PackageScopedEnvironment';
import { Scrollbars } from 'react-custom-scrollbars';
import 'scss/modules/ballerina-editor.scss';
import 'font-ballerina/css/font-ballerina.css';
import './DesignView.css';


const ORIGIN = window.location.hostname + (window.location.port ? ':' + window.location.port: '');
// TODO: Read this from an env config
const PARSER_URL = `http://${ORIGIN}/composer/ballerina/parser/file/validate-and-parse`;

/**
 * Invoke parser service for the given content
 * and returns a promise with parsed json
 * @param {string} content
 */
function parseContent(content) {
    const payload = {
        fileName: 'untitled',
        filePath: '/temp',
        packageName: 'test.package',
        includeTree: true,
        includePackageInfo: true,
        content,
    };
    return axios.post(PARSER_URL, payload,
            { 
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                } 
            })
            .then((response) => {
                return response.data;
            });
}


/**
 * DesignView component
 */
class DesignView extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.state = {
          model: undefined
        }
        this.container = undefined;
    }

    /**
     * @override
     * @memberof Diagram
     */
    getChildContext() {
        return {
            environment: new PackageScopedEnvironment(),
            getDiagramContainer: () => {
                return this.container;
            },
            getOverlayContainer: () => {
                return this.container;
            },
            fitToScreen: true,
        };
    }

    componentDidMount() {
        parseContent(this.props.content)
            .then(({ model }) => {
                this.setState({ model: TreeBuilder.build(model) });
            })
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div
                className='design-view'
                ref={(ref) => {
                    this.container = ref;
                }}
            >
                {!this.state.model &&
                    <Dimmer active inverted>
                        <Loader inverted />
                    </Dimmer>
                }
                {this.state.model &&
                    <Scrollbars style={{ width: 476, height: 282 }}>
                        <Diagram mode='action' model={this.state.model} width={476} height={282} />
                    </Scrollbars>
                }
            </div>
        );
    }
}

DesignView.propTypes = {
    content: PropTypes.string,
};


DesignView.childContextTypes = {
    environment: PropTypes.instanceOf(PackageScopedEnvironment).isRequired,
    getDiagramContainer: PropTypes.func.isRequired,
    getOverlayContainer: PropTypes.func.isRequired,
    fitToScreen: PropTypes.bool
};

export default DragDropContext(HTML5Backend)(DesignView);
