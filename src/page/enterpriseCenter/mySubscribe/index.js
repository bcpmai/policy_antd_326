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
            mode: 'top',
            tabTitle:['综合政策','创业扶持','市场/行业准入','技术改造','资金支持','资质认定','综合政策','创业扶持','市场/行业准入','技术改造','资金支持','资质认定','综合政策','创业扶持','市场/行业准入','技术改造','资金支持','资质认定']
        }

        this.columns = [
            {
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                width:350,
                render: text => <a>{text}</a>,
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
    async componentWillMount() {
        this.getLabel();
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
    showModal = () => {
        this.setState({
            visible: true,
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
        });
    };
    handleOk = () =>{

    }

    getTableData = () =>{

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
    render() {
        const {mode,tabTitle,label} = this.state;
        return (
            <div className="mySubscribe-template">
                <Top />
                <div className="mySubscribe-form-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <EnterpriseMenu menuKey="mySubscribe" />
                        </Col>
                        <Col span={20}>
                        <Title name="我的订阅" />
                            <div align="right">
                                <Button onClick={this.subscribeVisble}>订阅编辑</Button>
                            </div>
                    <div>
                        <Tabs defaultActiveKey="1" tabPosition={mode}>
                            {tabTitle.map((item,idx) => (
                                <TabPane tab={item} key={idx}>
                                    Content of tab {idx}
                                </TabPane>
                            ))}
                        </Tabs>
                    </div>
                            <Table columns={this.columns} dataSource={this.data} pagination={this.pagination} />
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
                <Modal
                    title="订阅编辑"
                    visible={this.state.subscribeVisble}
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
                        return <Label span={{title:3,label:21}} onClick={()=>this.labelChange()} title={labelItem.title} item={labelItem.item} key={labelIdx} />
                    })}
                </Modal>
            </div>
        );
    };
}

export default MySubscribe;