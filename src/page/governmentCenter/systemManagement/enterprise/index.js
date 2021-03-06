/**
 *  企业用户
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Table, Input, Row, Col, Button, Breadcrumb, Form, Modal, Select, message, Tooltip} from 'antd';
import Top from '../../../../component/top/index';
import Label from "../../../../component/label/index";
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import {request} from "../../../../utils/request";
import cookie from "react-cookies";
import AddUser from "./addUser.js";

const {Option} = Select;
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class enterprise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            userTableData:[],
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
                    return <Tooltip placement="topLeft"
                                    title={text}>{text ? (text.length < 35 ? text : text.substr(0, 35) + "...") : record.username}</Tooltip>
                }
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                key: 'code',
                width: 300,
                render: (text, record) => {
                    return <Tooltip placement="topLeft"
                                    title={text}><span>{text ? (text.length < 20 ? text : text.substr(0, 20) + "...") : text}</span></Tooltip>
                }
            },
            // {
            //     title: '所属行业',
            //     dataIndex: 'industry_label_str',
            //     key: 'industry_label_str',
            //     width: 150,
            //     render: (text, record) => {
            //         return <Tooltip placement="topLeft"
            //                         title={text}><span>{text.length < 6 ? text : text.substr(0, 6) + "..."}</span></Tooltip>
            //     }
            // },
            // {
            //     title: '用户名',
            //     dataIndex: 'username',
            //     key: 'username',
            //     render: (text, record) => {
            //         return <Tooltip placement="topLeft"
            //                         title={text}><span>{text ? (text.length < 10 ? text : text.substr(0, 10) + "...") : text}</span></Tooltip>
            //     }
            // },
            // {
            //     title: '手机号',
            //     dataIndex: 'mobile',
            //     width: 120,
            //     key: 'mobile',
            // },
            // {
            //     title: '注册时间',
            //     dataIndex: 'created_date',
            //     width: 150,
            //     key: 'created_date'
            // },
            // {
            //     title: '状态',
            //     dataIndex: 'status',
            //     key: 'status',
            //     width: 80,
            //     render: (text, record) => (<span>{text == 0 ? "正常" : "已禁用"}</span>),
            // },
            {
                title: '操作',
                key: 'action',
                width: 140,
                render: (text, record) => (
                    <span>
                        <Tooltip placement="topLeft"
                                 title="切换至政府权限"><a onClick={(type, id) => this.setAuth(record)}>切换权限</a></Tooltip>
                        <a onClick={(type, id) => this.showModal("viewVisible", record)} style={{marginLeft:"15px"}}>查看</a>
                        {/*<a onClick={(type, id) => this.showModal("addVisible", record)}>修改</a>*/}
                        {/*<a className="ml15"*/}
                           {/*onClick={(type, id) => this.showModal("visible", record)}>{record.status == 0 ? "禁用" : "启用"}</a>*/}
                        {/*<a className="ml15" onClick={(type, id) => this.showModal("passwordVisible", record)}>重置密码</a>*/}
                    </span>),
            },
        ];
        this.columns1 = [
            {
                title: '企业名称',
                dataIndex: 'company_name',
                key: 'company_name',
                render: (text, record) => {
                    return <Tooltip placement="topLeft"
                                    title={text}><a href={`/businessInformation/${record.id}`}>{text ? (text.length < 12 ? text : text.substr(0, 12) + "...") : text}</a></Tooltip>
                }
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                render: (text, record) => {
                    return <Tooltip placement="topLeft"
                                    title={text}><span>{text ? (text.length < 8 ? text : text.substr(0, 8) + "...") : text}</span></Tooltip>
                }
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                width: 150,
                key: 'mobile',
            },
            {
                title: '注册时间',
                dataIndex: 'created_date',
                width: 150,
                key: 'created_date'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 80,
                render: (text, record) => (<span>{text == 0 ? "正常" : "已禁用"}</span>),
            },
            {
                title: '操作',
                key: 'action',
                width: 190,
                render: (text, record) => (
                    <span>
                        <a onClick={(type, id) => this.showModal("addVisible", record)}>修改</a>
                        <a className="ml15"
                           onClick={(type, id) => this.showModal("visible", record)}>{record.status == 0 ? "禁用" : "启用"}</a>
                        <a className="ml15" onClick={(type, id) => this.showModal("passwordVisible", record)}>重置密码</a>
                    </span>),
            },
        ];
    }

    async componentDidMount() {
        this.getTableData({page: 1, max_line: 20});
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const industryData = selectIndustryData.data;
        if (industryData && industryData.success) {
            this.setState({
                industryData: industryData.data
            })
        }
    }

    getTableData = async (values = {}) => {
        if (cookie.load('userId')) {
            values.member_id = parseInt(cookie.load('userId'));
        }
        const tableData = await request('/company/ori-list', 'POST', values); //获取table
        if (tableData.status == 200) {
            this.setState({
                tableData: tableData.data,
                formValues: values
            });
        }
    }
    onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        let {formValues = {}} = this.state;
        formValues.page = current;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }

    onPaginChange = (page, pageSize) => {
        console.log(page, pageSize);
        let {formValues = {}} = this.state;
        formValues.page = page;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }
    showModal = (type, record) => {
        this.setState({
            [type]: true,
            record
        });
        if(type==="viewVisible"){
            this.getUserTableData(record);
        }
    };
    setAuth = async(record) => {
        const req = await request('/admin/update-member-type', 'POST', {member_id:record.member_id}); //获取table
        if (req.data.success) {
            message.success(req.data.msg);
            setTimeout(()=>{
                this.getTableData(this.state.formValues);
            },2000);
        }else{
            message.error(req.data.msg);
        }
    }
    handleCancel = type => {
        this.setState({
            [type]: false,
            userTableData: type === "viewVisible" ? [] : this.state.userTableData
        });

    };
    getUserTableData = async (values = {}) => {
        if (cookie.load('userId')) {
            values.member_id = parseInt(cookie.load('userId'));
        }
        const tableData = await request('/company/list', 'POST', values); //获取table
        if (tableData.status == 200) {
            this.setState({
                userTableData: tableData.data,
                userFormValues:values
            });
        }
    }

    resetPasswordOk = async () => {
        const {record} = this.state;
        const res = await request('/admin/reset-password', 'POST', {member_id: record.id, password: record.password}); //获取table
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
    handleStateOk = async () => {
        const {record,userFormValues} = this.state;
        const res = await request('/admin/update-status-user', 'POST', {member_id: record.id, status: record.status}); //获取table
        if (res.data && res.data.success) {
            message.success(res.data.msg);
            this.setState({
                visible: false,
                record: null
            });
            setTimeout(() => {
                this.getUserTableData(userFormValues);
            }, 1000);
        } else {
            message.error(res.data.msg);
        }
    }
    onSelectStatus = (value) => {
        this.setState({
            serarchStatus: value
        })
        console.log(value);
    }
    onSearchFinish = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.getTableData({
                    ...this.state.formValues, ...values,
                    status: this.state.serarchStatus == -1 ? undefined : this.state.serarchStatus
                });
            }
        });
    }
    onReset = () => {
        this.setState({
            status: null
        }, () => {
            this.props.form.resetFields();
        })
    };
    userCallback = () => {
        this.setState({
            addVisible: false,
            record: null
        });
        setTimeout(() => {
            this.getTableData(this.state.formValues);
        }, 1000);
    }

    render() {
        const {labelStatus, status, industryData, formValues, tableData, record,userTableData} = this.state;
        const {getFieldDecorator} = this.props.form;
        const pagination = {
            current: formValues && formValues.page ? formValues.page : 1,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 20,
            total: tableData.sum || 0,
            showTotal: (total, range) => `共 ${tableData.page_num} 页 总计 ${tableData.sum} 条政策`,
            pageSizeOptions: ['10', '20', '30', '50', '100', '150'],
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onPaginChange
        }
        return (
            <div className="policyUser-template">
                <Top/>
                <div className="policyUser-label-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <PolicyManagementMenu menu="systemManagement" current="enterprise"/>
                        </Col>
                        <Col span={20}>
                            <Title name="企业用户"/>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                                <Breadcrumb.Item href="">企业用户</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="label-box">
                                <Form ref="searchForm" {...layout} name="dynamic_rule" onSubmit={this.onSearchFinish}>
                                    <div>
                                        <Row>
                                            <Col span={10}>
                                                <Row>
                                                    <Col span={7}>企业名称</Col>
                                                    <Col span={17}>
                                                        <Form.Item>
                                                            {getFieldDecorator('company_name')(
                                                                <Input style={{width:"250px"}}/>
                                                            )}
                                                        </Form.Item>

                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={9}>
                                                <Row>
                                                    <Col span={9}>统一社会信用代码</Col>
                                                    <Col span={15}>
                                                        <Form.Item>
                                                            {getFieldDecorator('code')(
                                                                <Input style={{width:"250px"}}/>
                                                            )}
                                                        </Form.Item>

                                                    </Col>
                                                </Row>
                                            </Col>
                                            {/*<Col span={7}>*/}
                                                {/*<Label callback={this.onSelectStatus} defalutValue={status}*/}
                                                       {/*isRadio={true} span={{title: 6, label: 18}}*/}
                                                       {/*title={labelStatus.title} item={labelStatus.item}*/}
                                                       {/*key="labelStatus"/>*/}
                                            {/*</Col>*/}
                                        </Row>
                                    </div>
                                    <div className="search-button">
                                        <Button type="primary" htmlType="submit">检索</Button>
                                        <Button className="ml15" onClick={this.onReset}>重置</Button>
                                    </div>
                                </Form>
                            </div>
                            <p align="right" className="operation-button">
                                <Button type="primary"
                                        onClick={(type, id) => this.showModal("addVisible")}>添加用户</Button></p>
                            {tableData ?
                                <Table columns={this.columns} dataSource={tableData.result} pagination={pagination}
                                       rowKey="id"/> : null}
                        </Col>
                    </Row>
                </div>
                <Modal
                    title="温馨提示"
                    visible={this.state.viewVisible}
                    onCancel={(type) => this.handleCancel("viewVisible")}
                    width={1000}
                    footer={null}
                >
                    {userTableData ?
                        <Table columns={this.columns1} dataSource={userTableData.result} pagination={false}
                               rowKey="id"/> : null}
                </Modal>
                <Modal
                    title="温馨提示"
                    visible={this.state.visible}
                    onCancel={(type) => this.handleCancel("visible")}
                    footer={[
                        <Button key="back" onClick={this.handleStateOk}>
                            确定
                        </Button>,
                        <Button key="submit" type="primary" onClick={(type) => this.handleCancel("visible")}>
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
                    onCancel={(type) => this.handleCancel("passwordVisible")}
                    footer={[
                        <Button key="back" onClick={this.resetPasswordOk}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={(type) => this.handleCancel("passwordVisible")}>
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
                {this.state.addVisible ? <AddUser record={record} callback={() => this.userCallback()}
                                                  handleCancel={this.handleCancel}/> : null}
            </div>
        );
    };
}

export default Form.create()(enterprise);