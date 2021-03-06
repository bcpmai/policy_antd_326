/**
 * 申报项目
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Table, Input, Row, Col, Button, Select, DatePicker, Modal, Form, Icon} from 'antd';
import Top from './../../component/top';
import Label from "../../component/label";
import './index.css';
import {request} from "../../utils/request";
import cookie from "react-cookies";
import {message} from "antd/lib/index";

const {Search} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;
const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};

class DeclarationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrdown: true,
            arrProduct: false,
            tableData: [],
            labelDate: {
                title: "发文日期",
                item: [
                    {
                        id: 0,
                        name: "全部",
                    },
                    {
                        id: 2020,
                        name: "2020年",
                    },
                    {
                        id: 2019,
                        name: "2019年",
                    },
                    {
                        id: 2018,
                        name: "2018年",
                    },
                    {
                        id: 2017,
                        name: "2017年",
                    },
                    {
                        id: 2016,
                        name: "2016年",
                    },
                    {
                        id: 2015,
                        name: "2015年",
                    }]
            }
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
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    return (
                        <div className="policy-title-box">
                            <p className="policy-title"><a href={`/itemText/${record.id}/${JSON.stringify(this.state.formValues)}`}>{text}</a></p>
                            <p><span className="title">发布机构：</span>{record.organization_label_str}</p>
                            <p><span className="title">应用类型：</span>{record.use_type_label_str}</p>
                            {record.money == "0" || record.money == "" ? <p><span className="title">扶持金额：</span>——</p>: <p><span className="title">扶持金额：</span>{record.money}万元</p>}
                            {record.declare_start_at == 0 && record.declare_end_at == 0 ? <p><span className="title">申报日期：</span>——</p> :<p><span className="title">申报日期：</span>{record.declare_start_date} 至 {record.declare_end_date}</p>}
                        </div>
                    )
                }
            }

        ];
        if (cookie.load("userType") != 2) {
            this.columns.push({
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span><Button onClick={() => this.showModal(record)}>立即申报</Button><Button icon="star" className="ml15"
                                                                                    onClick={() => this.onCollection(record.id, record.resource_id != "0")}>{record.resource_id != "0" ? "已收藏" : "收藏"}</Button></span>),
            })
        }

    }

    async componentWillMount() {
        let values = {};
        if(this.props.match.params.key){
            values = JSON.parse(this.props.match.params.key);
            this.props.form.setFieldsValue(values);
            this.setState(values)
        }
        this.getTableData(values);
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-declare-label', 'POST'); //应用类型
        const selectBelongData = await request('/common/get-all-belong-label', 'POST'); //所属层级
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业


        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const belongData = selectBelongData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && belongData && belongData.success && industryData && industryData.success) {
            const allItem = {id: 0, name: "全部"};
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
    onCollection = async (id, isCollection) => {
        let url = '/common/my-company-collection';
        if (isCollection) {
            url = '/common/cancel-company-collection';
        }
        const responest = await request(url, 'POST', {
            member_id: cookie.load('userId'),
            resource_id: id,
            resource_type: 2
        }); //收藏
        const data = responest.data;
        if (data && data.success) {
            message.success(data.msg);
            this.getTableData(this.state.formValues);
        } else {
            message.error(data.msg);
        }
    }
    getTableData = async (values = {}) => {
        if (cookie.load('userId')) {
            values.member_id = parseInt(cookie.load('userId'));
        }
        const tableData = await request('/declare/list-client', 'POST', {...values, status: 2}); //获取table
        values.path = "declarationItem"; //保存路由，详情返回时保留搜索条件
        if (tableData.status == 200) {
            this.setState({
                tableData: tableData.data,
                formValues: values
            });
        }
    }
    onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        let {formValues = {}} = this.state;
        formValues.page = current;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }

    onPaginChange = (page, pageSize) => {
        console.log(page, pageSize);
        let {formValues = {}} = this.state;
        formValues.page = page;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
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
    setArrdown = () => {
        this.setState({
            arrdown: !this.state.arrdown
        });
    }
    setArrProduct = () => {
        this.setState({
            arrProduct: !this.state.arrProduct
        })
    }
    showModal = (record) => {
        const {id} = record;
        if(id == 59 || id == 60){
            this.props.history.push(`/declarationForm/${id}`);
        }else {
            this.setState({
                visible: true,
                record
            });
        }
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
    onSelectProduct = (value) => {
        this.setState({
            organization_label_list: value
        })
    }
    onSearchTitle = (value) => {
        this.getTableData({title: value});
    }
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            const title = _this.refs.seachInput.props.children.props.value;
            const {release_date, policy_theme_label_list, organization_label_list, use_type_list, created_date} = this.state;
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
            if (created_date != null) {
                values["created_date"] = created_date;
            }

            this.getTableData({...values, title});
        });
    }
    onReset = () => {
        this.setState({
            source: null,
            policy_theme_label_list: null,
            organization_label_list: null,
            use_type_list: null,
            status: null,
            release_date: null,
            created_date: null,
            title:undefined,
            belong:undefined,
            industry_label_id_list:undefined
        }, () => {
            this.props.form.resetFields();
        })
    };
    //label 主题
    onSelectTheme = (value) => {
        this.setState({
            policy_theme_label_list: value
        })
    }
    //label 发布机构
    onSelectProduct = (value) => {
        this.setState({
            organization_label_list: value
        })
    }
    //label 应用类型
    onSelectType = (value) => {
        this.setState({
            use_type_list: value
        })
    }
    //发文日期
    onCreatedDate = (value) => {
        this.setState({
            created_date: value
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {arrdown, record, labelType, labelProduct, arrProduct, belongData, industryData, labelTheme, labelDate, tableData, formValues, policy_theme_label_list, organization_label_list, use_type_list, created_date} = this.state;
        const pagination = {
            current: formValues && formValues.page ? formValues.page : 1,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 20,
            total: tableData.sum || 0,
            showTotal: (total, range) => `共 ${tableData.page_num} 页 总计 ${tableData.sum} 条政策`,
            pageSizeOptions: ['10', '20', '30', '50', '100', '150'],
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onPaginChange
        }
        return (
            <div className="declarationItem-template">
                <Top/>
                <div className="declarationItem-label-box max-weight-box">
                    <Row className="declarationItem-serach">
                        <Col span={6}>
                            <Form ref="seachForm">
                                <Form.Item name="title" ref="seachInput">
                                    {getFieldDecorator('title',{
                                        initialValue:this.state.title
                                    })(
                                        <Search
                                            size="large"
                                            onSearch={value => this.onSearchTitle(value)}
                                        />)}
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={8} className="serach-arrow">
                            {arrdown ? <span onClick={this.setArrdown}>收起筛选
                                {/*<ArrowUpOutlined />*/}
                                <Icon type="arrow-up"/>
                            </span> : <span onClick={this.setArrdown}>展开筛选
                                {/*<ArrowDownOutlined />*/}
                                <Icon type="arrow-down"/>
                            </span>}
                        </Col>
                    </Row>
                    <div className="label-box" style={!arrdown ? {display: "none"} : {}}>
                        <Form ref="form" {...layout} name="dynamic_rule" onSubmit={this.onFinish}>
                            {labelTheme ?
                                <Label callback={this.onSelectTheme} defalutValue={policy_theme_label_list}
                                       span={{title: 2, label: 22}} title={labelTheme.title} item={labelTheme.item}
                                       key="labelTheme"/> : ''}
                            {labelType ?
                                <div style={{marginBottom:"8px"}}><Label callback={this.onSelectType} defalutValue={use_type_list}
                                       span={{title: 2, label: 22}} title={labelType.title} item={labelType.item}
                                                                         key="labelType"/></div> : ''}
                            <Row style={{height:"25px"}}>
                                <Col span={12}>
                                    <Row>
                                        <Col span={4}>所属层级</Col>
                                        <Col span={20}>
                                            <Form.Item>
                                                {getFieldDecorator('belong',{
                                                    initialValue:this.state.belong
                                                })(
                                                    <Select style={{width: 300}} onChange={this.belongChange}>
                                                        {belongData ? belongData.map((item, idx) => <Option
                                                            value={item.id}
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
                                                {getFieldDecorator('industry_label_id_list',{
                                                    initialValue:this.state.industry_label_id_list
                                                })(
                                                    <Select style={{width: 300}}>
                                                        {industryData ? industryData.map((item, idx) => <Option
                                                            value={item.id}
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
                                    <Label callback={this.onSelectProduct} defalutValue={organization_label_list}
                                           title={labelProduct.title} item={labelProduct.item} key="labelProduct"
                                           span={{title: 2, label: 22}}
                                           className={arrProduct ? "allLabel" : "minLabel"}/> : ''}
                                {labelProduct ? (!arrProduct ? <span onClick={this.setArrProduct}
                                                                     className="more-label">
                                    {/*<PlusOutlined/>*/}
                                        <Icon type="plus"/>
                                    展开</span> :
                                    <span onClick={this.setArrProduct}
                                          className="more-label">
                                    {/*<MinusOutlined/>*/}
                                        <Icon type="minus"/>
                                    收起</span>) : ''}
                            </div>
                            <Label callback={this.onCreatedDate} defalutValue={created_date}
                                   span={{title: 2, label: 22}} title={labelDate.title} item={labelDate.item}
                                   key="labelDate"/>
                            {/*<Row className="mt10">*/}
                            {/*<Col span={2}>发文日期：</Col>*/}
                            {/*<Col span={22}>*/}
                            {/*<RangePicker showTime />*/}
                            {/*</Col>*/}
                            {/*</Row>*/}
                            <div className="declarationItem-button">
                                <Button type="primary" htmlType="submit">检索</Button>
                                <Button className="ml15" onClick={this.onReset}>重置</Button>
                            </div>
                        </Form>
                    </div>
                    {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination}
                                        rowKey="id"/> : null}
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
                    <p>本项目采用以下申报方式：</p>
                    {record != undefined && record.declare_net ?
                    <Row>
                        <Col span={8}>1.点击进入网上申报：</Col>
                        <Col span={16}>
                            <a href={record.declare_net.indexOf("http") == -1 ? "http://"+record.declare_net.trim() : record.declare_net} target="_blank">{record != undefined ? record.declare_net : null}</a>
                            {record != undefined ?
                                <a className="model-button" href={record.declare_net.indexOf("http") == -1 ? "http://"+record.declare_net.trim() : record.declare_net} target="_blank" style={{marginTop:0,marginRight:0,marginLeft:0}}>网上申报</a> : null}
                        </Col>
                    </Row> : null}
                    {record != undefined && record.post_material ?
                    <Row>
                        <Col span={8}>{record != undefined && record.declare_net ? "2" : "1"}.纸质材料提交至</Col>
                        <Col span={16}>{record != undefined ? record.post_material : null}
                        </Col>
                    </Row> : null}
                </Modal>
            </div>
        );
    };
}

export default Form.create()(DeclarationItem);