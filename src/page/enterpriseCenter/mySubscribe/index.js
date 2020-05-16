/**
 * 我的订阅
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Button, Row, Col, Table,Tabs,Modal} from 'antd';
// import { EditOutlined,AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import Top from '../../../component/top/index';
import './index.css';
import EnterpriseMenu from '../../../component/enterpriseCenterMenu';
import Title from "../../../component/title/index";
import cookie from "react-cookies";
import {message} from "antd/lib/index";
import {request} from "../../../utils/request";
import Label from "../../../component/label";

const { TabPane } = Tabs;

class MySubscribe extends Component {
    constructor(props){
        super(props);
        this.state = {
            subScribeData:{},
            mode: 'top',
            tableData:[],
        }

        this.columns = [
            {
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                width:350,
                render: (text,record) => <a href={`/itemText/${record.id}`} target="_blank">{text}</a>,
            },
            {
                title: '应用类型',
                dataIndex: 'use_type_label_str',
                key: 'use_type_label_str'
            },
            {
                title: '发布机构',
                dataIndex: 'organization_label_str',
                key: 'organization_label_str',
            },
            {
                title: '扶持金额',
                dataIndex: 'theme',
                key: 'theme'
            },
            {
                title: '申报日期',
                key: 'created_date',
                dataIndex: 'created_date',
                width:200
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (<span><a onClick={()=>this.showModal(record)}>立即申报</a><a className="ml15" onClick={()=>this.onCollection(record.id,record.resource_id != "0")}>{record.resource_id != "0" ? "已收藏": "收藏"}</a></span>),
            },
        ];
    }
    async componentWillMount() {
        this.getSubScribe();
        this.getLabel();
        this.getTableData();
    }
    getTableData = async (values={page:1,max_line:20}) =>{
        if(cookie.load('userId')){
            values.member_id = parseInt(cookie.load('userId'));
        }
        const tableData = await request('/company/get-sub-list', 'POST',{...values,status:2}); //获取table
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
    getSubScribe = async () =>{
        const subScribeData = await request('/company/get-sub-declare-list', 'POST',{member_id:cookie.load('userId')}); //获取table
        console.log(subScribeData)
        if(subScribeData.status == 200){
            this.setState({
                subScribeData: subScribeData.data,
            });
        }
    }
    //获取标题
    getLabel = async () =>{
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业


        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && industryData && industryData.success) {
            const allItem = {id: 0,name: "全部"};
            themData.data.unshift(allItem);
            typeData.data.unshift(allItem);
            industryData.data.unshift(allItem);
            this.setState({
                label:[{
                    title: "政策主题：",
                    item: themData.data
                },
                    {
                        title: "应用类型：",
                        item: typeData.data
                    },
                    {
                        title:"所属行业：",
                        item: industryData.data
                    }]
            })
        }
    }
    //收藏
    onCollection = async (id,isCollection) =>{
        let url = '/common/my-company-collection';
        if(isCollection){
            url = '/common/cancel-company-collection';
        }
        const responest = await request(url, 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type:2}); //收藏
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);

            this.getTableData(this.state.formValues);
        }else{
            message.error(data.msg);
        }
    }
    showModal = (record) => {
        this.setState({
            visible: true,
            record
        });
    };
    handleSubscribeCancel = e => {
        // this.getLabel();
        this.setState({
            subscribeVisble: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            record:null
        });
    };
    handleOk = async () =>{
        const {organization_label_list,use_type_list,industry_label_list} = this.state;
        const res = await request('/common/my-company-sub', 'POST',{
            member_id:cookie.load('userId'),
            use_type_declare_list:use_type_list,
            industry_label_list:industry_label_list,
            policy_theme_label_list:organization_label_list
        }); //订阅
        const data = res.data;
        if(data && data.success){
            message.success(data.msg);
            this.getSubScribe();
            this.setState({
                subscribeVisble: false,
            });
        }else{
            message.error(data.msg);
        }

    }

    onChange = (date, dateString) =>{
        console.log(date, dateString);
    }
    handleModeChange = e => {
        const mode = e.target.value;
        this.setState({ mode });
    };
    subscribeVisble = () =>{
        this.setState({ subscribeVisble:true });
    }
    setDeclarePush = (list,idx) =>{
        let key = ["organization_label_list","use_type_list","industry_label_list"];
        this.setState({
            [key[idx]]:list
        })
    }
    tabsChange = (key) =>{
        let {formValues={}} = this.state;
        if(!key){
            formValues.label_name = undefined;
            formValues.label_id = undefined;
        }else {
            const keyArr = key.split(",");
            formValues.label_name = keyArr[0];
            formValues.label_id = parseInt(keyArr[1]);
        }
        this.getTableData(formValues);
    }
    render() {
        const {mode,subScribeData,label,tableData,formValues,record} = this.state;
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
            <div className="mySubscribe-template">
                <Top />
                <div className="mySubscribe-form-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <EnterpriseMenu menuKey="mySubscribe" />
                        </Col>
                        <Col span={20}>
                            <div>
                                <Button icon="edit" style={{float:"right"}} onClick={this.subscribeVisble}>订阅编辑</Button>
                                <Title name="我的订阅" />
                                </div>
                    <div>
                        <Tabs onChange={this.tabsChange} defaultActiveKey="1" tabPosition={mode}>
                            <TabPane tab="全部" key={null}>
                                全部
                            </TabPane>
                            {subScribeData.industry_label ? subScribeData.industry_label.map((item,idx) => {
                                return(
                                    <TabPane tab={item.name} key={"industry_label,"+item.id}>
                                        {item.name}
                                    </TabPane>
                                )
                            }) : null}
                            {subScribeData.use_type_declare ? subScribeData.use_type_declare.map((item,idx) => {
                                return (
                                <TabPane tab={item.name} key={"use_type_declare,"+item.id}>
                                    {item.name}
                                </TabPane>)
                            }): null}
                            {subScribeData.policy_theme_label ? subScribeData.policy_theme_label.map((item,idx) => {
                                return (
                                    <TabPane tab={item.name} key={"policy_theme_label,"+item.id}>
                                        {item.name}
                                    </TabPane>
                                )
                            }) : null}
                        </Tabs>
                    </div>
                            {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                        </Col>
                    </Row>
                </div>
                <Modal
                    title="申报提示"
                    visible={this.state.visible}
                    okText="删除"
                    cancelText="关闭"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleCancel}>
                            关闭
                        </Button>
                    ]}
                >
                    <p>该项目网上申报后，需提交纸质材料。</p>
                    {record!=undefined && record.declare_net ?
                    <Row>
                        <Col span={8}>1.点击进入网上申报：</Col>
                        <Col span={16}>
                            <a href={record.declare_net.indexOf("http") == -1 ? "http://"+record.declare_net.trim() : record.declare_net} target="_blank">{record!=undefined ? record.declare_net : null}</a>
                            {record!=undefined ? <a className="model-button" href={record.declare_net.indexOf("http") == -1 ? "http://"+record.declare_net.trim() : record.declare_net} target="_blank">网上申报</a> : null}
                        </Col>
                    </Row> : null}
                    {record!=undefined && record.post_material ?
                        <Row>
                        <Col span={8}>{record!=undefined && record.declare_net ? "2" : "1"}.纸质材料提交至</Col>
                        <Col span={16}>{record!=undefined ? record.post_material : null}
                        </Col>
                    </Row> : null}
                </Modal>
                {this.state.subscribeVisble ? <Modal
                    title="订阅编辑"
                    visible
                    onOk={this.handleOk}
                    onCancel={this.handleSubscribeCancel}
                    width={900}
                    footer={[
                        <div>
                            <Button key="submit" type="primary" onClick={this.handleOk}>
                                确定
                            </Button>
                            <Button type="primary" onClick={this.handleSubscribeCancel}>
                            取消
                            </Button>
                        </div>
                    ]}
                >
                    <p>请选择您感兴趣的标签，智能匹配相关申报政策。</p>
                    {label && label.map((labelItem,labelIdx)=>{
                        let value = labelIdx == 0 ? subScribeData.policy_theme_label : (labelIdx == 1 ? subScribeData.use_type_declare:subScribeData.industry_label);
                        let id=[];
                        value.map((sitem,sidx)=>{
                            id.push(sitem.id);
                        });
                        return <Label callback={(list)=>this.setDeclarePush(list,labelIdx)} defalutValue={id} span={{title:3,label:21}} onClick={()=>this.labelChange()} title={labelItem.title} item={labelItem.item} key={labelIdx} />
                    })}
                </Modal> : null}
            </div>
        );
    };
}

export default MySubscribe;