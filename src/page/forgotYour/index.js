/**
 * 找回密码
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Form, Input, Button, message} from 'antd';
import Top from './../../component/top';
import './index.css';
import cookie from "react-cookies";
import {request} from "../../utils/request";

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

const validateMessages = {
    required: '必填项!',
    types: {
        email: 'Not a validate email!',
        number: 'Not a validate number!',
    },
    number: {
        range: 'Must be between ${min} and ${max}',
    },
};


class ForgotYour extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    onFinish = async (values) => {
        //发送请求
        const responest = await request('/common/forget-password','POST',{...values});
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);
            cookie.save('userId', data.data.id);
            cookie.save('userName', values.username);
            cookie.save('userType', 1);
            setTimeout(()=>{
                this.props.history.push('/');
            },1000);
        }else{
            message.error(data.msg);
        }
        // axios.post('/company/register',{
        //     ...values
        // })
        //     .then(function(response) {
        //         console.log(response.data);
        //         console.log(response.status);
        //         console.log(response.statusText);
        //         console.log(response.headers);
        //         console.log(response.config);
        //     });

    };
    onReset = () => {
        this.props.form.resetFields();
    };
    render() {
        return (
            <div className="forgotYour-template">
                <Top />
                <div className="forgotYour-form-box">
                    <div className="forgotYour-title">忘记密码</div>
                    <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                        <Form.Item name="mobile" label="手 机 号" rules={[{required: true}]}>
                            <Input placeholder="请输入手机号"/>
                        </Form.Item>
                        <Form.Item label="短信验证码">
                            <Form.Item name="yzm" noStyle  rules={[{required: true}]}>
                                <Input placeholder="请输入验证码" min={1} max={10} style={{width:200,marginRight:10}} />
                            </Form.Item>
                            <Button className="ant-form-text"> 获取短信验证码</Button>
                        </Form.Item>
                        <Form.Item name='password' label="登录密码" rules={[
                            {
                                required: true,
                                message: '请输入登录密码'
                            },
                            {
                                message: '请输入6-25位字符组合',
                                min:6,
                                max:25
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/.test(value)){
                                        return Promise.resolve()
                                    }
                                    else{
                                        return Promise.reject('请包含字母、数字和符号两种以上的6-25字符组合');
                                    }
                                },
                            }),
                        ]}>
                            <Input.Password placeholder="字母、数字和符号两种以上的6-25字符组合"/>
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="确认登录密码"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: '请再次输入密码',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject('两次密码不一致!');
                                    },
                                }),
                            ]}>
                            <Input.Password placeholder="再次输入密码"/>
                        </Form.Item>
                        <Form.Item wrapperCol={{span: 19, offset: 5}} className="forgotYour-button">
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            <p><a href="/login">返回登录</a></p>
                        </Form.Item>
                    </Form>
                </div>
                {/*<Footer/>*/}
            </div>
        );
    };
}

export default ForgotYour;