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
import AddUser from "./addUser.js";

const { Search } = Input;
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
                    return <Tooltip placement="topLeft" title={text}><span>{text ? (text.length < 5 ? text : text.substr(0,5)+"...") : ''}</span></Tooltip>
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
                width:250,
                render: (text, record) => (
                    <span>
                        <Tooltip placement="topLeft"
                                 title="切换至政府权限"><a onClick={(type, id) => this.setAuth(record)}>切换权限</a></Tooltip>
                        <a className="ml15" onClick={(type,id)=>this.showModal("addVisible",record)}>修改</a>
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

    setAuth = async(record) => {
        const req = await request('/admin/update-member-type', 'POST', {member_id:record.id}); //获取table
        if (req.data.success) {
            message.success(req.data.msg);
            setTimeout(()=>{
                this.getTableData(this.state.formValues);
            },2000);
        }else{
            message.error(req.data.msg);
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
    userCallback = () =>{
        this.setState({
            addVisible: false,
            record: null
        });
        setTimeout(() => {
            this.getTableData(this.state.formValues);
        }, 1000);
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
                            <Search onSearch={this.searchTabel} />
                        </div>
                        <p className="operation-button" style={{textAlign:"center"}}><Button style={{marginRight:0,marginTop:0,marginBottom:20}} type="primary" onClick={(type,id)=>this.showModal("addVisible")}>添加用户</Button></p>
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
                    }}>确认重置密码？确认后，初始密码为abc123，请及时通知联系人。</p>
                </Modal>

                {this.state.addVisible ? <AddUser record={record} callback={()=>this.userCallback()} handleCancel={this.handleCancel} /> : null}

            </div>
        );
    };
}

export default policyUser;