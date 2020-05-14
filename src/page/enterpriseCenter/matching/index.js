/**
 * 精准匹配
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Row, Col, Select,Menu,Table, Modal,Icon,Progress} from 'antd';
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
                title: '发文日期',
                key: 'release_date',
                dataIndex: 'release_date',
                render: (text, record) => {
                    return (
                        <div>
                            <p className="release_date-year">{text.substr(0,4)}</p>
                            <p className="release_date-date">{text.substr(5)}</p>
                        </div>
                    )
                }
            },
            {
                title: '匹配度',
                dataIndex: 'score',
                key: 'score',
                width:100,
                render: (text, record) =>{
                    let strokeColor;
                    if(record.is_gray){
                        strokeColor = "#cfcfcf";
                    }
                    else if(record.is_max){
                        strokeColor = undefined;
                    }
                    return (
                    <div align="center" className="score-box">
                        <p><Progress
                            format={percent => `${percent}%`} type="circle" percent={record.score} width={60} strokeColor={strokeColor} /></p>
                        <p>匹配度</p>
                    </div>)},
            },
            {
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    let style = {};
                    if(record.is_gray){
                        style.color = "#cfcfcf";
                    }
                    else if(record.is_max){
                        style.color = "#d13234";
                        style.fontWeight = "bold";
                    }
                    return (
                        <div className="policy-title-box">
                            <p className="policy-title"><a href={`/itemText/${record.id}`} style={style}>{text}</a></p>
                            <p><span className="title">发布机构：</span>{record.organization_label_str}</p>
                            <p><span className="title">应用类型：</span>{record.use_type_label_str}</p>
                            {record.money == "0" || record.money == "" ? <p><span className="title">扶持金额：</span>——</p>: <p><span className="title">扶持金额：</span>{record.money}万元</p>}
                            {record.declare_start_at == 0 && record.declare_end_at == 0 ? <p><span className="title">申报日期：</span>——</p> :<p><span className="title">申报日期：</span>{record.declare_start_date} 至 {record.declare_end_date}</p>}
                        </div>
                    )
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <div align="right" className="action-butn">
                        <p><Button onClick={()=>this.showModal(record)}>立即申报</Button></p>
                        <Button icon={record.resource_id <= 0 ? "star" : ""} onClick={()=>this.onCollection(record.id,record.resource_id)}>{record.resource_id > 0 ? "已收藏" : "收藏"}</Button>
                    </div>),
            },
        ];
    }
    async componentDidMount() {
        this.getTableData()
    }
    //收藏
    onCollection = async (id,isColle) =>{
        let url = '/common/my-company-collection';
        if(isColle){
            url = '/common/cancel-company-collection';
        }
        const responest = await request(url, 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type:2}); //收藏
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
    render() {
        const {labelTheme, labelType,record, labelProduct, arrProduct, labelStatus, labelSource, belongData, industryData, source,policy_theme_label_list,organization_label_list,use_type_list,status,tableData,formValues,arrdown} = this.state;
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
                            <div className="information-title-h1">
                                <div className="alert-box">
                                    <Icon type="exclamation-circle" theme="filled" />
                                    <span>您可完善企业信息，精准匹配申报政策</span>
                                </div>
                                <Button onClick={()=>{window.location.href="/information"}} type="primary" icon="edit" className="button-edit">完善信息</Button>
                            </div>
                            {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" rowClassName={(record,index)=> {return record.is_gray ? "gray-tr" : ""}} /> : null}
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
                    {record!=undefined && record.declare_net ?
                    <Row>
                        <Col span={8}>1.点击进入网上申报：</Col>
                        <Col span={16}>
                            <span>{record!=undefined ? record.declare_net : null}</span>
                            {record!=undefined ? <a className="model-button" href={record.declare_net} target="_blank" style={{margin:"0 0 0 5px"}}>网上申报</a> : null}
                        </Col>
                    </Row> : null}
                    {record!=undefined && record.post_material ?
                    <Row>
                        <Col span={8}>{record!=undefined && record.declare_net ? "2" : "1"}.纸质材料提交至</Col>
                        <Col span={16}>{record!=undefined ? record.post_material : null}
                        </Col>
                    </Row> : null}
                </Modal>
            </div>
        );
    };
}

export default Matching;