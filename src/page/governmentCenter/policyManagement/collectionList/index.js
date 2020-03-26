/**
 *  采集列表
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Input, Row, Col, Button, Select, DatePicker, Breadcrumb } from 'antd';
// import { ArrowUpOutlined,ArrowDownOutlined,PlusOutlined,MinusOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import Top from '../../../../component/top/index';
import Label from "../../../../component/label/index";
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import {request} from "../../../../utils/request";

const { Option } = Select;
const { RangePicker } = DatePicker;

class CollectionList extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrdown:true,
            arrProduct:false,
            // labelTheme:{
            //         title:"政策主题",
            //         item:["全部","综合政策","财税支持","融资促进","市场开拓","服务措施","权益保护","创业扶持","创新支持","监督检查","其他"]
            //     },
            // labelType:
            //     {
            //         title:"应用类型",
            //         item:["全部","规范规划类","资金支持类","税费减免类","资质认定类","行业管制类"]
            //     },
            // labelProduct:{
            //     title:"发布机构",
            //     item:["全部","国务院","国家发展和改革委员会","工业和信息化部","国务院办公厅","科学技术部","自然资源部","财政部","司法部","人力资源和社会保障部","生态环境部"]
            // },
            // labelStatus:{
            //     title:"状态",
            //     item:["全部","暂存","已发布"]
            // },
            // labelSource:{
            //     title:"来源",
            //     item:["全部","爬虫","人工"]
            // }
        }
        this.columns = [
            {
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                width:400,
                render: text => <a>{text}</a>,
            },
            {
                title: '所属层级',
                dataIndex: 'hierarchy',
                key: 'hierarchy'
            },
            {
                title: '发布机构',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '采集时间',
                key: 'time',
                dataIndex: 'time',
                width:200
            }
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
        })
    }
    setArrProduct = () =>{
        this.setState({
            arrProduct:!this.state.arrProduct
        })
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    render() {
        const {labelProduct,arrProduct,selectedRowKeys,belongData} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="collectionList-template">
                <Top />
                <div className="collectionList-label-box max-weight-box">
                <Row>
                    <Col span={4}>
                        <PolicyManagementMenu current="collectionList" />
                    </Col>
                    <Col span={20}>
                        <Title name="采集列表" />
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>政策管理</Breadcrumb.Item>
                        <Breadcrumb.Item href="">采集列表</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="label-box">
                        <Row className="mt10">
                            <Col span={4}>政策标题</Col>
                            <Col span={20}>
                                <Input />
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={4}>所属层级</Col>
                            <Col span={20}>
                                <Select style={{ width: 300 }} onChange={this.belongChange}>
                                    {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                        key={item.id}>{item.name}</Option>) : ''}
                                </Select>
                            </Col>
                        </Row>
                        <div className="label-product-box">
                            {labelProduct ? <Label title={labelProduct.title} item={labelProduct.item} key="labelProduct"
                                                   span={{title:4,label:20}} className={arrProduct ? "allLabel" : "minLabel"}/> : ''}
                            {labelProduct ? (!arrProduct ? <span onClick={this.setArrProduct}
                                                                 className="more-label">
                                    {/*<PlusOutlined/>*/}
                                    展开</span> :
                                <span onClick={this.setArrProduct}
                                      className="more-label">
                                    {/*<MinusOutlined/> */}
                                    收起</span>) : ''} </div>
                        <Row className="mt10">
                            <Col span={4}>发文日期</Col>
                            <Col span={20}>
                                <RangePicker showTime />
                            </Col>
                        </Row>
                        <div className="search-button">
                            <Button type="primary">检索</Button>
                            <Button className="ml15">重置</Button>
                        </div>
                    </div>
                        <p align="right" className="operation-button">
                            <Button type="primary">所属层级/发布机构</Button>
                            <Button type="primary" className="ml15">政策主题</Button>
                            <Button type="primary" className="ml15">应用类型</Button>
                            <Button type="primary" className="ml15">所属行业</Button>
                        </p>
                    <Table
                        rowSelection={rowSelection}
                        columns={this.columns} dataSource={this.data} pagination={this.pagination} />
                    </Col>
                </Row>
                </div>
            </div>
        );
    };
}

export default CollectionList;