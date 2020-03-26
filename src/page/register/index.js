/**
 * 注册
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import cookie from 'react-cookies';
import {Form, Input, Button, Select,message} from 'antd';
// import axios from 'axios';
import {request} from './../../utils/request';
import Top from './../../component/top';

import './index.css';

const { Option } = Select;
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 10},
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
        const responest = await request('/sms/register','POST',{mobile:this.refs.form.getFieldValue("mobile")});
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);
        }else{
            message.error(data.msg);
        }
        this.setState({
            time: 60
        },()=>{
            const tTime = setInterval(()=>{
                if(this.state.time !=0) {
                    this.setState({
                        time: this.state.time - 1
                    })
                }else{
                    clearInterval(tTime);
                }
            },1000);
        })

    }
    onFinish = async (values) => {
        const responest = await request('/company/register','POST',{...values});
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
        //发送请求
        // axios.post('/company/register',{
        //     ...values
        // })
        //     .then(function(response) {
        //     console.log(response.data);
        //     console.log(response.status);
        //     console.log(response.statusText);
        //     console.log(response.headers);
        //     console.log(response.config);
        // });

    };
    onReset = () => {
        this.props.form.resetFields();
    };
    onBack = () =>{
        this.props.history.push('/login');
    }
    render() {
        const {labelSelect,time} = this.state;
        console.log(labelSelect);
        return (
            <div className="register-template">
                <Top />
                <div className="register-form-box max-weight-box">
                    <div className="register-title">欢迎注册</div>
                <Form ref="form" {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                    <Form.Item name="username" label="用户名" rules={[
                        {
                            required: true,
                            message: '请输入用户名'
                        },
                        ({ getFieldValue }) => ({
                            async validator(rule, value) {
                                const responest = await request('/common/check-user','POST',{username:value});
                                console.log(responest)
                                if(responest.status == 200 && responest.data.success){
                                    return Promise.reject(responest.data.msg);
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}>
                        <Input placeholder="字母、数字和符号的6-16字符组合"/>
                    </Form.Item>
                    <Form.Item name="company_name" label="企业名称" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="code" label="统一社会信用代码" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="industry_label_id" label="所属行业" rules={[{required: true}]}>
                        <Select>
                            {labelSelect ? labelSelect.map((item,idx)=> <Option value={item.id} key={item.id}>{item.name}</Option>) : ''}
                        </Select>
                    </Form.Item>
                    <Form.Item name="mobile" label="手机号"  rules={[
                        {
                            required: true,
                            message: '请输入手机号'
                        },
                        ({ getFieldValue }) => ({
                            async validator(rule, value) {
                                const responest = await request('/common/check-mobile','POST',{mobile:value});
                                if(responest.status == 200 && responest.data.success){
                                    return Promise.reject(responest.data.msg);
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}>
                        <Input/>
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
                        name={'confirmPassword'}
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
                    <Form.Item label="短信验证码">
                        <Form.Item name="yzm" noStyle  rules={[{required: true}]}>
                            <Input min={1} max={10} style={{width:100,marginRight:10}} />
                        </Form.Item>
                        <Button className="ant-form-text" disabled={time<0} onClick={time>0 ? null : this.getSms}> {time>0 ? `${time}秒后可再次发送短信`:"获取短信验证码"}</Button>
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
            {/*<Footer/>*/}
            </div>
        );
    };
}

export default Register;