import React, {Component} from 'react';
import {render} from 'react-dom';
import './index.css';

class Footer extends Component {
    constructor(props){
        super(props);
        this.state = {
            footerClass:''
        }
    }
    componentDidMount(){
        // this.setState({
        //     top: document.body.clientHeight - 290
        // });
        console.log(document.body.clientHeight,document.getElementById("main").offsetHeight)
        // if(document.body.clientHeight>document.getElementById("main").offsetHeight) {
        //     console.log(111)
        //     this.setState({
        //         footerClass: {top: document.body.clientHeight-70,position: "absolute",left:0,width: "100%"}
        //     });
        // }
    }

    render() {
        const {footerClass,top} = this.state;

        console.log(footerClass,this.props);
        return (
                <div className="footer-component-template">
                    <div className="max-weight-box">
                        <p>Copyright © www.cqxxx.gov.cn All Rights Reserved.</p>
                        <p>重庆市九龙坡区民营经济发展局版权所有</p>
                    </div>
                </div>
        );
    };
}

export default Footer;