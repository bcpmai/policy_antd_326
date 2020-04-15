/**
 * 申请书
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Breadcrumb, Button, Alert, Form, message, Input, Select, Row, Col} from 'antd';
// import { StarOutlined } from '@ant-design/icons';
import Top from './../../component/top';
import './index.css';
import TitleTwo from "../../component/titleTwo";
import cookie from "react-cookies";
import {request} from "../../utils/request";
import moment from "moment/moment";

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
const {Option} = Select;
const {TextArea} = Input;

class Form2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 60
        };
    }

    async componentDidMount() {
        if (cookie.load('userId')) {
            this.getDefalutData();
        }
        this.getProvinceData();
    }

    getDefalutData = async () => {
        const initData = await request('/common/get-pdf-info', 'POST', {
            pdf_id: this.state.id,
            member_id: cookie.load('userId')
        });
        const iData = initData.data;
        if (iData) {
            this.props.form.setFieldsValue(iData.info);
        }

        //company_name
        //code
        //legal_person
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
                areaSelect: null
            });
        }

    }

    getAreaData = async (cityId, province_id) => {
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
            register_address: null
        }, () => {
            this.getCityData(value);
        });
    }
    onCityChange = (value, option) => {
        let {addressArr = {}, register_address} = this.state;
        if (!addressArr.province) {
            addressArr.province = register_address[0]
        }
        addressArr.city = value;
        addressArr.area = '';
        this.setState({
            addressArr,
            areaSelect: null,
            register_address: register_address ? [register_address[0], register_address[1]] : null
        }, () => {
            this.getAreaData(value);
        });
    }
    onAreaChange = (value, option) => {
        let {addressArr = {}, register_address} = this.state;
        if (!addressArr.province) {
            addressArr.province = register_address[0]
        }
        if (!addressArr.city) {
            addressArr.city = register_address[1]
        }
        addressArr.area = value;
        this.setState({
            addressArr
        });
    }
    onFinish = (e) => {
        e.preventDefault();
        if (cookie.load('userId')) {
            const _this = this;
            this.props.form.validateFields(async (err, values) => {
                values.pdf_id = this.state.id;
                values.member_id = cookie.load('userId')
                Object.keys(values).forEach((item, idx) => {
                    if (!values[item]) {
                        values[item] = '';
                    }
                })
                if (!err) {
                    const responest = await request('/common/get-pdf', 'POST', values);
                    const data = responest.data;
                    if (data && data.success) {
                        message.success(data.msg);
                        window.open(data.pdf_url);
                    } else {
                        message.error(data.msg);
                    }
                }
            });
        }else {
            message.error("请登录后再操作！");
        }
    };
    onSave = (e) => {
        e.preventDefault();
        if (cookie.load('userId')) {
            const _this = this;
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    values.pdf_id = this.state.id;
                    Object.keys(values).forEach((item, idx) => {
                        if (!values[item]) {
                            values[item] = '';
                        }
                    })
                    const responest = await request('/common/save-pdf', 'POST', {
                        ...values,
                        pdf_id: this.state.id,
                        member_id: cookie.load('userId')
                    });
                    const data = responest.data;
                    if (data && data.success) {
                        message.success(data.msg);
                    } else {
                        message.error(data.msg);
                    }
                }
            });
        } else {
            message.error("请登录后再操作！");
        }
    }

    render() {
        const {detailInfo, provinceSelect, citySelect, areaSelect, register_address} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Form ref="form" {...layout} name="nest-messages" onSubmit={this.onFinish}>
                    <div className="collection-butn mt10">
                        <Button type="primary" onClick={this.onSave} className="ml15">保存</Button>
                        <Button type="primary" htmlType="submit" className="ml15">一键生成申请书</Button>
                        <Button className="back-butn" icon="rollback" onClick={() => {
                            this.props.history ? this.props.history.goBack() : window.history.go(-1);
                        }}>返回</Button>
                    </div>
                    <div className="d-information-item">
                        <TitleTwo name="企业实行特殊工时制度申请表"/>
                        <table>
                            <thead>
                            <tr>
                                <th colSpan={4} style={{padding: "10px"}}>
                                    <Row>
                                        <Col span={2} style={{width: "80px"}}>
                                            单位名称
                                        </Col>
                                        <Col span={22}>
                                            {getFieldDecorator('a0')(
                                                <Input placeholder="重庆市xxxxxx有限公司"/>
                                            )}
                                        </Col>
                                    </Row>
                                </th>
                            </tr>
                            <tr>
                                <th style={{width: "180px"}}>单位性质</th>
                                <td>
                                    {getFieldDecorator('a1')(
                                        <Input placeholder="有限责任"/>
                                    )}
                                </td>
                                <th>法定代表人</th>
                                <td>
                                    {getFieldDecorator('a2')(
                                        <Input placeholder="xxx"/>
                                    )}
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>工商登记注册地</th>
                                <td>
                                    {getFieldDecorator('a3')(
                                        <Input placeholder="重庆市九龙坡区XX路XX号"/>
                                    )}
                                </td>
                                <th>单位代码</th>
                                <td className="address-box">
                                    {getFieldDecorator('a4')(
                                        <Input placeholder="（填统一社会信用代码）"/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>经营范围</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('a5')(
                                        <TextArea placeholder="按照营业执照的经营范围填写"/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>职工总数</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('a6')(
                                        <Input placeholder="填所有职工总数"/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={4} style={{padding: "10px"}}>
                                    <Row>
                                        <Col span={2} style={{width: "80px"}}>
                                            申请期限
                                        </Col>
                                        <Col span={22}>
                                            {getFieldDecorator('a7')(
                                                <Input placeholder="2017年 7月至 2018年6月"/>
                                            )}
                                        </Col>
                                    </Row>
                                </th>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Form>
            </div>
        );
    };
}

export default Form.create()(Form2);