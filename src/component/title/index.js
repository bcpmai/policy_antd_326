import React, {Component} from 'react';
import {Icon} from 'antd';
import './index.css';

class Title extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const {name,remarks} = this.props;

        return (
            <div className="title-component-template">{name}
            {remarks ?
                <div className="alert-box">
                    <Icon type="exclamation-circle" theme="filled" />
                    <span>{remarks}</span>
                </div>
                : null}
            </div>
        );
    };
}

export default Title;