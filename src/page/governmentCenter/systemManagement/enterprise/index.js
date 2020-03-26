/**
 *  企业用户
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Input, Row, Col, Button, Breadcrumb,Form, Modal, Checkbox } from 'antd';
import { Link } from "react-router-dom";
import Top from '../../../../component/top/index';
import Label from "../../../../component/label/index";
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import {message} from "antd/lib/index";
import {request} from "../../../../utils/request";

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
class enterprise extends Component {
    constructor(props){
        super(props);
        this.state = {
            labelStatus: {
                title: "状 态",
                item: [
                    {
                        id: 0,
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
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'test2',
                key: 'test2'
            },
            {
                title: '所属行业',
                dataIndex: 'type',
                key: 'type'
            },
            {
                title: '用户名',
                dataIndex: 'hierarchy',
                key: 'hierarchy'
            },
            {
                title: '手机号',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '注册时间',
                dataIndex: 'theme',
                key: 'theme'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a onClick={(type,id)=>this.showModal("addVisible")}>修改</a>
                        <a className="ml15" onClick={(type,id)=>this.showModal("visible",record.id)}>禁用</a>
                        <a className="ml15" onClick={(type,id)=>this.showModal("passwordVisible",record.id)}>重置密码</a>
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
                type:'资金支持',
                analysis:'-',
                status:'暂存',
                source:'人工',
                time:'2019-02-01 12:05:11',
                money:'张三'
            },
            {
                key: '2',
                title: '关于修订《纳税服务投诉管理办法》的公告',
                hierarchy: "国家",
                address: '国务院',
                theme: '税收政策',
                type:'资金支持',
                analysis:'-',
                status:'暂存',
                source:'人工',
                time:'2019-02-01 12:05:11',
                money:'张三'
            },
            {
                key: '3',
                title: '关于修订《纳税服务投诉管理办法》的公告',
                hierarchy: "国家",
                address: '国务院',
                theme: '税收政策',
                type:'资金支持',
                analysis:'-',
                status:'暂存',
                source:'人工',
                time:'2019-02-01 12:05:11',
                money:'张三'
            },
            {
                key: '4',
                title: '关于修订《纳税服务投诉管理办法》的公告',
                hierarchy: "国家",
                address: '国务院',
                theme: '税收政策',
                type:'资金支持',
                analysis:'-',
                status:'暂存',
                source:'人工',
                time:'2019-02-01 12:05:11',
                money:'张三'
            }
        ];
        function onShowSizeChange(current, pageSize) {
            console.log(current, pageSize);
        }
        this.pagination = {
            showSizeChanger:true,
            defaultCurrent:1,
            total:500,
            pageSizeOptions:['10', '20', '30', '50','100','150'],
            onShowSizeChange:onShowSizeChange
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

    render() {
        const {labelStatus,status} = this.state;
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
                            <Form ref="form" {...layout} name="dynamic_rule" onFinish={this.onFinish} validateMessages={validateMessages}>
                                    <div>
                                        <Row>
                                            <Col span={4}>企业名称</Col>
                                            <Col span={18}>
                                                <Form.Item name="title">
                                                    <Input />
                                                </Form.Item>

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={4}>统一社会信用代码</Col>
                                            <Col span={18}>
                                                <Form.Item name="title">
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
                    <Table columns={this.columns} dataSource={this.data} pagination={this.pagination} />
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
                    title="重置密码"
                    visible={this.state.passwordVisible}
                    onOk={this.handleOk}
                    onCancel={(type)=>this.handleCancel("passwordVisible")}
                    footer={[
                        <Button key="back" onClick={this.handleOk}>
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
                            <Col span={4}>用户名</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={4}>手机号</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={4}>企业名称</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={4}>统一社会信用代码</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={4}>所属行业</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={4}>初始密码</Col>
                            <Col span={18}>
                                <Form.Item name="title" rules={[{required: true}]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    };
}

export default enterprise;