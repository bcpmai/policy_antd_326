/**
 * 我的收藏
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Input, Row, Col, Select,Menu,Table,Tabs,Modal,message} from 'antd';
//import { EditOutlined } from '@ant-design/icons';
// import { EditOutlined,AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import Top from '../../../component/top/index';
import Title from "../../../component/title/index";
import './index.css';
import EnterpriseMenu from '../../../component/enterpriseCenterMenu';
import {request} from "../../../utils/request";
import cookie from "react-cookies";

const { Search } = Input;
const { Option } = Select;
const { SubMenu } = Menu;
const { TabPane } = Tabs;
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};


class MyCollection extends Component {
    constructor(props){
        super(props);
        this.state = {
            mode: 'top',
            tableData:[],
            tabTitle:['综合政策','创业扶持','市场/行业准入','技术改造','资金支持','资质认定','综合政策','创业扶持','市场/行业准入','技术改造','资金支持','资质认定','综合政策','创业扶持','市场/行业准入','技术改造','资金支持','资质认定']
        }

        this.columns = [
            {
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                width:400,
                render: (text, record) => <a href={`/policyText/${record.id}`}>{text}</a>,
            },
            {
                title: '发布机构',
                dataIndex: 'organization_label_str',
                key: 'organization_label_str',
            },
            {
                title: '发文字号',
                dataIndex: 'post_shop_name',
                key: 'post_shop_name'
            },
            {
                title: '发文日期',
                key: 'release_date',
                dataIndex: 'release_date',
                width:200
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (<span><a onClick={()=>this.cancelCollection(record.id,1)} className="ml15">已收藏</a></span>),
            },
        ];
        this.columns2 = [
            {
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                width:400,
                render: (text, record) => <a href={`/itemText/${record.id}`}>{text}</a>,
            },
            {
                title: '应用类型',
                dataIndex: 'use_type_label_str',
                key: 'use_type_label_str',
            },
            {
                title: '发布机构',
                dataIndex: 'organization_label_str',
                key: 'organization_label_str'
            },
            {
                title: '扶持金额',
                dataIndex: 'theme',
                key: 'theme'
            },
            {
                title: '发文日期',
                key: 'created_date',
                dataIndex: 'created_date',
                width:200
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (<span><a onClick={()=>this.showModal(record)}>立即申报</a><a onClick={()=>this.cancelCollection(record.id,2)} className="ml15">已收藏</a></span>),
            },
        ];

    }
    async componentDidMount() {
        this.getTableData({page:1,
            max_line:20,resource_type:1});
    }
    callback = (key) => {
        this.getTableData({page:1,
            max_line:20,resource_type:parseInt(key)});
    }
    getTableData = async (values) =>{
        const tableData = await request('/company/get-collection', 'POST',{member_id:cookie.load('userId'),...values}); //获取table
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
    showModal = (record) => {
        this.setState({
            visible: true,
            record
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    cancelCollection = async (id,type) =>{
        const res = await request('/common/cancel-company-collection', 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type: type}); //获取table
        if(res.status == 200 && res.data.success){
            message.success(res.data.msg);
            this.getTableData({...this.state.formValues,resource_type:type});
        }else{
            message.error(res.data.msg)
        }
    }
    onSearchTitle = (value) =>{
        this.getTableData({...this.state.formValues,title:value});
    }
    render() {
        const {mode,tabTitle,tableData,formValues,record} = this.state;
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
            <div className="myCollection-template">
                <Top />
                <div className="myCollection-form-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <EnterpriseMenu menuKey="myCollection" />
                        </Col>
                        <Col span={20}>
                        <Title name="我的收藏" />
                    <div className="myCollection-tab">
                        <Tabs onChange={this.callback} type="card">
                            <TabPane tab="最新政策" key="1">
                                <div className="myCollection-search">
                                    <Search onSearch={value => this.onSearchTitle(value)} enterButton="查询" />
                                </div>
                                {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                            </TabPane>
                            <TabPane tab="申报政策" key="2">
                                <div className="myCollection-search">
                                    <Search onSearch={value => this.onSearchTitle(value)} enterButton="查询" />
                                </div>
                                {tableData ? <Table columns={this.columns2} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                            </TabPane>
                        </Tabs>
                    </div>

                        </Col>
                    </Row>
                </div>
                <Modal
                    title="申报提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="删除"
                    cancelText="关闭"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            关闭
                        </Button>
                    ]}
                >
                    <p>该项目网上申报后，需提交纸质材料。</p>
                    <Row>
                        <Col span={8}>1.点击进入网上申报：</Col>
                        <Col span={16}>
                            <span>{record!=undefined ? record.declare_net : null}</span>
                            {record!=undefined ? <a className="model-button" href={record.declare_net} target="_blank">网上申报</a> : null}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>2.纸质材料提交至</Col>
                        <Col span={16}>{record!=undefined ? record.post_material : null}
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    };
}

export default MyCollection;