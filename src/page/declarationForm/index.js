/**
 * 申请书
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Breadcrumb,Button,Alert,Form,message,Input,Select,Row,Col} from 'antd';
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
class DeclarationForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:9
        };
    }
    async componentDidMount() {
        this.getData(this.state.id);
        this.getProvinceData();
    }
    getData = async(id) =>{
        const responest = await request('/declare/get-one/' + id, 'POST'); //详情
        this.setState({
            detailInfo:responest.data
        })

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
    render() {
        const {detailInfo,provinceSelect, citySelect, areaSelect, industryData,isEdit,register_address} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="itemText-template">
                <Top />
                <div className="itemText-label-box max-weight-box">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>申报政策</Breadcrumb.Item>
                        <Breadcrumb.Item href="">项目正文</Breadcrumb.Item>
                        <Breadcrumb.Item href="">申请书填写</Breadcrumb.Item>
                    </Breadcrumb>
                    <Alert message="您正在申报政策，请如实填写以下信息！" type="warning" showIcon />
                    <div className="itemText-infor item-box">
                        <TitleTwo name="申报政策" />
                        <table className="itemText-infor-table">
                            <thead>
                            <tr>
                                <td style={{width:"200px"}}>项目标题</td>
                                <td>{detailInfo && detailInfo.declare.belong_str}</td>
                            </tr>
                            </thead>
                            <tbody>
                            {detailInfo && detailInfo.declare.organization_label_str ?
                            <tr>
                                <td>发布机构</td>
                                <td>{detailInfo && detailInfo.declare.organization_label_str}</td>
                            </tr>:null}
                            {detailInfo && detailInfo.declare.web_url ?
                            <tr>
                                <td>申报材料</td>
                                <td>{detailInfo ? <a href={detailInfo.declare.web_url} target="_blank">{detailInfo.declare.web_url}</a> : "/"}</td>
                            </tr>:null}
                            {detailInfo && detailInfo.declare.money ?
                            <tr>
                                <td>申报流程</td>
                                <td>{detailInfo ? detailInfo.declare.money : "-"}</td>
                            </tr>
                                :null}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <TitleTwo name="申请书" />
                        <Form ref="form" {...layout} name="nest-messages" onSubmit={this.onFinish}>
                        <div className="collection-butn mt10">
                                <Button onClick={()=>this.showModal()} type="primary">保存</Button>
                                <Button type="primary" className="ml15">一键生成申请书</Button>
                                <Button className="back-butn" icon="rollback" onClick={()=>{this.props.history.goBack()}}>返回</Button>
                            </div>
                                <div className="b-information-item">
                                    <TitleTwo name="企业申报信息" />
                                    <table>
                                        <thead>
                                        <tr>
                                            <th style={{width:"200px"}}>企业名称</th>
                                            <td>
                                                {getFieldDecorator('company_name')(
                                                    <Input style={{width:"250px"}} placeholder="请输入企业名称"/>
                                                )}
                                            </td>
                                            <th>法人代表</th>
                                            <td colSpan={3}>
                                                {getFieldDecorator('legal_person')(
                                                    <Input />
                                                )}
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th>社会信用代码</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                            <th>注册地址</th>
                                            <td className="address-box">
                                                {provinceSelect ? <Select defaultValue={register_address ? parseInt(register_address[0]) : null} placeholder="请选择省份" style={{width: 127}}
                                                                          onChange={(value, option) => this.onProvinceChange(value, option)}>
                                                    {provinceSelect.map((item, idx) => <Option
                                                        value={item.id} key={idx}>{item.value}</Option>)}
                                                </Select> : null}
                                                {citySelect ? <Select defaultValue={register_address && register_address[1] && parseInt(register_address[1])} placeholder="请选择市" style={{width: 127, marginLeft: 5}}
                                                                      onChange={(value, option) => this.onCityChange(value, option)}>
                                                    { citySelect.map((item, idx) => <Option value={item.id}
                                                                                            key={idx}>{item.value}</Option>)}

                                                </Select> : null}
                                                {areaSelect ? <Select defaultValue={register_address && register_address[2] && parseInt(register_address[2])} placeholder="请选择区县" style={{width: 132, marginLeft: 5}}
                                                                      onChange={(value, option) => this.onAreaChange(value, option)}>
                                                    {areaSelect.map((item, idx) => <Option value={item.id}
                                                                                           key={idx}>{item.value}</Option>)}
                                                </Select> : null}
                                                {getFieldDecorator('address')(
                                                    <Input placeholder="街道" style={{width:"300px",marginLeft:"10px"}} />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>2019年营业收入</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                            <th>从业人员</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>联系人</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                            <th>联系电话</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>失业保险参保人数</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                            <th>开户名称</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>开户银行</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                            <th>银行帐号</th>
                                            <td>
                                                {getFieldDecorator('code')(
                                                    <Input />
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>企业承诺</th>
                                            <td colSpan={3}>
                                                <div>以上申报内容信息属实，所提供各项材料真实，按照工信部联企业〔2011〕300号文件，本企业属于中小企业，不属于严重违法失信企业。否则，本企业及本人愿意承担由此产生的一切法律责任。</div>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label="经办人">
                                        {getFieldDecorator('code')(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="法定代表人">
                                        {getFieldDecorator('code')(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                                            </td>

                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    };
}

export default Form.create()(DeclarationForm);