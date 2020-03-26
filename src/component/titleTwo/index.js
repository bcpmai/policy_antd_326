import React, {Component} from 'react';
import './index.css';

class TitleTwo extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const {name} = this.props;

        return (
            <div className="title-two-component-template">{name}</div>
        );
    };
}

export default TitleTwo;