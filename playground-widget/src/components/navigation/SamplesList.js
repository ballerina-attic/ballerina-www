import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react'
import { Menu } from 'semantic-ui-react'
import './SamplesList.css';

class SamplesList extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            selectedIndex: 0
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt, data ) {
        this.setState({
            selectedIndex: data.index
        });
        this.props.onSelect(data.index);
    }

    render() {
        const options = this.props.samples.map(({ name }, index) => {
            return {
                text: name,
                key: index,
                value: index
            };
        });
        const activeItem = this.state.selectedIndex;
        return (
        <div className="samples-navigation-list">
            <Menu text vertical>
                { options.map(e => {
                    return <Menu.Item name={e.text} index={e.value} active={activeItem === e.value} onClick={this.onChange} />
                })}
            </Menu>
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