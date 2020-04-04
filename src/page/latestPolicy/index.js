/**
 * 最新政策
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Input, Row, Col, Button, Select, DatePicker, Form, Tooltip,Icon } from 'antd';
import Top from './../../component/top';
import Label from "../../component/label";
import './index.css';
import {request} from "../../utils/request";
import cookie from "react-cookies";
import {message} from "antd/lib/index";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};

class LatestPolicy extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrdown:true,
            arrProduct:false,
            tableData:{}
        }
        this.columns = [
            {
                title: '发文日期',
                key: 'release_date',
                width:150,
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
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    return (
                        <div className="policy-title-box">
                            <p className="policy-title"><a href={`/policyText/${record.id}`} target="_blank">{text}</a></p>
                            <p><span className="title">发布机构：</span>{record.organization_label_str}</p>
                            <p><span className="title">发文字号：</span>{record.post_shop_name}</p>
                        </div>
                    )
                }
            }
            // {
            //     title: '发布机构',
            //     dataIndex: 'organization_label_str',
            //     key: 'organization_label_str',
            //     render: (text, record) => {
            //         return <Tooltip placement="topLeft" title={text}>{text.length < 15 ? text : text.substr(0,15)+"..."}</Tooltip>
            //     }
            // },
            // {
            //     title: '发文字号',
            //     key: 'post_shop_name',
            //     width:250,
            //     dataIndex: 'post_shop_name',
            //     render: (text, record) => {
            //         return <Tooltip placement="topLeft" title={text}>{text.length < 15 ? text : text.substr(0,15)+"..."}</Tooltip>
            //     }
            // }

        ];
        if(cookie.load("userType") != 2){
            this.columns.push({
                title: '操作',
                key: 'action',
                width:100,
                render: (text, record) => (
                    <span>
                        {/*<a onClick={()=>this.onCollection(record.id,record.resource_id != "0")}>*/}
                            {/*<Icon type="star" />*/}
                            {/*{record.resource_id != "0" ? "已收藏": "收藏"}*/}
                            {/*</a>*/}
                        <Button onClick={()=>this.onCollection(record.id,record.resource_id != "0")} icon="star">{record.resource_id != "0" ? "已收藏": "收藏"}</Button>
                    </span>),
            })
        }
        function onShowSizeChange(current, pageSize) {
            console.log(current, pageSize);
        }
        this.pagination = {
            showSizeChanger:true,
            defaultCurrent:1,
            pageSize:20,
            pageSizeOptions:['10', '20', '30', '50','100','150'],
            onShowSizeChange:onShowSizeChange
        }
    }
    async componentDidMount() {
        console.log(this.props);
        const {keyString} = this.props.match.params;
        // console.log(this.props.form)
        this.props.form.setFieldsValue({title:keyString});
        this.getTableData({title:keyString});
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
            // belongData.data.unshift(allItem);
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
    onCollection = async (id,isCollection) =>{
        let url = '/common/my-company-collection';
        if(isCollection){
            url = '/common/cancel-company-collection';
        }
        const responest = await request(url, 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type:1}); //收藏
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);
            this.getTableData(this.state.formValues);
        }else{
            message.error(data.msg);
        }
    }

    getTableData = async (values={}) =>{
        if(cookie.load('userId')){
            values.member_id = parseInt(cookie.load('userId'));
        }
        const tableData = await request('/policy/list', 'POST',{...values,status:2}); //获取table
        if(tableData.status == 200){
            this.setState({
                tableData: tableData.data,
                formValues:values
            });
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
        },()=>{
            if(document.body.clientHeight>document.getElementById("main").offsetHeight) {
                console.log(document.body.clientHeight)
                this.setState({
                    footerClass: {top: document.body.clientHeight-70,position: "absolute",left:0,width: "100%"}
                });
            }else{
                this.setState({
                    footerClass: {position: "inherit"}
                });
            }
        });

    }
    setArrProduct = () =>{
        this.setState({
            arrProduct:!this.state.arrProduct
        })
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
    onSearchTitle = (value) =>{
        this.getTableData({title:value});
    }
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async(err, values) => {
            const title = _this.refs.seachInput.props.children.props.value;
            if (!err) {
                const {release_date, policy_theme_label_list, organization_label_list, use_type_list} = this.state;
                if (policy_theme_label_list != null) {
                    values["policy_theme_label_list"] = policy_theme_label_list;
                }
                if (organization_label_list != null) {
                    values["organization_label_list"] = organization_label_list;
                }
                if (use_type_list != null) {
                    values["use_type_list"] = use_type_list;
                }
                if (release_date != null) {
                    values["release_date"] = release_date;
                }

                _this.getTableData({...values, title});
            }
        });
    }
    onReset = () => {
        this.setState({
            source:null,
            policy_theme_label_list:null,
            organization_label_list:null,
            use_type_list:null,
            status:null,
            release_date:null
        },()=>{
            this.props.form.resetFields();
        })
    };
    //发文日期
    onDateChange = (date,dateString) =>{
        this.setState({
            release_date:dateString
        })
    }
    //label 主题
    onSelectTheme = (value) =>{
        this.setState({
            policy_theme_label_list:value
        })
    }
    //label 发布机构
    onSelectProduct = (value) =>{
        this.setState({
            organization_label_list:value
        })
    }
    //label 应用类型
    onSelectType = (value) =>{
        this.setState({
            use_type_list:value
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {arrdown,labelType,labelProduct,arrProduct,belongData,industryData,labelTheme,policy_theme_label_list,organization_label_list,use_type_list,tableData,formValues} = this.state;
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
            <div className="latestPolicy-template">
                <Top />
                <div className="latestPolicy-label-box max-weight-box">
                    <Row className="latestPolicy-serach">
                        <Col span={12}>
                            <Form ref="seachForm">
                                <Form.Item ref="seachInput">
                                    {getFieldDecorator('title')(
                                        <Search
                                            enterButton="查询"
                                            size="large"
                                            placeholder="请输入关键词查询政策标题"
                                            onSearch={value => this.onSearchTitle(value)}
                                        />)}

                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={8} className="serach-arrow">
                            {arrdown ? <span onClick={this.setArrdown}>收起筛选
                                {/*<ArrowUpOutlined />*/}
                                <Icon type="arrow-up" />
                            </span> : <span onClick={this.setArrdown}>展开筛选
                                <Icon type="arrow-down" />
                                {/*<ArrowDownOutlined />*/}
                            </span>}
                        </Col>
                    </Row>
                    <div className="label-box" style={!arrdown ? {display:"none"} : {}}>
                        <Form ref="form" {...layout} name="dynamic_rule" onSubmit={this.onFinish}>
                            {labelTheme ?
                                <Label callback={this.onSelectTheme} defalutValue={policy_theme_label_list} span={{title:2,label:22}} title={labelTheme.title} item={labelTheme.item} key="labelTheme"/> : ''}


                            {labelType ?
                                <div style={{marginBottom:"6px"}}><Label callback={this.onSelectType} defalutValue={use_type_list} span={{title:2,label:22}} title={labelType.title} item={labelType.item} key="labelType"/></div> : ''}
                            <Row>
                              <Col span={12}>
                                    <Row>
                                        <Col span={4}>所属层级</Col>
                                        <Col span={20}>
                                            <Form.Item>
                                                {getFieldDecorator('belong')(
                                                    <Select style={{width: 360}} onChange={this.belongChange}>
                                                        {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                                            key={item.id}>{item.name}</Option>) : ''}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={4}>所属行业</Col>
                                        <Col span={20}>
                                            <Form.Item>
                                                {getFieldDecorator('industry_label_id_list')(
                                                    <Select style={{width: 360}}>
                                                        {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                                key={item.id}>{item.name}</Option>) : ''}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className="label-product-box">
                                {labelProduct ?
                                    <Label callback={this.onSelectProduct} defalutValue={organization_label_list} title={labelProduct.title} item={labelProduct.item} key="labelProduct"
                                           span={{title:2,label:22}} className={arrProduct ? "allLabel" : "minLabel"}/> : ''}
                                {labelProduct ? (!arrProduct ? <span onClick={this.setArrProduct}
                                                                     className="more-label">
                                    {/*<PlusOutlined/>*/}
                                        <Icon type="plus" />
                                    展开</span> :
                                    <span onClick={this.setArrProduct}
                                          className="more-label">
                                    {/*<MinusOutlined/>*/}
                                        <Icon type="minus" />
                                    收起</span>) : ''}
                            </div>
                        <Row>
                            <Col span={2}>发文日期</Col>
                            <Col span={22}>
                                <Form.Item>
                                    {getFieldDecorator('release_date')(
                                        <RangePicker onChange={this.onDateChange} />
                                    )}
                                    {/*<DatePicker onChange={this.onDateChange} />*/}
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="latestPolicy-button">
                            <Button type="primary" htmlType="submit">检索</Button>
                            <Button className="ml15" onClick={this.onReset}>重置</Button>
                        </div>
                        </Form>
                    </div>
                    {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                </div>
            </div>
        );
    };
}

export default Form.create()(LatestPolicy);