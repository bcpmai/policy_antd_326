import React, {Component} from 'react';
import {render} from 'react-dom';
import './index.css';
import Logo1 from './img/logo1.png';

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
                        <p>版权所有：重庆市九龙坡区民营经济发展局 &nbsp;&nbsp; 技术支持：重庆大数据人工智能创新中心&nbsp;&nbsp;联系电话：023-61739999<img src={Logo1} style={{width:"45px",marginLeft:"5px"}} /></p>
                    </div>
                </div>
        );
    };
}

export default Footer;