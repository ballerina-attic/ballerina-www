import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import downloads from './downloads.svg';
import './DownloadsView.css'

/**
 * DownloadsView component
 */
class DownloadsView extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.scrollBar = undefined;
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div className='downloads-area'>
                <img src={downloads} />
            </div>
        );
    }
}
export default DownloadsView;
