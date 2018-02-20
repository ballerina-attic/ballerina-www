import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react'
import './SamplesList.css';

class SamplesList extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            selectedIndex: 0
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt, { value }) {
        this.setState({
            selectedIndex: value
        });
        this.props.onSelect(value);
    }

    render() {
        const options = this.props.samples.map(({ name }, index) => {
            return {
                text: name,
                key: index,
                value: index
            };
        });
        return (
        <div className="samples-navigation-list">
            <Dropdown
                placeholder='Sample'
                fluid
                search
                selection
                options={options}
                value={this.state.selectedIndex}
                onChange={this.onChange}
            />
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