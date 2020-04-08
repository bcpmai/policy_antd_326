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

class Form1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 59
        };
    }

    async componentDidMount() {
        this.getProvinceData();
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
        const cityData = await request('/common/get-city', 'POST', {province_id: parseInt(provinceId)}); //获取市
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
            province_id: parseInt(province_id) || this.state.addressArr && parseInt(this.state.addressArr.province),
            city_id: parseInt(cityId)
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
        let arrValue = value.split("|");
        addressArr = {
            province: arrValue[0],
            provinceValue:arrValue[1]
        };
        this.setState({
            addressArr,
            citySelect: null,
            areaSelect: null,
            register_address: null
        }, () => {
            this.getCityData(value[0]);
        });
    }
    onCityChange = (value, option) => {
        let {addressArr = {}, register_address} = this.state;
        if (!addressArr.province) {
            addressArr.province = register_address[0]
        }
        let arrValue = value.split("|");
        addressArr.city = arrValue[0];
        addressArr.cityValue = arrValue[1];
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
        let arrValue = value.split("|");
        addressArr.area = arrValue[0];
        addressArr.areaValue = arrValue[1];
        this.setState({
            addressArr
        });
    }
    onFinish = (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {addressArr} = this.state;
                values.addressArr = '';
                if(addressArr) {
                    values.addressArr = (addressArr.provinceValue || '')+ (addressArr.cityValue || '') + (addressArr.areaValue || '');
                }
                Object.keys(values).forEach((item,idx)=>{
                    if(!values[item]){
                        values[item] = '';
                    }
                })
                const responest = await request('/common/get-pdf', 'POST', {...values,pdf_id:this.state.id});
                const data = responest.data;
                if (data && data.success) {
                    message.success(data.msg);
                    window.open(data.pdf_url);
                } else {
                    message.error(data.msg);
                }
            }
        });

    };

    render() {
        const {detailInfo, provinceSelect, citySelect, areaSelect, industryData, isEdit, register_address} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (

            <div>
                <Form ref="form" {...layout} name="nest-messages" onSubmit={this.onFinish}>
                    <div className="collection-butn mt10">
                        <Button type="primary" htmlType="submit" className="ml15">一键生成申请书</Button>
                        <Button className="back-butn" icon="rollback" onClick={() => {
                            this.props.history.goBack()
                        }}>返回</Button>
                    </div>
                    <div className="d-information-item">
                        <TitleTwo name="企业申报信息"/>
                        <table>
                            <thead>
                            <tr>
                                <th style={{width: "180px"}}>企业名称</th>
                                <td>
                                    {getFieldDecorator('a1')(
                                        <Input placeholder="请输入企业名称"/>
                                    )}
                                </td>
                                <th>法定代表人</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('a2')(
                                        <Input/>
                                    )}
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>统一社会信用代码</th>
                                <td>
                                    {getFieldDecorator('a3')(
                                        <Input/>
                                    )}
                                </td>
                                <th>失业保险参保所在地</th>
                                <td className="address-box">
                                    {provinceSelect ?
                                        <Select defaultValue={register_address ? parseInt(register_address[0]) : null}
                                                placeholder="请选择省份" style={{width: 127}}
                                                onChange={(value, option) => this.onProvinceChange(value, option)}>
                                            {provinceSelect.map((item, idx) => <Option
                                                value={item.id+"|"+item.value} key={idx}>{item.value}</Option>)}
                                        </Select> : null}
                                    {citySelect ? <Select
                                        defaultValue={register_address && register_address[1] && parseInt(register_address[1])}
                                        placeholder="请选择市" style={{width: 127, marginLeft: 5}}
                                        onChange={(value, option) => this.onCityChange(value, option)}>
                                        {citySelect.map((item, idx) => <Option value={item.id+"|"+item.value}
                                                                               key={idx}>{item.value}</Option>)}

                                    </Select> : null}
                                    {areaSelect ? <Select
                                        defaultValue={register_address && register_address[2] && parseInt(register_address[2])}
                                        placeholder="请选择区县" style={{width: 132, marginLeft: 5}}
                                        onChange={(value, option) => this.onAreaChange(value, option)}>
                                        {areaSelect.map((item, idx) => <Option value={item.id+"|"+item.value}
                                                                               key={idx}>{item.value}</Option>)}
                                    </Select> : null}
                                    {getFieldDecorator('a4')(
                                        <Input placeholder="街道" style={{width: "200px", marginLeft: "10px"}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>2019年营业收入</th>
                                <td>
                                    {getFieldDecorator('a5')(
                                        <Input/>
                                    )}
                                </td>
                                <th>从业人员</th>
                                <td>
                                    {getFieldDecorator('a6')(
                                        <Input/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>联系人</th>
                                <td>
                                    {getFieldDecorator('a7')(
                                        <Input/>
                                    )}
                                </td>
                                <th>联系电话</th>
                                <td>
                                    {getFieldDecorator('a8')(
                                        <Input/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>失业保险参保人数</th>
                                <td>
                                    {getFieldDecorator('a9')(
                                        <Input/>
                                    )}
                                </td>
                                <th>开户名称</th>
                                <td>
                                    {getFieldDecorator('a10')(
                                        <Input/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>开户银行</th>
                                <td>
                                    {getFieldDecorator('a11')(
                                        <Input/>
                                    )}
                                </td>
                                <th>银行帐号</th>
                                <td>
                                    {getFieldDecorator('a12')(
                                        <Input/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>企业承诺</th>
                                <td colSpan={3}>
                                    <div>以上申报内容信息属实，所提供各项材料真实，按照工信部联企业〔2011〕300号文件，本企业属于中小企业，不属于严重违法失信企业。否则，本企业及本人愿意承担由此产生的一切法律责任。</div>
                                    <Row className="mt10">
                                        <Col span={12}>
                                            经办人：
                                        </Col>
                                        <Col span={12}>
                                            <div style={{textAlign: "right", "paddingRight": 100}}>
                                                法定代表人：<br/>
                                                年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;日
                                            </div>
                                        </Col>
                                    </Row>
                                </td>

                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Form>
            </div>
        );
    };
}

export default Form.create()(Form1);