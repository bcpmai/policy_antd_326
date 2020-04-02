/**
 * 注册
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import cookie from 'react-cookies';
import {Form, Input, Button, Select,message,Divider} from 'antd';
// import axios from 'axios';
import {request} from './../../utils/request';
import Top from './../../component/top';

import './index.css';

const { Option } = Select;
const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
};

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    async componentWillMount(){
        const responest = await request('/common/get-all-industry-label','POST');
        const data = responest.data;
        if(data && data.success){
            console.log(111)
            this.setState({
                labelSelect:data.data
            })
        }
        console.log(responest,"1");
    }
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
    onFinish = (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                const responest = await request('/company/register', 'POST', {...values});
                const data = responest.data;
                if (data && data.success) {
                    message.success(data.msg);
                    cookie.save('userId', data.data.id);
                    cookie.save('userName', values.username);
                    cookie.save('userType', 1);
                    setTimeout(() => {
                        _this.props.history.push('/');
                    }, 1000);
                } else {
                    message.error(data.msg);
                }
            }
        });

    };
    onReset = () => {
        this.props.form.resetFields();
    };
    onBack = () =>{
        this.props.history.push('/login');
    }
    render() {
        const {labelSelect,time} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="register-template">
                <Top />
                <div className="register-form-box max-weight-box">
                    <div className="register-form-bg"></div>
                    <div className="register-form">
                    <div className="width-min-title"><Divider>欢迎注册</Divider></div>
                <Form ref="form" {...layout} name="nest-messages" onSubmit={this.onFinish}>
                    <Form.Item label="用户名">
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true,
                                message: '请输入用户名'
                            },{
                                validator:
                                async (rule, value, callback) => {
                                    console.log(rule, value, callback);
                                    const responest = await request('/common/check-user','POST',{username:value});
                                    console.log(responest)
                                    if(responest.status == 200 && responest.data.success){
                                        return Promise.reject(responest.data.msg);
                                    }
                                    return Promise.resolve();
                                }
                        }]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="企业名称">
                        {getFieldDecorator('company_name', {
                            rules: [{
                                required: true,
                                message: '请输入企业名称'
                            }]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="统一社会信用代码">
                        {getFieldDecorator('code', {
                            rules: [{
                                required: true,
                                message: '请输入统一社会信用代码'
                            }]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="所属行业">
                        {getFieldDecorator('industry_label_id', {
                            rules: [{
                                required: true,
                                message: '请选择所属行业'
                            }]
                        })(
                            <Select>
                                {labelSelect ? labelSelect.map((item,idx)=> <Option value={item.id} key={item.id}>{item.name}</Option>) : ''}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="手机号" >
                        {getFieldDecorator('mobile', {
                            rules: [{
                                required: true,
                                message: '请输入手机号'
                            },{
                                validator:
                                    async (rule, value, callback) => {
                                        console.log(rule, value, callback);
                                        const responest = await request('/common/check-mobile','POST',{mobile:value});
                                        if(responest.status == 200 && responest.data.success){
                                            return Promise.reject(responest.data.msg);
                                        }
                                        return Promise.resolve();
                                    }
                            }]
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="登录密码">
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
                    <Form.Item
                        label="确认登录密码">
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
                    <Form.Item label="短信验证码">
                        <Form.Item name="yzm" noStyle style={{width: "110px",display: "inline-block"}}>
                            {getFieldDecorator('yzm', {
                                rules: [{
                                    required: true,
                                    message: '请短信验证码'
                                }]
                            })(
                                <Input min={1} max={10} style={{width:100,marginRight:10}} />
                            )}
                        </Form.Item>
                        <Button className={time >0 ? "ant-form-text ant-form-disabled" : "ant-form-text"} disabled={time>0 ? true : false} onClick={time>0 ? null : this.getSms}> {time>0 ? `${time}秒后可再次发送短信`:"获取短信验证码"}</Button>
                    </Form.Item>
                    <div className="register-button">
                        <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}} >
                            <Button type="primary" htmlType="submit">
                                立即注册
                            </Button>
                            <Button className="ml15" onClick={this.onBack}>
                                返回
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
                </div>
                </div>
            {/*<Footer/>*/}
            </div>
        );
    };
}

export default Form.create()(Register);