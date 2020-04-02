/**
 * 账户管理
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Form, Input, Row, Col} from 'antd';
// import { EditOutlined,AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import cookie from 'react-cookies';
import Top from '../../../component/top/index';
import './index.css';
import EnterpriseMenu from '../../../component/enterpriseCenterMenu';
import Title from "../../../component/title/index";
import PolicyManagementMenu from "../../../component/policyManagementMenu/index";
import moment from "moment/moment";
import {request} from "../../../utils/request";
import {message} from "antd/lib/index";
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
class AccountManagement extends Component {
    constructor(props){
        super(props);
        this.state = {
            userType:cookie.load('userType')
        }
    }
    componentDidMount() {
        //this.getProvinceData();
        this.getDefaultData();
    }
    getDefaultData = async () =>{
        const requestData = await request('/company/get-company-user', 'POST',{member_id:cookie.load('userId')});
        const data = requestData.data;
        if (data) {
            this.refs.mobelForm.setFieldsValue(data);
        }
    }
    onChange = (date, dateString) =>{
        console.log(date, dateString);
    }
    onPasswordFinish = async(values) =>{
        const requestData = await request('/common/reset-password', 'POST',{member_id:cookie.load('userId'),password:values.password,new_password:values.password});
        const data = requestData.data;
        if(data && data.success){
            message.success(data.msg);
            setTimeout(()=>{
                window.location.reload();
            },2000);
        }else{
            message.error(data.msg);
        }
    }
    onMobelFinish = async(values) =>{
        const requestData = await request('/common/update-bind-mobile', 'POST',{member_id:cookie.load('userId'),mobile:values.new_mobile});
        const data = requestData.data;
        if(data && data.success){
            message.success(data.msg);
            setTimeout(()=>{
                window.location.reload();
            },2000);
        }else{
            message.error(data.msg);
        }
    }
    getSms = async (key) => {
        const mobile = this.refs.mobelForm.getFieldValue(key || "mobile");
        if(mobile) {
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
        }else{
            message.error("请输入手机号码");
        }

    }
    render() {
        const {time,newTime} = this.state;
        console.log(time,newTime);
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
                        <Form ref="passwordForm" {...layout} name="nest-messages" onFinish={this.onPasswordFinish} validateMessages={validateMessages}>
                            <Form.Item name='password' label="原登录密码" rules={[{required: true}]}>
                                <Input.Password placeholder="请输入内容" style={{width:300}}/>
                            </Form.Item>
                            <Form.Item name='new_password' label="新登录密码" rules={[{required: true}]}>
                                <Input.Password placeholder="字母、数字和符号两种以上的6-25字符组合" style={{width:300}}/>
                            </Form.Item>
                            <Form.Item
                                name={['user', 'introduction']}
                                label="确认登录密码"
                                dependencies={['new_password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: '请再次输入密码',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject('两次密码不一致!');
                                        },
                                    }),
                                ]}>
                                <Input.Password placeholder="再次输入密码" style={{width:300}}/>
                            </Form.Item>
                            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                                <Button type="primary" htmlType="submit">
                                    确认修改
                                </Button>
                            </Form.Item>
                        </Form>
                        <div className="accountManagement-title">绑定手机修改</div>
                        <Form ref="mobelForm" {...layout} name="nest-messages" onFinish={this.onMobelFinish} validateMessages={validateMessages}>
                            <Form.Item name="mobile" label="原绑定手机号" rules={[{required: true}]}>
                                <Input disabled style={{width:300}}/>
                            </Form.Item>
                            <Form.Item label="验证码">
                                <Form.Item validateTrigger="onBlur" name="yzm" noStyle rules={[
                                    {
                                        required: true,
                                        message: '请再次输入密码',
                                    },
                                    ({ getFieldValue }) => ({
                                        async validator(rule, value) {
                                            const responest = await request('/sms/check-register-code','POST',{mobile:getFieldValue('mobile'),code:value});
                                            console.log(responest)
                                            if(responest.status == 200 && !responest.data.success){
                                                return Promise.reject(responest.data.msg);
                                            }
                                            return Promise.resolve();
                                        }
                                    }),
                                ]}>
                                    <Input min={1} max={10} style={{width:120,marginRight:10}} />
                                </Form.Item>
                                <Button  className={time >0 ? "ant-form-text ant-form-disabled" : "ant-form-text"} disabled={time>0 ? true : false} onClick={time>0 ? null : ()=>this.getSms()}> {time>0 ? `${time}秒后可再次发送短信`:"获取短信验证码"}</Button>
                            </Form.Item>
                            <Form.Item name="new_mobile" label="绑定新手机号码" rules={[{required: true}]}>
                                <Input style={{width:300}}/>
                            </Form.Item>
                            <Form.Item label="验证码">
                                <Form.Item validateTrigger="onBlur" name="new_yzm" noStyle rules={[
                                    {
                                        required: true,
                                        message: '请再次输入密码',
                                    },
                                    ({ getFieldValue }) => ({
                                        async validator(rule, value) {
                                            const responest = await request('/sms/check-register-code','POST',{mobile:getFieldValue('new_mobile'),code:value});
                                            console.log(responest)
                                            if(responest.status == 200 && !responest.data.success){
                                                return Promise.reject(responest.data.msg);
                                            }
                                            return Promise.resolve();
                                        }
                                    }),
                                ]}>
                                    <Input min={1} max={10} style={{width:120,marginRight:10}} />
                                </Form.Item>
                                <Button className={newTime >0 ? "ant-form-text ant-form-disabled" : "ant-form-text"} disabled={newTime>0 ? true : false} onClick={newTime>0 ? null : ()=>this.getSms("new_mobile")}> {newTime>0 ? `${newTime}秒后可再次发送短信`:"获取短信验证码"}</Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                                <Button type="primary" htmlType="submit">
                                    确认修改
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                        </Col>
                    </Row>
                </div>
                {/*<Footer/>*/}
            </div>
        );
    };
}

export default AccountManagement;