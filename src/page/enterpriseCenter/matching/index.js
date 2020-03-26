/**
 * 精准匹配
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Form, Input, InputNumber, Row, Col, Select,DatePicker,Menu,Table, Modal} from 'antd';
//import { EditOutlined } from '@ant-design/icons';
// import { EditOutlined,AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import Top from '../../../component/top/index';
// import Footer from "../../../component/footer/index";
import './index.css';
import EnterpriseMenu from '../../../component/enterpriseCenterMenu';
import Title from "../../../component/title/index";
import cookie from "react-cookies";
import {message} from "antd/lib/index";
import {request} from "../../../utils/request";

const { Option } = Select;
const { SubMenu } = Menu;
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

class Matching extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData:{}
        }

        this.columns = [
            {
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                width:350,
                render: text => <a href="/itemText">{text}</a>,
            },
            {
                title: '应用类型',
                dataIndex: 'hierarchy',
                key: 'hierarchy'
            },
            {
                title: '发布机构',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '扶持金额',
                dataIndex: 'theme',
                key: 'theme'
            },
            {
                title: '申报日期',
                key: 'time',
                dataIndex: 'time',
                width:200
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (<span><a onClick={this.showModal}>立即申报</a><a onClick={()=>this.onCollection(record.id)} className="ml15">收藏</a></span>),
            },
        ];

        this.data = [
            {
                key: '1',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                hierarchy: "资金支持",
                address: '工业和信息化部',
                theme: '10万',
                time:'2019-02-01 12:05:11'
            },
            {
                key: '2',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                hierarchy: "资金支持",
                address: '工业和信息化部',
                theme: '10万',
                time:'2019-02-01 12:05:11'
            },
            {
                key: '3',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                hierarchy: "资金支持",
                address: '工业和信息化部',
                theme: '10万',
                time:'2019-02-01 12:05:11'
            },
            {
                key: '4',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                hierarchy: "资金支持",
                address: '工业和信息化部',
                theme: '10万',
                time:'2019-02-01 12:05:11'
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
    async componentDidMount() {
        this.getTableData()
    }
    //收藏
    onCollection = async (id) =>{
        const responest = await request('/common/my-company-collection', 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type:2}); //收藏
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);
            this.getTableData();
        }else{
            message.error(data.msg);
        }
    }
    getTableData = async (values) =>{
        const tableData = await request('/declare/matching', 'POST',{member_id:cookie.load('userId')}); //获取table
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
    onChange = (date, dateString) =>{
        console.log(date, dateString);
    }
    showModal = () => {
        this.setState({
            visible: true,
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
    render() {
        const {labelTheme, labelType, labelProduct, arrProduct, labelStatus, labelSource, belongData, industryData, source,policy_theme_label_list,organization_label_list,use_type_list,status,tableData,formValues,arrdown} = this.state;
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
            <div className="matching-template">
                <Top />
                <div className="matching-form-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <EnterpriseMenu menuKey="matching"/>
                        </Col>
                        <Col span={20}>
                            <Title name="精准匹配" />
                    <div className="matching-title-h1">
                        <span>您可完善企业信息，精准匹配申报政策</span>
                        {/*<Button type="primary" className="button-matching">精准匹配</Button>*/}
                        <Button onClick={()=>{window.location.href="/information"}} type="primary" /*icon={<EditOutlined />}*/ className="button-edit">完善信息</Button>
                    </div>
                            {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
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
                            <span>http://web.js.policy.com</span>
                            <Button className="model-button" key="submit" onClick={()=>{window.open('http://web.js.policy.com/declarationItem')}}>网上申报</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>2.纸质材料提交至</Col>
                        <Col span={16}>重庆市九龙坡区人民政府<br />王先生  18809870987
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    };
}

export default Matching;