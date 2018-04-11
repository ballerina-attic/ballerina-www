import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react'
import { Scrollbars } from 'react-custom-scrollbars';
import './DesignView.scss';

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
          DiagramView: undefined
        }
    }

    componentDidMount() {
        import(/* webpackChunkName: "interaction.diagram" */ './DiagramView').then(diagram => {
            this.setState({ DiagramView: diagram.default });
        });
    }

    /**
     * @inheritDoc
     */
    render() {
        const { DiagramView } = this.state;
        return (
            <div
                className='design-view'
                ref={(ref) => {
                    this.container = ref;
                }}
            >
                {!DiagramView &&
                    <Dimmer active inverted>
                        <Loader inverted />
                    </Dimmer>
                }
                {DiagramView &&
                    <Scrollbars style={{ width: 476, height: 285 }}>
                        <DiagramView content={this.props.content} />
                    </Scrollbars>
                }
            </div>
        );
    }
}

DesignView.propTypes = {
    content: PropTypes.string,
};

export default DesignView;
