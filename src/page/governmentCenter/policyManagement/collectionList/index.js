/**
 *  采集列表
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Input, Row, Col, Button, Select, DatePicker, Breadcrumb, Modal,message, Form,Tooltip,Icon } from 'antd';
import Top from '../../../../component/top/index';
import Label from "../../../../component/label/index";
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import {request} from "../../../../utils/request";

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};

class CollectionList extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrdown:true,
            arrProduct:false,
            tableData:[]
        }
        this.columns = [
            {
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                width:400,
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><a href={`/policyText/${record.id}`}>{text.length < 25 ? text : text.substr(0,25)+"..."}</a></Tooltip>
                }
            },
            {
                title: '所属层级',
                dataIndex: 'belong_str',
                key: 'belong_str'
            },
            {
                title: '发布机构',
                dataIndex: 'organization_label_str',
                key: 'organization_label_str',
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}>{text.length < 15 ? text : text.substr(0,15)+"..."}</Tooltip>
                }
            },
            {
                title: '采集时间',
                key: 'release_date',
                dataIndex: 'release_date',
                width:200
            }
        ];
    }
    async componentWillMount() {
        this.getTableData();
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型
        const selectBelongData = await request('/common/get-all-belong-label', 'POST'); //所属层级
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业


        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const belongData = selectBelongData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && belongData && belongData.success && industryData && industryData.success) {
            this.setState({
                labelTheme: {
                    title: "政策主题",
                    item: themData.data
                },
                labelType: {
                    title: "应用类型",
                    item: typeData.data
                },
                belongDataModal: selectBelongData.data.data,
                belongData: belongData.data,
                industryData: industryData.data

            })
        }
    }

    getTableData = async (values) =>{
        const tableData = await request('/policy/list', 'POST',{...values,source:2}); //获取table
        if(tableData.status == 200){
            this.setState({
                tableData: tableData.data,
                formValues:values
            });
        }
    }
    //搜索
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {organization_label_list_arr, release_date} = this.state;
                if (organization_label_list_arr != null) {
                    values["organization_label_list"] = organization_label_list_arr;
                }
                if (release_date != null) {
                    values["release_date"] = release_date;
                }
                this.getTableData(values);
            }
        });
    }
    //label 发布机构
    onSelectProduct = (value) =>{
        this.setState({
            organization_label_list_arr:value
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
    belongChange = async (value,isModal) => {
        console.log(value,isModal)
        const labelProductData = await request('/common/get-all-organization-label', 'POST', {belong_id: value}); //发布机构
        const productData = labelProductData.data;
        if (productData && productData.success) {
            if(typeof(isModal) == "boolean" && isModal){
                this.setState({
                    labelProductModal: {
                        title: "发布机构",
                        item: productData.data
                    }
                })
            }else {
                this.setState({
                    labelProduct: {
                        title: "发布机构",
                        item: productData.data
                    }
                })
            }
        }
    }
    onSelectBelong = (value) =>{
        if(value) {
            this.belongChange(value, true);
        }
    }
    onSelectLabel = (value) =>{
        const {belong,industry,theme,type} = this.state;
        let key;
        if(belong){
            key = "organization_label_list";
        }
        if(industry){
            key = "industry_label_list"
        }
        if(theme){
            key = "policy_theme_label_list"
        }
        if(type){
            key = "use_type_list"
        }
        console.log(key);
        this.setState({
            [key]:value
        })
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    showModal = (key) =>{
        this.setState({
            [key]:true
        })
    }
    handleCancel = (key) =>{
        this.setState({
            [key]:false
        })
    }
    onModalSubmit = async(key) =>{
        console.log(key,this.state[key]);
        const {selectedRowKeys} = this.state;
        if(selectedRowKeys) {
            const resData = await request('/policy/batch-update', 'POST', {
                id: selectedRowKeys,
                [key]: this.state[key]
            }); //发布机构
            if (resData.data && resData.data.success) {
                message.success(resData.data.msg);
                this.getTableData();
                this.setState({
                    belong:false,industry:false,theme:false,type:false
                })
            }else{
                message.error(resData.data.msg);
            }
        }else{
            message.error("请至少选择一条数据");
        }
    }
    onReset = () => {
        this.setState({
            source:null,
            organization_label_list_arr:null,
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
    setArrProduct = () => {
        this.setState({
            arrProduct: !this.state.arrProduct
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {labelProduct,organization_label_list_arr,arrProduct,industryData,labelType,selectedRowKeys,belongData,belongDataModal,labelTheme,tableData,formValues,labelProductModal} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
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
                        <Form ref="form" {...layout} name="dynamic_rule" onSubmit={this.onFinish}>
                            <Row>
                                <Col span={8}>
                                    <Row>
                                        <Col span={6}>政策标题</Col>
                                        <Col span={18}>
                                            <Form.Item>
                                                {getFieldDecorator('title')(
                                                    <Input />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={6}>所属层级</Col>
                                        <Col span={18}>
                                            <Form.Item>
                                                {getFieldDecorator('industry_label_id_list')(
                                                    <Select onChange={this.belongChange}>
                                                        {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                                            key={item.id}>{item.name}</Option>) : ''}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={6}>发文日期</Col>
                                        <Col span={18}>
                                            <Form.Item>
                                                {getFieldDecorator('release_date')(
                                                    <DatePicker onChange={this.onDateChange} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        <div className="label-product-box">
                            {labelProduct ? <Label defalutValue={organization_label_list_arr}  callback={this.onSelectProduct} title={labelProduct.title} item={labelProduct.item} key="labelProduct"
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
                                    收起</span>) : ''} </div>

                        <div className="search-button">
                            <Button type="primary" htmlType="submit">检索</Button>
                            <Button className="ml15" onClick={this.onReset}>重置</Button>
                        </div>
                        </Form>
                    </div>
                        <p align="right" className="operation-button">
                            <Button type="primary" onClick={()=>this.showModal("belong")}>所属层级/发布机构</Button>
                            <Button type="primary" onClick={()=>this.showModal("theme")} className="ml15">政策主题</Button>
                            <Button type="primary" onClick={()=>this.showModal("type")} className="ml15">应用类型</Button>
                            <Button type="primary" onClick={()=>this.showModal("industry")} className="ml15">所属行业</Button>
                        </p>
                        {tableData ? <Table rowSelection={rowSelection} columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                    </Col>
                </Row>
                </div>
                <Modal
                    title="所属层级/发布机构"
                    visible={this.state.belong}
                    onOk={this.handleOk}
                    width={900}
                    onCancel={()=>this.handleCancel("belong")}
                    footer={[
                        <Button key="back" onClick={()=>this.onModalSubmit("organization_label_list")}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={()=>this.handleCancel("belong")}>
                            取消
                        </Button>
                    ]}
                >
                    <p>请选择【所属层级】标签：</p>
                    {belongDataModal ?
                        <Label callback={this.onSelectBelong} isRadio={true} span={{title:0,label:24}} item={belongDataModal} key="labelTheme"/> : ''}
                    <p>请选择【发布机构】标签：</p>
                        {labelProductModal ?
                        <Label callback={this.onSelectLabel} span={{title:0,label:24}} item={labelProductModal.item} /> : ''}

                </Modal>
                <Modal
                    title="政策主题"
                    visible={this.state.theme}
                    onOk={this.handleOk}
                    width={900}
                    onCancel={()=>this.handleCancel("theme")}
                    footer={[
                        <Button key="back" onClick={()=>this.onModalSubmit("policy_theme_label_list")}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={()=>this.handleCancel("theme")}>
                            取消
                        </Button>
                    ]}
                >
                    <p>请选择【政策主题】标签：</p>
                    {labelTheme ?
                        <Label callback={this.onSelectLabel} span={{title:0,label:24}} item={labelTheme.item} /> : ''}
                </Modal>
                <Modal
                    title="应用类型"
                    visible={this.state.type}
                    onOk={this.handleOk}
                    width={900}
                    onCancel={()=>this.handleCancel("type")}
                    footer={[
                        <Button key="back" onClick={()=>this.onModalSubmit("use_type_list")}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={()=>this.handleCancel("type")}>
                            取消
                        </Button>
                    ]}
                >
                    <p>请选择【应用类型】标签：</p>
                    {labelType ?
                        <Label callback={this.onSelectLabel} span={{title:0,label:24}} item={labelType.item} /> : ''}
                </Modal>
                <Modal
                    title="所属行业"
                    visible={this.state.industry}
                    onOk={this.handleOk}
                    width={900}
                    onCancel={()=>this.handleCancel("industry")}
                    footer={[
                        <Button key="back" onClick={()=>this.onModalSubmit("industry_label_list")}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={()=>this.handleCancel("industry")}>
                            取消
                        </Button>
                    ]}
                >
                    <p>请选择【所属行业】标签：</p>
                    {industryData ?
                        <Label callback={this.onSelectLabel} span={{title:0,label:24}} item={industryData} /> : ''}
                </Modal>
            </div>
        );
    };
}

export default Form.create()(CollectionList);