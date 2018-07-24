import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Loader from 'semantic-ui-react/dist/es/elements/Loader/Loader';
import Dimmer from 'semantic-ui-react/dist/es/modules/Dimmer/Dimmer';
import TreeBuilder from 'TreeBuilder';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Diagram from 'Diagram';
import PackageScopedEnvironment from 'PackageScopedEnvironment';
import { PARSER_API_URL } from '../../utils';
import 'scss/design-view.scss';
import 'font-ballerina/css/font-ballerina.css';

/**
 * Invoke parser service for the given content
 * and returns a promise with parsed json
 * @param {string} content
 */
function parseContent(content) {
    const payload = {
        fileName: 'untitled.bal',
        filePath: 'temp',
        includeTree: true,
        includePackageInfo: true,
        includeProgramDir: true,
        content,
    };
    return axios.post(PARSER_API_URL, payload,
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
 * DiagramView component
 */
class DiagramView extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.state = {
          model: undefined,
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
            editMode: true,
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
        const { model } = this.state;
        return (
        <div className="interaction-diagram ballerina-editor" style={{ ...this.props.size }} >
            {!model &&
                    <Dimmer active inverted>
                        <Loader inverted />
                    </Dimmer>
                }
            {model &&
                <Diagram mode='action'
                    editMode={true}
                    model={model}
                    { ...this.props.size } />
            }
        </div>
        );
    }
}

DiagramView.propTypes = {
    content: PropTypes.string,
    size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }).isRequired
};


DiagramView.childContextTypes = {
    environment: PropTypes.instanceOf(PackageScopedEnvironment).isRequired,
    getDiagramContainer: PropTypes.func.isRequired,
    getOverlayContainer: PropTypes.func.isRequired,
    editMode: PropTypes.bool
};

export default DragDropContext(HTML5Backend)(DiagramView);
