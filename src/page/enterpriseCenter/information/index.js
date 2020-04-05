/**
 * 企业信息
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Button, Form, Input, Row, Col, Select, DatePicker, Menu, Modal,Icon,Alert} from 'antd';
import Top from '../../../component/top/index';
import Title from "../../../component/title/index";
import './index.css';
import EnterpriseMenu from '../../../component/enterpriseCenterMenu';
import cookie from "react-cookies";
import {message} from "antd/lib/index";
import {request} from "../../../utils/request";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const {MonthPicker} = DatePicker;
const {Option} = Select;
const {SubMenu} = Menu;
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

class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit:true
        }
    }

    componentDidMount() {
        //this.getProvinceData();
        this.getDefaultData();
    }

    onChange = (date, dateString) => {
        this.setState({
            set_up_value:dateString
        })
        console.log(date, dateString);
    }
    getDefaultData = async () =>{
        const requestData = await request('/company/get-company-user', 'POST',{member_id:cookie.load('userId')});
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const industryData = selectIndustryData.data;
        const data = requestData.data;
        if (data && industryData && industryData.success) {
            const register_address = data.register_address != "" && data.register_address ? data.register_address.split(",") : null;
            this.getProvinceData();
            if(register_address && register_address.length>=1) {
                this.getCityData(parseInt(register_address[0]));
                if(register_address[1] != "undefined") {
                    setTimeout(() => {
                        this.getAreaData(parseInt(register_address[1]), parseInt(register_address[0]));
                    });
                }
            }
            this.setState({
                industryData: industryData.data,
                register_address,
                set_up_value:data.set_up_value
            },()=>{
                let strTime = data.set_up_value;
                if(strTime) {
                    if(strTime == 200000){
                        strTime += 1;
                    }
                    strTime +="";
                    console.log(strTime.substr(0,4)+"-"+strTime.substr(4));
                    data.set_up_value = moment(strTime.substr(0,4)+"-"+strTime.substr(4), 'YYYY-MM');
                }
                this.props.form.setFieldsValue(data);
            });

        }


    }
    getProvinceData = async () => {
        const provinceData = await request('/common/get-province', 'POST'); //获取省
        if (provinceData.status == 200) {
            this.setState({
                provinceSelect: provinceData.data.data
            });
        }

    }

    getCityData = async (provinceId) => {
        const cityData = await request('/common/get-city', 'POST', {province_id: provinceId}); //获取市
        if (cityData.status == 200) {
            this.setState({
                citySelect: cityData.data.data,
                areaSelect:null
            });
        }

    }

    getAreaData = async (cityId,province_id) => {
        // console.log(this.state.addressArr);
        const areaData = await request('/common/get-area', 'POST', {
            province_id: province_id || this.state.addressArr && parseInt(this.state.addressArr.province),
            city_id: cityId
        }); //获取区县
        if (areaData.status == 200) {
            this.setState({
                areaSelect: areaData.data.data
            });
        }

    }
    //选择省
    onProvinceChange = (value, option) => {
        let {addressArr = {}} = this.state;
        addressArr = {
            province: value
        };
        this.setState({
            addressArr,
            citySelect: null,
            areaSelect: null,
            register_address:null
        }, () => {
            this.getCityData(value);
        });
    }
    onCityChange = (value, option) => {
        let {addressArr = {},register_address} = this.state;
        if(!addressArr.province){addressArr.province = register_address[0]}
        addressArr.city = value;
        addressArr.area = '';
        this.setState({
            addressArr,
            areaSelect: null,
            register_address:register_address ? [register_address[0],register_address[1]] : null
        }, () => {
            this.getAreaData(value);
        });
    }
    onAreaChange = (value, option) => {
        let {addressArr = {},register_address} = this.state;
        if(!addressArr.province){addressArr.province = register_address[0]}
        if(!addressArr.city){addressArr.city = register_address[1]}
        addressArr.area = value;
        this.setState({
            addressArr
        });
    }
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                const {addressArr, set_up_value, register_address} = this.state;
                if (addressArr) {
                    values.register_address = addressArr.province + "," + addressArr.city + "," + addressArr.area;
                } else if (register_address) {
                    values.register_address = register_address.join(",");
                }
                if (set_up_value) {
                    values.set_up_value = (set_up_value + "").replace("-", "");
                }
                values.member_id = cookie.load('userId');
                const responest = await request('/company/update_info', 'POST', values);
                const data = responest.data;
                if (data && data.success) {
                    message.success(data.msg);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    message.error(data.msg);
                }
            }
        });
    }
    setEdit = () =>{
        this.setState({
            isEdit:false
        })
    }
    onCancel = () =>{
        this.setState({
            visible:true
        })
    }
    handleOk = async(e) => {
        this.onFinish(this.refs.form.getFieldsValue());
        this.setState({
            visible: false
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    render() {
        const {provinceSelect, citySelect, areaSelect, industryData,isEdit,register_address} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="information-template">
                <Top/>
                <Form ref="form" {...layout} name="nest-messages" onSubmit={this.onFinish}
                      validateMessages={validateMessages}>
                    <div className="information-form-box max-weight-box">
                        <Row>
                            <Col span={4}>
                                <EnterpriseMenu menuKey="information"/>
                            </Col>
                            <Col span={20}>
                                <Title name="企业信息"/>
                                <div className="information-title-h1">
                                    <div className="alert-box">
                                        <Icon type="exclamation-circle" theme="filled" />
                                        <span>您可完善企业信息，精准匹配申报政策</span>
                                        <Button onClick={() => {
                                            window.location.href = "/matching"
                                        }} type="primary" className="button-matching">精准匹配</Button>
                                    </div>
                                    { isEdit ? <Button type="primary" icon="edit" className="button-edit" onClick={this.setEdit}>编辑</Button> : null}
                                    { !isEdit ? <Button type="primary" onClick={this.onCancel} className="button-edit ml15">取消</Button> : null}
                                    { !isEdit ? <Button type="primary" htmlType="submit" className="button-edit">保存</Button> : null}
                                </div>
                                <div className="information-form">
                                    <div className="information-title">基本信息</div>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="企业名称">
                                                {getFieldDecorator('company_name')(
                                                    <Input disabled placeholder="请输入企业名称" defaultValue="xxxx有限公司"/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item className="text-right" label="注册地址">
                                                {provinceSelect ? <Select defaultValue={register_address ? parseInt(register_address[0]) : null} disabled={isEdit} placeholder="请选择省份" style={{width: 127}}
                                                        onChange={(value, option) => this.onProvinceChange(value, option)}>
                                                        {provinceSelect.map((item, idx) => <Option
                                                        value={item.id} key={idx}>{item.value}</Option>)}
                                                </Select> : null}
                                                {citySelect ? <Select  defaultValue={register_address && register_address[1] && parseInt(register_address[1])} disabled={isEdit} placeholder="请选择市" style={{width: 127, marginLeft: 5}}
                                                        onChange={(value, option) => this.onCityChange(value, option)}>
                                                    { citySelect.map((item, idx) => <Option value={item.id}
                                                                                                        key={idx}>{item.value}</Option>)}

                                                </Select> : null}
                                                {areaSelect ? <Select defaultValue={register_address && register_address[2] && parseInt(register_address[2])} disabled={isEdit} placeholder="请选择区县" style={{width: 132, marginLeft: 5}}
                                                        onChange={(value, option) => this.onAreaChange(value, option)}>
                                                        {areaSelect.map((item, idx) => <Option value={item.id}
                                                                                                        key={idx}>{item.value}</Option>)}
                                                </Select> : null}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="成立时间">
                                                {getFieldDecorator('set_up_value')(
                                                    <MonthPicker disabled={isEdit} onChange={this.onChange} format="YYYY-MM" picker="month"/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item className="text-right" label="所属行业">
                                                {getFieldDecorator('industry_label_id')(
                                                    <Select disabled={isEdit} placeholder="请选择所属行业">
                                                        {industryData ? industryData.map((item, idx) => <Option
                                                            value={item.id}
                                                            key={item.id}>{item.name}</Option>) : ''}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div className="information-title">知识产权情况</div>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="知识产权数量">
                                                {getFieldDecorator('knowledge_value')(
                                                    <Input disabled={isEdit} suffix="个" style={{width: 200}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={14}>
                                            <Form.Item className="text-right" label="其中，发明专利数量">
                                                {getFieldDecorator('invention_value')(
                                                    <Input disabled={isEdit} suffix="个" style={{width: 200}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div className="information-title">财务数据情况</div>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="研发投入">
                                                {getFieldDecorator('develop_value')(
                                                    <Input disabled={isEdit} suffix="万元" style={{width: 200}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="企业报税收入">
                                                {getFieldDecorator('declare_value')(
                                                    <Input disabled={isEdit} suffix="万元" style={{width: 200}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="研发资产总额">
                                                {getFieldDecorator('develop_assets_value')(
                                                    <Input disabled={isEdit} suffix="万元" style={{width: 200}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div className="information-title">人员情况</div>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="近一年缴纳社保数">
                                                {getFieldDecorator('social_people_value')(
                                                    <Input disabled={isEdit} suffix="人" style={{width: 200}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}>
                                            <Form.Item label="研发人员">
                                                {getFieldDecorator('develop_people_value')(
                                                    <Input disabled={isEdit} suffix="人" style={{width: 200}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <Modal
                    title="提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleOk}>
                            保存
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleCancel}>
                            取消
                        </Button>
                    ]}
                >
                    <p style={{padding:"40px 0 10px 0",textAlign:"center",fontSize:"16px",color: "#6e6e6e"}}>是否保存修改信息？</p>
                </Modal>
            </div>
        );
    };
}

export default Form.create()(Information);