import React, {Component} from 'react';
import './index.css';

class Title extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const {name} = this.props;

        return (
            <div className="title-component-template">{name}</div>
        );
    };
}

export default Title;