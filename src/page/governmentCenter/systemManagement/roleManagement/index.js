/**
 *  角色管理
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Table, Input, Row, Col, Button, Modal, Form ,Checkbox} from 'antd';
import {Link} from "react-router-dom";
import Top from '../../../../component/top/index';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import {message} from "antd/lib/index";
import {request} from "../../../../utils/request";

const {Search} = Input;
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

class RoleManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.columns = [
            {
                title: '序号',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '角色名称',
                dataIndex: 'hierarchy',
                key: 'hierarchy'
            },
            {
                title: '添加时间',
                dataIndex: 'theme',
                key: 'theme'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a>修改</a>
                        <a className="ml15" onClick={(type,id)=>this.showModal("visible",record.id)}>禁用</a>
                    </span>),
            },
        ];

        this.data = [
            {
                key: '1',
                title: '关于修订《纳税服务投诉管理办法》的公告',
                hierarchy: "国家",
                address: '国务院',
                theme: '税收政策',
                type: '资金支持',
                analysis: '-',
                status: '暂存',
                source: '人工',
                time: '2019-02-01 12:05:11',
                money: '张三'
            },
            {
                key: '2',
                title: '关于修订《纳税服务投诉管理办法》的公告',
                hierarchy: "国家",
                address: '国务院',
                theme: '税收政策',
                type: '资金支持',
                analysis: '-',
                status: '暂存',
                source: '人工',
                time: '2019-02-01 12:05:11',
                money: '张三'
            },
            {
                key: '3',
                title: '关于修订《纳税服务投诉管理办法》的公告',
                hierarchy: "国家",
                address: '国务院',
                theme: '税收政策',
                type: '资金支持',
                analysis: '-',
                status: '暂存',
                source: '人工',
                time: '2019-02-01 12:05:11',
                money: '张三'
            },
            {
                key: '4',
                title: '关于修订《纳税服务投诉管理办法》的公告',
                hierarchy: "国家",
                address: '国务院',
                theme: '税收政策',
                type: '资金支持',
                analysis: '-',
                status: '暂存',
                source: '人工',
                time: '2019-02-01 12:05:11',
                money: '张三'
            }
        ];

        function onShowSizeChange(current, pageSize) {
            console.log(current, pageSize);
        }

        this.pagination = {
            showSizeChanger: true,
            defaultCurrent: 1,
            total: 500,
            pageSizeOptions: ['10', '20', '30', '50', '100', '150'],
            onShowSizeChange: onShowSizeChange
        }
    }

    showModal = (type,id) => {
        this.setState({
            [type]: true,
            id
        });
    };

    handleOk = async (e) => {
        const deleteData = await request('/policy/del', 'POST', {id: this.state.id}); //删除数据
        if (deleteData.data && deleteData.data.success) {
            message.success(deleteData.data.msg);
            this.setState({
                visible: false,
                id: null
            });
            setTimeout(() => {
                this.getTableData(this.state.formValues);
            }, 1000);
        } else {
            message.error(deleteData.data.msg);
        }
    };

    handleCancel = type => {
        this.setState({
            [type]: false,
        });
    };
    onCheckChange =(e)=> {
        console.log(`checked = ${e.target.checked}`);
    }

    render() {
        const {arrdown, labelTheme, labelType, labelProduct, arrProduct, labelStatus, labelSource} = this.state;
        return (
            <div className="policyUser-template">
                <Top/>
                <div className="policyUser-label-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <PolicyManagementMenu menu="systemManagement" current="roleManagement"/>
                        </Col>
                        <Col span={20}>
                            <Title name="角色管理"/>
                            <p className="manage-add-butn"><Button onClick={(type,id)=>this.showModal("addVisible")}
                                type="primary">添加角色</Button></p>
                            <Table columns={this.columns} dataSource={this.data} pagination={this.pagination}/>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title="温馨提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={(type)=>this.handleCancel("visible")}
                    footer={[
                        <Button key="back" onClick={this.handleOk}>
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
                    }}>确认禁用该角色吗？</p>
                </Modal>
                <Modal
                    title="添加/修改角色"
                    visible={this.state.addVisible}
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
                    <Form ref="form" {...layout} name="dynamic_rule" onFinish={this.onFinish} validateMessages={validateMessages}>
                        <Row className="mt10">
                            <Col span={4}>角色名称</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={4}>角色权限</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Checkbox onChange={this.onCheckChange}>企业首页</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    };
}

export default RoleManagement;