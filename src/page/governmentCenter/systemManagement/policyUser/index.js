/**
 *  政府用户
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Input, Row, Col, Button, Breadcrumb, Modal, Form ,Tooltip } from 'antd';
import Top from '../../../../component/top/index';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import {message} from "antd/lib/index";
import {request} from "../../../../utils/request";
import cookie from "react-cookies";

const { Search } = Input;
const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
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
class policyUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData:[],

        }
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 30 ? text : text.substr(0,30)+"..."}</span></Tooltip>
                }
            },
            {
                title: '姓名',
                dataIndex: 'real_name',
                key: 'real_name',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 5 ? text : text.substr(0,5)+"..."}</span></Tooltip>
                }
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: '注册时间',
                dataIndex: 'created_date',
                key: 'created_date'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => (<span>{text == 0 ? "正常" : "已禁用"}</span>),
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a onClick={(type,id)=>this.showModal("addVisible",record)}>修改</a>
                        <a className="ml15" onClick={(type,id)=>this.showModal("visible",record)}>{record.status == 0 ? "禁用" : "启用"}</a>
                        <a className="ml15" onClick={(type,id)=>this.showModal("passwordVisible",record)}>重置密码</a>
                    </span>),
            },
        ];
    }
    async componentDidMount() {
        this.getTableData({page:1,max_line:20});
    }
    getTableData = async (values={}) =>{
        if(cookie.load('userId')){
            values.member_id = parseInt(cookie.load('userId'));
        }
        const tableData = await request('/admin/list', 'POST',values); //获取table
        if(tableData.status == 200){
            this.setState({
                tableData: tableData.data,
                formValues:values
            });
        }
    }
    onShowSizeChange = (current, pageSize) =>{
        console.log(current, pageSize);
        let {formValues={}} = this.state;
        formValues.page = current;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }

    onPaginChange = (page, pageSize) =>{
        console.log(page, pageSize);
        let {formValues={}} = this.state;
        formValues.page = page;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }
    showModal = (type,record) => {
        this.setState({
            [type]: true,
            record
        });
    };

    handleOk = async (e) => {

        this.refs.form.validateFields().then(async(values) => {
           console.log(values,"values")
            let url = '/admin/register';
            if(this.state.record){
                url = '/admin/update_user';
                values.username = this.state.record.username;
                values.member_id = this.state.record.id;
            }
            const deleteData = await request(url, 'POST', values); //添加用户
            if (deleteData.data && deleteData.data.success) {
                message.success(deleteData.data.msg);
                this.setState({
                    addVisible: false,
                    record: null
                });
                setTimeout(() => {
                    this.getTableData(this.state.formValues);
                }, 1000);
            } else {
                message.error(deleteData.data.msg);
            }
        }).catch(errorInfo => {
           console.log(errorInfo,"errror")
        });
    };

    handleCancel = type => {
        this.setState({
            [type]: false,
            record:null
        });
    };
    searchTabel = (value) =>{
        this.getTableData({...this.state.formValues,real_name:value,page:1});
    }
    handleStateOk = async () =>{
        const {record} = this.state;
        const res = await request('/admin/update-status-user', 'POST',{member_id:record.id,status:record.status}); //获取table
        if (res.data && res.data.success) {
            message.success(res.data.msg);
            this.setState({
                visible: false,
                record: null
            });
            setTimeout(() => {
                this.getTableData(this.state.formValues);
            }, 1000);
        } else {
            message.error(res.data.msg);
        }
    }
    resetPasswordOk = async () =>{
        const {record} = this.state;
        const res = await request('/admin/reset-password', 'POST',{member_id:record.id}); //获取table
        if (res.data && res.data.success) {
            message.success(res.data.msg);
            this.setState({
                passwordVisible: false,
                record: null
            });
            setTimeout(() => {
                this.getTableData(this.state.formValues);
            }, 1000);
        } else {
            message.error(res.data.msg);
        }
    }
    render() {
        const {formValues,tableData,record} = this.state;
        const pagination = {
            current:formValues && formValues.page ? formValues.page : 1,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize:20,
            total:tableData.sum || 0,
            showTotal:(total, range) => `共 ${tableData.page_num} 页 总计 ${tableData.sum} 条政策`,
            pageSizeOptions: ['10', '20', '30', '50', '100', '150'],
            onShowSizeChange: this.onShowSizeChange,
            onChange:this.onPaginChange
        }
        return (
            <div className="policyUser-template">
                <Top />
                <div className="policyUser-label-box max-weight-box">
                <Row>
                    <Col span={4}>
                        <PolicyManagementMenu menu="systemManagement" current="policyUser" />
                    </Col>
                    <Col span={20}>
                    <Title name="运营用户" />
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>政策管理</Breadcrumb.Item>
                        <Breadcrumb.Item href="">运营用户</Breadcrumb.Item>
                    </Breadcrumb>
                        <div className="policyUser-search">
                            <Search onSearch={this.searchTabel} enterButton />
                        </div>
                        <p className="operation-button" style={{textAlign:"right"}}><Button style={{marginRight:0}} type="primary" onClick={(type,id)=>this.showModal("addVisible")}>添加用户</Button></p>
                        {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                    </Col>
                </Row>
                </div>
                <Modal
                    title="温馨提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={(type)=>this.handleCancel("visible")}
                    footer={[
                        <Button key="back" onClick={this.handleStateOk}>
                            确定
                        </Button>,
                        <Button key="submit" type="primary" onClick={(type)=>this.handleCancel("visible")}>
                            取消
                        </Button>
                    ]}
                >
                    <p style={{
                        padding: "40px 0 10px 0",
                        textAlign: "center",
                        fontSize: "16px",
                        color: "#6e6e6e"
                    }}>确认{record && record.status != 0 ? "启用" : "禁用"}该角色吗？</p>
                </Modal>
                <Modal
                    title="重置密码"
                    visible={this.state.passwordVisible}
                    onOk={this.handleOk}
                    onCancel={(type)=>this.handleCancel("passwordVisible")}
                    footer={[
                        <Button key="back" onClick={this.resetPasswordOk}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={(type)=>this.handleCancel("passwordVisible")}>
                            取消
                        </Button>
                    ]}
                >
                    <p style={{
                        padding: "40px 30px 10px 30px",
                        fontSize: "16px",
                        color: "#6e6e6e"
                    }}>确认重置密码？确认后，初始密码为123abc，请及时通知联系人。</p>
                </Modal>

                {this.state.addVisible ? <Modal
                    title={record ? "修改角色" :"添加角色"}
                    visible
                    onOk={this.handleOk}
                    onCancel={(type)=>this.handleCancel("addVisible")}
                    footer={[
                        <Button key="back" onClick={this.handleOk}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={(type)=>this.handleCancel("addVisible")}>
                            取消
                        </Button>
                    ]}
                >
                    <Form ref="form" {...layout} name="dynamic_rule" validateMessages={validateMessages}>
                        <Row className="mt10">
                            <Col span={24}>
                                <Form.Item label="用户名" name="username" rules={record && record.username ? [] : [
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
                                    {record && record.username ? <span>{record.username}</span> : <Input />}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={24}>
                                <Form.Item label="姓名" name="real_name">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={24}>
                                <Form.Item label="手机号" name="mobile" rules={[
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
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={24}>
                                <Form.Item label="初始密码" name="password" rules={[{required: true}]}>
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal> : null }
            </div>
        );
    };
}

export default policyUser;