/**
 * 申报项目
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Tag, Input, Row, Col, Button, Select, DatePicker, Modal } from 'antd';
// import { ArrowUpOutlined,ArrowDownOutlined,PlusOutlined,MinusOutlined } from '@ant-design/icons';
import axios from 'axios';
import Top from './../../component/top';
// import Footer from "../../component/footer";
import Label from "../../component/label";
import './index.css';
import {request} from "../../utils/request";
import cookie from "react-cookies";
import {message} from "antd/lib/index";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

class DeclarationItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrdown:true,
            arrProduct:false,
            labelDate:{
                title:"发文日期",
                item:[
                    {
                        id:0,
                        name:"全部",
                    },
                    {
                        id:2020,
                        name:"2020年",
                    },
                    {
                        id:2019,
                        name:"2019年",
                    },
                    {
                        id:2018,
                        name:"2018年",
                    },
                    {
                        id:2017,
                        name:"2017年",
                    },
                    {
                        id:2016,
                        name:"2016年",
                    },
                    {
                        id:2015,
                        name:"2015年",
                    },
                    {
                        id:2014,
                        name:"2014年",
                    },
                    {
                        id:2013,
                        name:"2013年",
                    },
                    {
                        id:2012,
                        name:"2012年",
                    },
                    {
                        id:2011,
                        name:"2011年",
                    }]
            }
        }
        this.columns = [
            {
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                render: text => <a href="/itemText">{text}</a>,
            },
            {
                title: '应用类型',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '发布机构',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '扶持金额',
                key: 'money',
                dataIndex: 'money'
            },
            {
                title: '发文日期',
                key: 'time',
                dataIndex: 'time'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (<span><a onClick={this.showModal}>立即申报</a><a className="ml15" onClick={()=>this.onCollection(record.id)}>收藏</a></span>),
            },
        ];

        this.data = [
            {
                key: '1',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
            },
            {
                key: '2',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
            },
            {
                key: '3',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
            },
            {
                key: '4',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
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
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型
        const selectBelongData = await request('/common/get-all-belong-label', 'POST'); //所属层级
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业


        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const belongData = selectBelongData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && belongData && belongData.success && industryData && industryData.success) {
            const allItem = {id: 0,name: "全部"};
            themData.data.unshift(allItem);
            typeData.data.unshift(allItem);
            belongData.data.unshift(allItem);
            industryData.data.unshift(allItem);
            this.setState({
                labelTheme: {
                    title: "政策主题",
                    item: themData.data
                },
                labelType: {
                    title: "应用类型",
                    item: typeData.data
                },
                belongData: belongData.data,
                industryData: industryData.data

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
    getTableData = () =>{

    }
    belongChange = async (value) => {
        const labelProductData = await request('/common/get-all-organization-label', 'POST', {belong_id: value}); //发布机构
        const productData = labelProductData.data;
        if (productData && productData.success) {
            this.setState({
                labelProduct: {
                    title: "发布机构",
                    item: productData.data
                }
            })
        }
    }
    setArrdown = () =>{
        this.setState({
            arrdown:!this.state.arrdown
        });
    }
    setArrProduct = () =>{
        this.setState({
            arrProduct:!this.state.arrProduct
        })
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
        const {arrdown,labelType,labelProduct,arrProduct,belongData,industryData,labelTheme,labelDate} = this.state;
        return (
            <div className="declarationItem-template">
                <Top />
                <div className="declarationItem-label-box max-weight-box">
                    <Row className="declarationItem-serach">
                        <Col span={12}>
                        <Search
                            enterButton="查询"
                            size="large"
                            onSearch={value => console.log(value)}
                        />
                        </Col>
                        <Col span={8} className="serach-arrow">
                            {arrdown ? <span onClick={this.setArrdown}>收起筛选
                                {/*<ArrowUpOutlined />*/}
                                </span> : <span onClick={this.setArrdown}>展开筛选
                                {/*<ArrowDownOutlined />*/}
                                </span>}
                        </Col>
                    </Row>
                    <div className="label-box" style={!arrdown ? {display:"none"} : {}}>
                        {labelTheme ?
                            <Label span={{title:4,label:20}} title={labelTheme.title} item={labelTheme.item} key="labelTheme"/> : ''}
                        <Row className="mt10">
                            <Col span={4}>所属层级</Col>
                            <Col span={20}>
                                <Select style={{width: 300}} onChange={this.belongChange}>
                                    {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                        key={item.id}>{item.name}</Option>) : ''}
                                </Select>
                            </Col>
                        </Row>
                        <div className="label-product-box">
                            {labelProduct ?
                                <Label title={labelProduct.title} item={labelProduct.item} key="labelProduct"
                                       span={{title:4,label:20}} className={arrProduct ? "allLabel" : "minLabel"}/> : ''}
                            {labelProduct ? (!arrProduct ? <span onClick={this.setArrProduct}
                                                                 className="more-label">
                                    {/*<PlusOutlined/>*/}
                                    展开</span> :
                                <span onClick={this.setArrProduct}
                                      className="more-label">
                                    {/*<MinusOutlined/> */}
                                    收起</span>) : ''}
                        </div>
                        {labelType ?
                            <Label span={{title:4,label:20}} title={labelType.title} item={labelType.item} key="labelType"/> : ''}
                        <Row className="mt10">
                            <Col span={4}>所属行业</Col>
                            <Col span={20}>
                                <Select style={{width: 300}}>
                                    {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                            key={item.id}>{item.name}</Option>) : ''}
                                </Select>
                            </Col>
                        </Row>
                        <Label span={{title:4,label:20}} title={labelDate.title} item={labelDate.item} key="labelDate" />
                        {/*<Row className="mt10">*/}
                            {/*<Col span={2}>发文日期：</Col>*/}
                            {/*<Col span={22}>*/}
                                {/*<RangePicker showTime />*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                        <div className="declarationItem-button">
                            <Button type="primary">检索</Button>
                            <Button className="ml15">重置</Button>
                        </div>
                    </div>
                    <Table columns={this.columns} dataSource={this.data} pagination={this.pagination} />
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

export default DeclarationItem;