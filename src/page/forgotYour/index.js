/**
 * 找回密码
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Form, Input, Button, message,Divider,Icon} from 'antd';
import Top from './../../component/top';
import './index.css';
import cookie from "react-cookies";
import {request} from "../../utils/request";
// import { PhoneOutlined,LockOutlined } from '@ant-design/icons';

const layout = {
    labelCol: {span: 0},
    wrapperCol: {span: 24},
};


class ForgotYour extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                //发送请求
                const responest = await request('/common/forget-password', 'POST', {...values});
                const data = responest.data;
                if (data && data.success) {
                    message.success(data.msg);
                    cookie.save('userId', data.data.id,{ path: '/' });
                    cookie.save('userName', values.username,{ path: '/' });
                    cookie.save('userType', 1,{ path: '/' });
                    setTimeout(() => {
                        this.props.history.push('/');
                    }, 1000);
                } else {
                    message.error(data.msg);
                }
            }
        });
    };
    getSms = async () => {
        const mobile = this.props.form.getFieldValue("mobile");
        if(mobile) {
            const responest = await request('/sms/register', 'POST', {mobile});
            const data = responest.data;
            if (data && data.success) {
                message.success(data.msg);
            } else {
                message.error(data.msg);
            }
            this.setState({
                time: 60
            }, () => {
                const tTime = setInterval(() => {
                    if (this.state.time != 0) {
                        this.setState({
                            time: this.state.time - 1
                        })
                    } else {
                        clearInterval(tTime);
                    }
                }, 1000);
            })
        }else{
            message.error("请输入手机号");
        }
    }
    onReset = () => {
        this.props.form.resetFields();
    };
    render() {
        const {time} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="forgotYour-template">
                <Top />
                <div className="forgotYour-form-box" style={{minHeight:window.innerHeight-70}}>
                    <div className="max-weight-box login-max-weight">
                        <div className="login-form-bg"></div>
                        <div className="login-form">
                            <div className="width-min-title"><Divider>忘记密码</Divider></div>
                    <Form {...layout} name="nest-messages" onSubmit={this.onFinish}>
                        <Form.Item>
                            {getFieldDecorator('mobile', {
                                rules: [{
                                    required: true,
                                    message: '请输入手机号'
                                }]
                            })(
                                <Input placeholder="请输入手机号"/>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Form.Item noStyle style={{width: "195px",display: "inline-block",margin:0}}>
                                {getFieldDecorator('yzm', {
                                    rules: [{
                                        required: true,
                                        message: '请输入验证码'
                                    }]
                                })(
                                    <Input placeholder="请输入验证码" min={1} max={10} style={{width:185,marginRight:10}} />
                                )}
                            </Form.Item>
                            <Button  className={time >0 ? "ant-form-text ant-form-disabled" : "ant-form-text"} disabled={time>0 ? true : false} onClick={time>0 ? null : this.getSms}> {time>0 ? `${time}秒后可再次发送短信`:"获取短信验证码"}</Button>
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true,
                                    message: '请输入登录密码'
                                },
                                    {
                                        message: '请输入6-25位字符组合',
                                        min:6,
                                        max:25
                                    },{
                                        validator:
                                            async (rule, value, callback) => {
                                                if(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/.test(value)){
                                                    return Promise.resolve()
                                                }
                                                else{
                                                    return Promise.reject('请包含字母、数字和符号两种以上的6-25字符组合');
                                                }
                                            }
                                    }]
                            })(
                                <Input.Password placeholder="字母、数字和符号两种以上的6-25字符组合"/>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('confirmPassword', {
                                rules: [{
                                    required: true,
                                    message: '请再次输入密码'
                                },{
                                    validator: (rule, value, callback) => {
                                        const { form } = this.props;
                                        if (value && value !== form.getFieldValue('password')) {
                                            callback('两次密码不一致!');
                                        } else {
                                            callback();
                                        }
                                    }
                                }]
                            })(
                                <Input.Password placeholder="再次输入密码"/>
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={{span: 24, offset: 0}} className="forgotYour-button">
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            <p><a href="/login">返回登录</a></p>
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

export default Form.create()(ForgotYour);