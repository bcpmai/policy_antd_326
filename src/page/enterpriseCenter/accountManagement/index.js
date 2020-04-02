/**
 * 账户管理
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Form, Input, Row, Col} from 'antd';
import cookie from 'react-cookies';
import Top from '../../../component/top/index';
import './index.css';
import EnterpriseMenu from '../../../component/enterpriseCenterMenu';
import Title from "../../../component/title/index";
import PolicyManagementMenu from "../../../component/policyManagementMenu/index";
import PasswordFinish from "./passwordFinish.js";
import MobelFinish from "./mobelFinish.js";
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class AccountManagement extends Component {
    constructor(props){
        super(props);
        this.state = {
            userType:cookie.load('userType')
        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="accountManagement-template">
                <Top />
                <div className="accountManagement-form-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            {this.state.userType == 1 ? <EnterpriseMenu menuKey="accountManagement" /> : <PolicyManagementMenu menu="systemManagement" current="accountManagement" />}
                        </Col>
                        <Col span={20}>
                            <Title name="账户管理" />
                    <div className="accountManagement-form">
                        <div className="accountManagement-title">账号密码修改</div>
                        <PasswordFinish />
                        <div className="accountManagement-title">绑定手机修改</div>
                        <MobelFinish />
                    </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    };
}

export default AccountManagement;