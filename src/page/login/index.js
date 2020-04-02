/**
 * 登录
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Form, Input, Button, Select,message,Divider,Icon} from 'antd';
import {request} from './../../utils/request';
import Top from './../../component/top';
import './index.css';
import cookie from "react-cookies";
// import { UserOutlined,LockOutlined } from '@ant-design/icons';

const { Option } = Select;
const layout = {
    labelCol: {span: 0},
    wrapperCol: {span: 24},
};


class Login extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    onFinish = (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                console.log(values,"11111");
                // 发送请求
                const responest = await request('/common/login','POST',{...values});
                const data = responest.data;
                if(data && data.success){
                    message.success(data.msg);
                    cookie.save('userId', data.id);
                    cookie.save('userName', data.username);
                    cookie.save('userType', data.member_type);
                    setTimeout(()=>{
                        if(data.member_type == "1"){
                            _this.props.history.push('/information');
                        }else{
                            _this.props.history.push('/policyList');
                        }

                    },1000);
                }else{
                    message.error(data.msg);
                }
            }
        });


    };
    onReset = () => {
        this.props.form.resetFields();
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-template">
                <Top />
                <div className="login-form-box">
                    <div className="max-weight-box login-max-weight">
                        <div className="login-form-bg"></div>
                        <div className="login-form">
                            <div className="width-min-title"><Divider>用户登录</Divider></div>
                            <Form {...layout} name="nest-messages" onSubmit={this.onFinish}>
                                <Form.Item>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: '请输入用户账号!' }],
                                    })(
                                        <Input prefix={<Icon type="user" />} placeholder="请输入用户账号"/>
                                    )}
                                </Form.Item>
                                <Form.Item >
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: '请输入密码!' }],
                                    })(
                                        <Input.Password prefix={<Icon type="lock" />} placeholder="请输入密码"/>
                                    )}
                                </Form.Item>
                                <Form.Item wrapperCol={{span: 24, offset: 0}} className="login-button">
                                    <p><a href="/forgotYour">忘记密码？</a></p>
                                    <Button type="primary" htmlType="submit">
                                        登录
                                    </Button>
                                    <p><a href="/register">免费注册</a></p>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
                {/*<Footer/>*/}
            </div>
        );
    };
}

export default Form.create()(Login);