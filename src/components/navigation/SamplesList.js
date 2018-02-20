import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import './SamplesList.css';

class SamplesList extends React.Component {
    render() {
        return (
        <div className="samples-navigation-list">
            {
                this.props.samples.map(({ name }, index) => {
                    return (
                        <Button onClick={() => {
                            this.props.onSelect(index);
                        }}>
                            {name}
                        </Button>
                    );
                })
            }
        </div>
        );
    }
}

SamplesList.propTypes = {
    samples: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired
    })),
    onSelect: PropTypes.func,
};

SamplesList.defaultProps = {
    samples: [],
    onSelect: () => {},
};
  
export default SamplesList;