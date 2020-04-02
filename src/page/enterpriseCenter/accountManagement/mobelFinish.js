/**
 * 绑定手机修改
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Button, Form, Input} from 'antd';
import cookie from 'react-cookies';
import './index.css';
import {request} from "../../../utils/request";
import {message} from "antd/lib/index";

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class MobelFinish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: cookie.load('userType')
        }
    }

    componentDidMount() {
        //this.getProvinceData();
        this.getDefaultData();
    }

    getDefaultData = async () => {
        const requestData = await request('/company/get-company-user', 'POST', {member_id: cookie.load('userId')});
        const data = requestData.data;
        if (data) {
            this.props.form.setFieldsValue(data);
        }
    }
    onMobelFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const requestData = await request('/common/update-bind-mobile', 'POST', {
                    member_id: cookie.load('userId'),
                    mobile: values.new_mobile
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
    getSms = async (key) => {
        const mobile = this.props.form.getFieldValue(key || "mobile");
        if (mobile) {
            const responest = await request('/sms/register', 'POST', {mobile});
            const data = responest.data;
            if (data && data.success) {
                message.success(data.msg);
            } else {
                message.error(data.msg);
            }
            this.setState({
                [!key ? "time" : "newTime"]: 60
            }, () => {
                const tTime = setInterval(() => {
                    if (this.state.time != 0) {
                        this.setState({
                            [!key ? "time" : "newTime"]: this.state[!key ? "time" : "newTime"] - 1
                        })
                    } else {
                        clearInterval(tTime);
                    }
                }, 1000);
            })
        } else {
            message.error("请输入手机号码");
        }

    }

    render() {
        const {time, newTime} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (<Form ref="mobelForm" {...layout} name="nest-messages" onSubmit={this.onMobelFinish}>
                <Form.Item label="原绑定手机号">
                    {getFieldDecorator('mobile')(
                        <Input disabled style={{width: 300}}/>
                    )}
                </Form.Item>
                <Form.Item label="验证码">
                    <Form.Item validateTrigger="onBlur" noStyle
                               style={{width: "130px", display: "inline-block", marginBottom: 0}}>
                        {getFieldDecorator('yzm', {
                            rules: [{
                                required: true,
                                message: '请输入验证码'
                            }, {
                                validator: async (rule, value, callback) => {
                                    const {form} = this.props;
                                    const responest = await request('/sms/check-register-code', 'POST', {
                                        mobile: form.getFieldValue('mobile'),
                                        code: value
                                    });
                                    if (responest.status == 200 && !responest.data.success) {
                                        return Promise.reject(responest.data.msg);
                                    }
                                    return Promise.resolve();
                                }
                            }]
                        })(
                            <Input min={1} max={10} style={{width: 120, marginRight: 10, marginBottom: 0}}/>
                        )}
                    </Form.Item>
                    <Button className={time > 0 ? "ant-form-text ant-form-disabled" : "ant-form-text"}
                            disabled={time > 0 ? true : false}
                            onClick={time > 0 ? null : () => this.getSms()}> {time > 0 ? `${time}秒后可再次发送短信` : "获取短信验证码"}</Button>
                </Form.Item>
                <Form.Item label="绑定新手机号码">
                    {getFieldDecorator('new_mobile', {
                        rules: [{
                            required: true,
                            message: '请输入新手机号码'
                        }]
                    })(
                        <Input style={{width: 300}}/>
                    )}
                </Form.Item>
                <Form.Item label="验证码">
                    <Form.Item validateTrigger="onBlur" noStyle
                               style={{width: "130px", display: "inline-block", marginBottom: 0}}>
                        {getFieldDecorator('new_yzm', {
                            rules: [{
                                required: true,
                                message: '请输入验证码'
                            }, {
                                validator: async (rule, value, callback) => {
                                    const {form} = this.props;
                                    const responest = await request('/sms/check-register-code', 'POST', {
                                        mobile: form.getFieldValue('new_mobile'),
                                        code: value
                                    });
                                    console.log(responest)
                                    if (responest.status == 200 && !responest.data.success) {
                                        return Promise.reject(responest.data.msg);
                                    }
                                    return Promise.resolve();
                                }
                            }]
                        })(
                            <Input min={1} max={10} style={{width: 120, marginRight: 10, marginBottom: 0}}/>
                        )}
                    </Form.Item>
                    <Button className={newTime > 0 ? "ant-form-text ant-form-disabled" : "ant-form-text"}
                            disabled={newTime > 0 ? true : false}
                            onClick={newTime > 0 ? null : () => this.getSms("new_mobile")}> {newTime > 0 ? `${newTime}秒后可再次发送短信` : "获取短信验证码"}</Button>
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

export default Form.create()(MobelFinish);