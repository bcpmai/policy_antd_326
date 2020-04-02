/**
 *  政策列表
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Table, Tag, Input, Row, Col, Button, Select, DatePicker, Breadcrumb, Modal, Form, message,Icon, Tooltip} from 'antd';
// import {ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {request} from '../../../../utils/request';
import Top from '../../../../component/top/index';
import Label from "../../../../component/label/index";
import Title from "../../../../component/title/index";
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import './index.css';

const {Search} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;

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

class PolicyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData:{},
            current:1,
            arrdown: true,
            arrProduct: false,
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
            labelStatus: {
                title: "状 态",
                item: [
                    {
                        id: -1,
                        name: "全部"
                    },
                    {
                        id: 1,
                        name: "暂存"
                    },
                    {
                        id: 2,
                        name: "已发布"
                    }]
            },
            labelSource: {
                title: "来    源",
                item: [ {
                    id: -1,
                    name: "全部"
                },
                    {
                        id: 1,
                        name: "人工"
                    },
                    {
                        id: 2,
                        name: "爬虫"
                    }]
            }
        }
        this.columns = [
            {
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                width: 180,
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><a href={`${record.status == 2 ? "/policyText" : "/policyPreview"}/${record.id}`} target="_blank">{text.length < 8 ? text : text.substr(0,8)+"..."}</a></Tooltip>
                }
            },
            {
                title: '所属层级',
                dataIndex: 'belong',
                key: 'belong',
                width:100,
                render: text => {
                    if(text==1) {
                        return "国家级"
                    }else if(text==2) {
                        return "重庆市级"
                    }else{
                        return "区县级"
                    }
                }
            },
            {
                title: '发布机构',
                dataIndex: 'organization_label_str',
                key: 'organization_label_str',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 6 ? text : text.substr(0,6)+"..."}</span></Tooltip>
                }
            },
            {
                title: '政策主题',
                dataIndex: 'policy_theme_label_str',
                key: 'policy_theme_label_str',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 6 ? text : text.substr(0,6)+"..."}</span></Tooltip>
                }
            },
            {
                title: '应用类型',
                dataIndex: 'use_type_label_str',
                key: 'use_type_label_str',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><span>{text.length < 6 ? text : text.substr(0,6)+"..."}</span></Tooltip>
                }
            },
            // {
            //     title: '关联解析',
            //     dataIndex: 'analysis',
            //     key: 'analysis'
            // },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:90,
                render: text => {
                    if(text==2) {
                        return "已发布"
                    }else {
                        return "暂存"
                    }
                }
            },
            {
                title: '来源',
                dataIndex: 'source',
                key: 'source',
                width:70,
                render: text => {
                    if(text==1) {
                        return "人工"
                    }else {
                        return "爬虫"
                    }
                }
            },
            // {
            //     title: '操作时间',
            //     key: 'updated_date',
            //     dataIndex: 'updated_date',
            //     width: 130
            // },
            {
                title: '操作人员',
                key: 'username',
                dataIndex: 'username',
                width:100,
            },
            {
                title: '操作',
                key: 'action',
                width:120,
                render: (text, record) => (<p align="center" style={{marginBottom:0}}><a onClick={()=>this.props.history.push(`/addPolicy/${record.id}`)}>编辑</a><a onClick={()=>this.showModal(record.id)} className="ml15">删除</a></p>),
            },
        ];

    }

    async componentDidMount() {
        this.getTableData();
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-declare-label', 'POST'); //应用类型
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

    getTableData = async (values) =>{
        const tableData = await request('/policy/list', 'POST',values); //获取table
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

    setArrdown = () => {
        this.setState({
            arrdown: !this.state.arrdown
        })
    }
    setArrProduct = () => {
        this.setState({
            arrProduct: !this.state.arrProduct
        })
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
    showModal = (id) => {
        this.setState({
            visible: true,
            id
        });
    };

    handleOk = async(e) => {
        const deleteData = await request('/policy/del', 'POST',{id:this.state.id}); //删除数据
        if(deleteData.data && deleteData.data.success){
            message.success(deleteData.data.msg);
            this.setState({
                visible: false,
                id:null
            });
            setTimeout(()=>{
                this.getTableData(this.state.formValues);
            },1000);
        }else{
            message.error(deleteData.data.msg);
        }
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    //发文日期
    onDateChange = (date,dateString) =>{
        this.setState({
            release_date:dateString
        })
    }
    //label 状态
    onSelectStatus = (value) =>{
        this.setState({
            status:value
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
    //label 来源
    onSelectSource = (value) =>{
        this.setState({
            source:value
        })
    }
    //搜索
    onFinish = async (values) => {
        const {release_date,status,policy_theme_label_list,organization_label_list,use_type_list,source} = this.state;
        if(policy_theme_label_list!=null){
            values["policy_theme_label_list"] = policy_theme_label_list;
        }
        if(organization_label_list!=null){
            values["organization_label_list"] = organization_label_list;
        }
        if(status!=null){
            values["status"] = status;
        }
        if(use_type_list!=null){
            values["use_type_list"] = use_type_list;
        }
        if(source!=null){
            values["source"] = source;
        }
        if(release_date!=null){
            values["release_date"] = release_date;
        }
        this.getTableData(values);
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
            this.refs.form.resetFields();
        })
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
            <div className="policyList-template">
                <Top/>
                <div className="policyList-label-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <PolicyManagementMenu key="menu"/>
                        </Col>
                        <Col span={20}>
                            <Title name="政策列表" />
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>政策管理</Breadcrumb.Item>
                                <Breadcrumb.Item href="">政策列表</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="label-box">
                                <Form ref="form" {...layout} name="dynamic_rule" onFinish={this.onFinish} validateMessages={validateMessages}>
                                <Row>
                                    <Col span={4}>政策标题</Col>
                                    <Col span={18}>
                                        <Form.Item name="title">
                                            <Input />
                                        </Form.Item>

                                    </Col>
                                    <Col span={2}><span onClick={this.setArrdown}
                                                        className="more-label">{arrdown ?
                                        <Icon type="plus" />
                                        : <Icon type="minus" />} {arrdown ? "展开筛选" : "收起筛选"}</span></Col>
                                </Row>
                                    <div style={{display:!arrdown ? '' : "none"}}>
                                {labelTheme ?
                                    <Label callback={this.onSelectTheme} defalutValue={policy_theme_label_list} span={{title:4,label:20}} title={labelTheme.title} item={labelTheme.item} key="labelTheme"/> : ''}
                                <Row>
                                    <Col span={4}>所属层级</Col>
                                    <Col span={20}>
                                        <Form.Item name="belong">
                                        <Select style={{width: 300}} onChange={this.belongChange}>
                                            {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                                key={item.id}>{item.name}</Option>) : ''}
                                        </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className="label-product-box">
                                    {labelProduct ?
                                        <Label callback={this.onSelectProduct} defalutValue={organization_label_list} title={labelProduct.title} item={labelProduct.item} key="labelProduct"
                                               span={{title:4,label:20}} className={arrProduct ? "allLabel" : "minLabel"}/> : ''}
                                    {labelProduct ? (!arrProduct ? <span onClick={this.setArrProduct}
                                                                         className="more-label">
                                            {/*<PlusOutlined/>*/}
                                            <Icon type="plus" />
                                            展开</span> :
                                        <span onClick={this.setArrProduct}
                                              className="more-label"><Icon type="minus" /> 收起</span>) : ''}
                                </div>
                                {labelType ?
                                    <Label callback={this.onSelectType} defalutValue={use_type_list} span={{title:4,label:20}} title={labelType.title} item={labelType.item} key="labelType"/> : ''}
                                <Row>
                                    <Col span={4}>所属行业</Col>
                                    <Col span={20}>
                                        <Form.Item name="industry_label_id_list">
                                        <Select style={{width: 300}}>
                                            {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                    key={item.id}>{item.name}</Option>) : ''}
                                        </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4}>发文日期</Col>
                                    <Col span={20}>
                                        <Form.Item name="release_date">
                                            <DatePicker onChange={this.onDateChange} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Label callback={this.onSelectStatus} defalutValue={status} isRadio={true} span={{title:4,label:20}} title={labelStatus.title} item={labelStatus.item} key="labelStatus"/>
                                <Label callback={this.onSelectSource} defalutValue={source} isRadio={true} span={{title:4,label:20}} title={labelSource.title} item={labelSource.item} key="labelSource"/>
                                    </div>
                                        <div className="search-button">
                                    <Button type="primary" htmlType="submit">检索</Button>
                                    <Button className="ml15" onClick={this.onReset}>重置</Button>
                                </div>
                                </Form>
                            </div>
                            <p align="right" className="operation-button"><Link to="/addPolicy"><Button type="primary">添加政策</Button></Link></p>
                            {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                        </Col>
                    </Row>
                </div>
                {/*<Footer/>*/}
                <Modal
                    title="温馨提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="删除"
                    cancelText="关闭"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleOk}>
                            删除
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleCancel}>
                            关闭
                        </Button>
                    ]}
                >
                    <p style={{padding:"40px 0 10px 0",textAlign:"center",fontSize:"16px",color: "#6e6e6e"}}>确定删除吗？</p>
                </Modal>
            </div>
        );
    };
}

export default PolicyList;