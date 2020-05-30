/**
 * 账号密码修改
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Button, Form, Input, Row, Col} from 'antd';
import cookie from 'react-cookies';
import './index.css';
import {request} from "../../../utils/request";
import {message} from "antd/lib/index";

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class PasswordFinish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: cookie.load('userType')
        }
    }

    componentDidMount() {
    }

    onPasswordFinish = async (e) => {
        console.log(this.props.form, this.props.passwordForm);
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const requestData = await request('/common/reset-password', 'POST', {
                    member_id: cookie.load('userId'),
                    password: values.password,
                    new_password: values.new_password
                });
                const data = requestData.data;
                if (data && data.success) {
                    message.success(data.msg);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    message.error(data.msg);
                }
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form ref="passwordForm" {...layout} name="nest-messages" onSubmit={this.onPasswordFinish}>
                <Form.Item label="原登录密码">
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true,
                            message: '请输入原登录密码'
                        }]
                    })(
                        <Input type="password" placeholder="请输入原登录密码" style={{width: 300}}/>
                    )}
                </Form.Item>
                <Form.Item label="新登录密码">
                    {getFieldDecorator('new_password', {
                        rules: [{
                            required: true,
                            message: '请输入新登录密码'
                        }, {
                            validator:
                                async (rule, value, callback) => {
                                    if (/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/.test(value)) {
                                        return Promise.resolve()
                                    }
                                    else {
                                        return Promise.reject('请包含字母、数字和符号两种以上的6-25字符组合');
                                    }
                                }
                        }]
                    })(
                        <Input type="password" placeholder="字母、数字和符号两种以上的6-25字符组合" style={{width: 300}}/>
                    )}
                </Form.Item>
                <Form.Item label="确认登录密码">
                    {getFieldDecorator('new_passwordtwo', {
                        rules: [{
                            required: true,
                            message: '请再次输入密码'
                        }, {
                            validator: (rule, value, callback) => {
                                const {form} = this.props;
                                if (value && value !== form.getFieldValue('new_password')) {
                                    callback('两次密码不一致!');
                                } else {
                                    callback();
                                }
                            }
                        }]
                    })(
                        <Input type="password" placeholder="再次输入密码" style={{width: 300}}/>
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                    <Button type="primary" htmlType="submit">
                        确认修改
                    </Button>
                </Form.Item>
            </Form>
        );
    };
}

export default Form.create()(PasswordFinish);