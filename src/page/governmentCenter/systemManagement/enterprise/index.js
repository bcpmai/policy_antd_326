/**
 *  企业用户
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Input, Row, Col, Button, Breadcrumb,Form, Modal, Select, message ,Tooltip } from 'antd';
import Top from '../../../../component/top/index';
import Label from "../../../../component/label/index";
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import {request} from "../../../../utils/request";
import cookie from "react-cookies";

const { Option } = Select;
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
class enterprise extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData:[],
            labelStatus: {
                title: "状 态",
                item: [
                    {
                        id: -1,
                        name: "全部"
                    },
                    {
                        id: 1,
                        name: "正常"
                    },
                    {
                        id: 2,
                        name: "已禁用"
                    }]
            }
        }
        this.columns = [
            {
                title: '企业名称',
                dataIndex: 'company_name',
                key: 'company_name',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 4 ? text : text.substr(0,4)+"..."}</span></Tooltip>
                }
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                key: 'code',
                width:150,
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 6 ? text : text.substr(0,6)+"..."}</span></Tooltip>
                }
            },
            {
                title: '所属行业',
                dataIndex: 'industry_label_str',
                key: 'industry_label_str',
                width:150,
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 6 ? text : text.substr(0,6)+"..."}</span></Tooltip>
                }
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 10 ? text : text.substr(0,10)+"..."}</span></Tooltip>
                }
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                width:120,
                key: 'mobile',
            },
            {
                title: '注册时间',
                dataIndex: 'created_date',
                width:150,
                key: 'created_date'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:80,
                render: (text, record) => (<span>{text == 0 ? "正常" : "已禁用"}</span>),
            },
            {
                title: '操作',
                key: 'action',
                width:190,
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
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const industryData = selectIndustryData.data;
        if (industryData && industryData.success) {
            this.setState({
                industryData: industryData.data
            })
        }
    }

    getTableData = async (values={}) =>{
        if(cookie.load('userId')){
            values.member_id = parseInt(cookie.load('userId'));
        }
        const tableData = await request('/company/list', 'POST',values); //获取table
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
            let url = '/company/register';
            if(this.state.record){
                url = '/company/update_info';
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
        });
    };
    resetPasswordOk = async () =>{
        const {record} = this.state;
        const res = await request('/admin/reset-password', 'POST',{member_id:record.id,password:record.password}); //获取table
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
    onSelectStatus = (value) =>{
        this.setState({
            serarchStatus:value
        })
        console.log(value);
    }
    onSearchFinish = (values) =>{
        console.log(values);
        this.getTableData({...this.state.formValues,...values,status:this.state.serarchStatus == -1 ? undefined : this.state.serarchStatus});
    }
    render() {
        const {labelStatus,status,industryData,formValues,tableData,record} = this.state;
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
                        <PolicyManagementMenu menu="systemManagement" current="enterprise" />
                    </Col>
                    <Col span={20}>
                    <Title name="企业用户" />
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                        <Breadcrumb.Item href="">企业用户</Breadcrumb.Item>
                    </Breadcrumb>
                        <div className="label-box">
                            <Form ref="searchForm" {...layout} name="dynamic_rule" onFinish={this.onSearchFinish} validateMessages={validateMessages}>
                                    <div>
                                        <Row>
                                            <Col span={4}>企业名称</Col>
                                            <Col span={18}>
                                                <Form.Item name="company_name">
                                                    <Input />
                                                </Form.Item>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={4}>统一社会信用代码</Col>
                                            <Col span={18}>
                                                <Form.Item name="code">
                                                    <Input />
                                                </Form.Item>

                                            </Col>
                                        </Row>
                                        <Label callback={this.onSelectStatus} defalutValue={status} isRadio={true} span={{title:4,label:20}} title={labelStatus.title} item={labelStatus.item} key="labelStatus"/>
                                    </div>
                                <div className="search-button">
                                    <Button type="primary" htmlType="submit">检索</Button>
                                    <Button className="ml15" onClick={this.onReset}>重置</Button>
                                </div>
                            </Form>
                        </div>
                        <p align="right" className="operation-button">
                            <Button type="primary" onClick={(type,id)=>this.showModal("addVisible")}>添加用户</Button></p>
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
                        width={550}
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
                            <Col span={23}>
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
                            <Col span={23}>
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
                            <Col span={23}>
                                <Form.Item label="企业名称" name="company_name" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="统一社会信用代码" name="code" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="所属行业" name="industry_label_id" rules={[{required: true}]}>
                                    <Select
                                        style={{ width: '100%' }}
                                        onChange={this.handleChange}
                                    >
                                        {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                key={item.id}>{item.name}</Option>) : ''}

                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="初始密码" name="password" rules={[{required: true}]}>
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal> : null}
            </div>
        );
    };
}

export default enterprise;