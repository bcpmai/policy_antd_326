/**
 * 工商信息
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Button, Form, Input, Row, Col, Select, DatePicker, Radio} from 'antd';
import Top from '../../../component/top/index';
import Title from "../../../component/title/index";
import './index.css';
import cookie from "react-cookies";
import {message} from "antd/lib/index";
import {request} from "../../../utils/request";
import TitleTwo from "../../../component/titleTwo";
import EnterpriseMenu from '../../../component/enterpriseCenterMenu';
import moment from 'moment';
import PolicyManagementMenu from "../../../component/policyManagementMenu/index";

const {MonthPicker} = DatePicker;
const {Option} = Select;
const { TextArea } = Input;
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class BusinessInformation extends Component {
    constructor(props) {
        super(props);
        const id = props.match.params ? props.match.params.id : null;
        this.state = {
            isEdit:id ? true : false,
            id:id
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
        let id = cookie.load('userId');
        if(this.state.id){
            id = parseInt(this.state.id);
        }
        const requestData = await request('/company/get-company-user', 'POST',{member_id:id});
        const tableData = await request('/company/get-details','POST',{member_id:id});
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const industryData = selectIndustryData.data;
        const data = requestData.data;
        const tData = tableData.data;
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
                console.log(tData.json_data)
                this.props.form.setFieldsValue({...tData.json_data,...data});
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
                const responest = await request('/company/details-update', 'POST', values);
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
        const {provinceSelect, citySelect, areaSelect, industryData,isEdit,register_address,id} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="b-information-template">
                <Top/>
                <div className="information-form-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            {id ? <PolicyManagementMenu current="enterprise"/>:<EnterpriseMenu menuKey="businessInformation"/>}

                        </Col>
                        <Col span={20}>
                            <Title name="企业工商信息"/>
                <Form ref="form" {...layout} name="nest-messages" onSubmit={this.onFinish}>
                    <div className="b-information-item">
                        <TitleTwo name="企业工商信息" />
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width:"200px"}}>企业名称</th>
                                    <td>
                                        {getFieldDecorator('company_name')(
                                            <Input style={{width:"250px"}} disabled placeholder="请输入企业名称"/>
                                        )}
                                    </td>
                                    <th>社会信用代码</th>
                                    <td colSpan={3}>
                                        {getFieldDecorator('code')(
                                            <Input disabled />
                                        )}
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>所属行业</th>
                                    <td>
                                        {getFieldDecorator('industry_label_id')(
                                            <Select style={{width:"250px"}} disabled placeholder="请选择所属行业">
                                                {industryData ? industryData.map((item, idx) => <Option
                                                    value={item.id}
                                                    key={item.id}>{item.name}</Option>) : ''}
                                            </Select>
                                        )}
                                    </td>
                                    <th>注册时间</th>
                                    <td>
                                        {getFieldDecorator('set_up_value')(
                                            <MonthPicker style={{width:"255px"}} disabled onChange={this.onChange} format="YYYY-MM" picker="month"/>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>注册资本 （万）</th>
                                    <td>
                                        {getFieldDecorator('registered_assets')(
                                            <Input disabled={isEdit}/>
                                        )}
                                    </td>
                                    <th>法人代表</th>
                                    <td colSpan={3}>
                                        {getFieldDecorator('legal_person')(
                                            <Input disabled={isEdit} />
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>注册地址</th>
                                    <td colSpan={5} className="address-box">
                                        {provinceSelect ? <Select disabled defaultValue={register_address ? parseInt(register_address[0]) : null} placeholder="请选择省份" style={{width: 127}}
                                                                  onChange={(value, option) => this.onProvinceChange(value, option)}>
                                            {provinceSelect.map((item, idx) => <Option
                                                value={item.id} key={idx}>{item.value}</Option>)}
                                        </Select> : null}
                                        {citySelect ? <Select disabled defaultValue={register_address && register_address[1] && parseInt(register_address[1])} placeholder="请选择市" style={{width: 127, marginLeft: 5}}
                                                               onChange={(value, option) => this.onCityChange(value, option)}>
                                            { citySelect.map((item, idx) => <Option value={item.id}
                                                                                    key={idx}>{item.value}</Option>)}

                                        </Select> : null}
                                        {areaSelect ? <Select disabled defaultValue={register_address && register_address[2] && parseInt(register_address[2])} placeholder="请选择区县" style={{width: 132, marginLeft: 5}}
                                                              onChange={(value, option) => this.onAreaChange(value, option)}>
                                            {areaSelect.map((item, idx) => <Option value={item.id}
                                                                                   key={idx}>{item.value}</Option>)}
                                        </Select> : null}
                                        {getFieldDecorator('address')(
                                            <Input disabled={isEdit} placeholder="街道" style={{width:"300px",marginLeft:"10px"}} />
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>经营范围</th>
                                    <td colSpan={5}>
                                        {getFieldDecorator('scope_business')(
                                            <TextArea disabled={isEdit} autoSize={{ minRows: 2, maxRows: 6 }} />
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="b-information-item">
                        <TitleTwo name="企业经营概况" />
                        <table>
                            <thead>
                            <tr>
                                <th style={{width:"200px"}} rowSpan={6}>企业规模</th>
                                <th style={{width:"250px"}}>企业投资总规模（万元）</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('a1')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>去年期末总资产（万元）</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('a2')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>去年期末净资产（万元）</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('a3')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>企业经营场地类型</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('a4')(
                                    <Radio.Group disabled={isEdit}>
                                        <Radio value={1}>写字楼</Radio>
                                        <Radio value={2}>工厂</Radio>
                                        <Radio value={3}>其他</Radio>
                                    </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>经营场地面积（平方米）</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('a20')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>经营规模</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('a5')(
                                    <Radio.Group disabled={isEdit}>
                                        <Radio value={1}>微型</Radio>
                                        <Radio value={2}>小型</Radio>
                                        <Radio value={3}>中型</Radio>
                                        <Radio value={4}>大型</Radio>
                                    </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th rowSpan={4}>产值情况</th>
                                <th>年份</th>
                                <th colSpan={2}>产值（万元）</th>
                                <th colSpan={2}>增长率（%）</th>
                            </tr>
                            <tr>
                                <th>去年</th>
                                <td colSpan={2}>
                                    {getFieldDecorator('a6')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <td colSpan={2}>
                                    {getFieldDecorator('a7')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>前年</th>
                                <td colSpan={2}>
                                    {getFieldDecorator('a8')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <td colSpan={2}>
                                    {getFieldDecorator('a9')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>上前年</th>
                                <td colSpan={2}>
                                    {getFieldDecorator('a10')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <td colSpan={2}>
                                    {getFieldDecorator('a11')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>主营业务收入(万元)</th>
                                <th>去年主营业务收入</th>
                                <td colSpan={4}></td>
                            </tr>
                            <tr>
                                <th rowSpan={4}>净利润情况</th>
                                <th>年份</th>
                                <th colSpan={2}>产值（万元）</th>
                                <th colSpan={2}>增长率（%）</th>
                            </tr>
                            <tr>
                                <th>去年</th>
                                <td colSpan={2}>
                                    {getFieldDecorator('a12')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <td colSpan={2}>
                                    {getFieldDecorator('a13')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>前年</th>
                                <td colSpan={2}>
                                    {getFieldDecorator('a14')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <td colSpan={2}>
                                    {getFieldDecorator('a15')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>上前年</th>
                                <td colSpan={2}>
                                    {getFieldDecorator('a16')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <td colSpan={2}>
                                    {getFieldDecorator('a17')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="b-information-item">
                        <TitleTwo name="企业员工信息" />
                        <table>
                            <thead>
                            <tr>
                                <th style={{width:"200px"}}>当年缴纳社保员工总数</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('b1')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>大专、本科人数(个)</th>
                                <td colSpan={1}>
                                    {getFieldDecorator('b2')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <th>大专、本科占比(%)</th>
                                <td colSpan={1}>
                                    {getFieldDecorator('b3')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>研发人才数量(人)</th>
                                <td colSpan={1}>
                                    {getFieldDecorator('b4')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <th>研发人才占比(%)</th>
                                <td colSpan={1}>
                                    {getFieldDecorator('b5')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>高级职称、博士、硕士人数(人)</th>
                                <td colSpan={1}>
                                    {getFieldDecorator('b6')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                                <th>高级职称、博士、硕士占比(%) </th>
                                <td colSpan={1}>
                                    {getFieldDecorator('b7')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="b-information-item b-information-item-type">
                        <TitleTwo name="企业固定资产情况" />
                        <table>
                            <thead>
                            <tr>
                                <th>去年新增生产设备(万元)</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('c1')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>生产设备总投入总额(万元)</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('c2')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>技术研发设备投入(万元) </th>
                                <td colSpan={3}>
                                    {getFieldDecorator('c3')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="b-information-item b-information-item-type2">
                        <TitleTwo name="企业技术研发" />
                        <table>
                            <thead>
                            <tr>
                                <th style={{width:"200px"}} rowSpan={2}>研发投入</th>
                                <th style={{width:"250px"}}>去年研发投入额(万元) </th>
                                <td colSpan={4}>
                                    {getFieldDecorator('d1')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>去年研发投入率(%) </th>
                                <td colSpan={4}>
                                    {getFieldDecorator('d2')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th rowSpan={2}>研发准备金</th>
                                <th style={{width:"250px"}}>去年(万元) </th>
                                <td colSpan={4}>
                                    {getFieldDecorator('d3')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>今年(万元) </th>
                                <td colSpan={4}>
                                    {getFieldDecorator('d4')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="b-information-item b-information-item-type2">
                        <TitleTwo name="企业知识产权" />
                        <table>
                            <tbody>
                            <tr>
                                <th rowSpan={9}>知识产权成果 </th>
                                <th>国内商标注册数量(件)</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('e1')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>国外商标注册数量(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e2')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>发明专利数量(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e3')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>实用新型专利数量(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e4')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>外观专利数量(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e5')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>国际专利数量(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e6')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>专利总量(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e7')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>软著数量(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e8')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>知识产权总数(件)</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('e9')(
                                        <Input disabled={isEdit} style={{width: 200}}/>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="b-information-item b-information-item-type2">
                        <TitleTwo name="企业股改" />
                        <table>
                            <tbody>
                            <tr>
                                <th rowSpan={3}>股改 </th>
                                <th>是否在金融办报备上市储备库</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('f1')(
                                    <Radio.Group disabled={isEdit}>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={2}>否</Radio>
                                    </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>三年内是否有上市计划</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('f2')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>拟上市板块 </th>
                                <td colSpan={4}>
                                    {getFieldDecorator('f3')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>主板</Radio>
                                            <Radio value={2}>中小板</Radio>
                                            <Radio value={3}>创业板|科创板</Radio>
                                            <Radio value={4}>新三板</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="b-information-item b-information-item-type2">
                        <TitleTwo name="企业资质信息" />
                        <table>
                            <tbody>
                            <tr>
                                <th rowSpan={10}>各类资质 </th>
                                <th>成长型微型企业培育入库</th>
                                <td colSpan={3}>
                                    {getFieldDecorator('g1')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>科技型企业入库 </th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g2')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>企业研发准备金备案</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g3')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>知识产权管理规范贯标认证</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g4')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>工业与信息化两化融合贯标认证</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g5')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>已成为知识产权优势企业</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g6')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>已通过质量管理体系认证</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g7')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>是否获得对外投资</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g8')(
                                        <Radio.Group disabled={isEdit}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>产品已列入《技术创新指导性项目推荐目录》</th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g9')(
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>最近3年未列入失信联合惩戒对象名单(年) </th>
                                <td colSpan={4}>
                                    {getFieldDecorator('g10')(
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                        </Radio.Group>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    {id ? <div className="b-information-butn"><Button onClick={() => {
                            this.props.history.goBack()
                        }}>返回</Button></div> :
                        <div className="b-information-butn">
                            <Button htmlType="submit" type="primary">确定</Button>
                            <Button onClick={() => {
                                this.props.history.push("/matching")
                            }}>取消</Button>
                        </div>
                    }
                </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    };
}

export default Form.create()(BusinessInformation);