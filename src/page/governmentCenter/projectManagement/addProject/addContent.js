/**
 *  添加扶持条件
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Input, Row, Col, Button, Select, DatePicker, Breadcrumb,Form,Upload,Icon, message, Modal, Table, Tooltip, Checkbox, Switch,Tag,InputNumber} from 'antd';
import moment from 'moment';
import {request} from '../../../../utils/request';
import Top from '../../../../component/top/index';
import cookie from 'react-cookies';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';

import E from 'wangeditor'



const { Option } = Select;
const {Search,TextArea} = Input;
const layout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
};

const uploadUrl = 'http://58.144.217.13:5001/api/common/upload-file';

const { RangePicker } = DatePicker;

class AddContent extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
            addressNum: 1,
            addressArr: [],
            address: true,
            set_up: true,
            knowledge: true,
            invention: true,
            industry_label: true,
            declare: true,
            social: true,
            data: this.props.defaultValue || null
        }
    }
    componentDidMount() {
        this.getProvinceData();//获取省
        this.getIndustry();
        this.getDefalut(); //获取默认值
    }
    getDefalut = ()=>{
        let addressList = [];
        const {data} = this.state;
        if(data) {

            data.register_address && data.register_address.split("|").forEach((item, idx) => {
                const itemList = item.split(",");
                if (itemList.length > 0) {
                    let {addressArr = []} = this.state;
                    if (!addressArr[idx]) addressArr[idx] = {}
                    addressArr[idx].province = parseInt(itemList[0]);
                    if (itemList.length >= 3 && itemList[2]) {
                        addressArr[idx].city = parseInt(itemList[1]);
                        addressArr[idx].area = parseInt(itemList[2]);
                    } else if (itemList.length == 2 && itemList[1]) {
                        addressArr[idx].city = parseInt(itemList[1]);
                    }
                    this.setState({
                        addressArr
                    });
                }
                itemList.forEach((iItem, iIdx) => {
                    if (iIdx == 1 && itemList[0]) {
                        this.getCityData(parseInt(itemList[0]), idx);
                    }
                    if (iIdx == 2 && itemList[1]) {
                        this.getAreaData(parseInt(itemList[1]), idx)
                    }
                });
                addressList.push(itemList);
                this.setState({
                    addressList,
                    addressNum: addressList.length <= 0 ? 1 : addressList.length
                });
            });

            if(data.industry_label_list){
                data.industry_label_ids = data.industry_label_list
            }
            this.props.form.setFieldsValue(data);

            if (data.set_up_sign == "-1,0,1" || data.set_up_sign === undefined) {
                this.switchChange(false, "set_up");
            }
            if (data.knowledge_sign == "-1,0,1" || data.knowledge_sign === undefined) {
                this.switchChange(false, "knowledge");
            }
            if (data.register_address == "" || data.register_address === undefined) {
                this.switchChange(false, "address");
            }
            if (data.invention_sign == "-1,0,1" || data.invention_sign === undefined) {
                this.switchChange(false, "invention");
            }
            if ((data.industry_label_ids && data.industry_label_ids.length <= 0) || data.industry_label_ids === undefined || data.industry_label_ids == "") {
                this.switchChange(false, "industry_label");
            }
            if (data.declare_sign == "-1,0,1" || data.declare_sign === undefined) {
                this.switchChange(false, "declare");
            }
            if (data.social_people_sign == "-1,0,1" || data.social_people_sign === undefined) {
                this.switchChange(false, "social");
            }
        }
    }
    getIndustry = async()=>{
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const industryData = selectIndustryData.data;
        this.setState({
            industryData: industryData.data
        })
    }
    getProvinceData = async () =>{
        const provinceData = await request('/common/get-province', 'POST'); //获取省
        if(provinceData.status == 200){
            this.setState({
                provinceSelect: provinceData.data.data
            });
        }

    }

    getCityData = async (provinceId,i) =>{
        const cityData = await request('/common/get-city', 'POST',{province_id:provinceId}); //获取市
        if(cityData.status == 200){
            this.setState({
                ["citySelect"+i]: cityData.data.data
            });
        }

    }

    getAreaData = async (cityId,i) =>{
        // console.log(this.state.addressArr);
        const areaData = await request('/common/get-area', 'POST',{province_id:this.state["addressArr"][i].province,city_id:cityId}); //获取区县
        if(areaData.status == 200){
            this.setState({
                ["areaSelect"+i]: areaData.data.data
            });
        }

    }
    //复选框选中取消
    setCheckBox = (e) =>{
        const {checked,value} = e.target;
        this.setState({
            [value]:checked
        });
        if(!checked){
            this.props.form.setFieldsValue({
                [value]:undefined
            });
        }
    }
    //开关关闭开启
    switchChange = (checked,string) =>{
        this.setState({
            [string]:checked
        })

        if(!checked){
            if(string === "declare"){
                this.props.form.setFieldsValue({
                    ["develop_assets_value"]: undefined,
                    ["develop_assets_sign"]: undefined,
                    ["declare_value"]: undefined,
                    ["declare_sign"]: undefined,
                    ["develop_sign"]: undefined,
                    ["develop_value"]: undefined
                });
            }else if(string === "social"){
                this.props.form.setFieldsValue({
                    ["social_people_value"]: undefined,
                    ["social_people_sign"]: undefined,
                    ["develop_people_value"]: undefined,
                    ["develop_people_sign"]: undefined,
                });
            }else if(string === "address"){
                this.setState({
                    addressArr:[],
                    addressNum:1
                })
            }else if(string === "industry_label"){
                this.props.form.setFieldsValue({
                    ["industry_label_ids"]: undefined
                });
            }else{
                this.props.form.setFieldsValue({
                    [string+"_value"]: undefined,
                    [string+"_sign"]: undefined
                });
            }
        }else{
            if(string === "declare"){
                this.props.form.setFieldsValue({
                    ["develop_assets_value"]: 0,
                    ["develop_assets_sign"]: "-1,0",
                    ["declare_value"]: 0,
                    ["declare_sign"]: "-1,0",
                    ["develop_sign"]: "-1,0",
                    ["develop_value"]: 0
                });
            }else if(string === "social"){
                this.props.form.setFieldsValue({
                    ["social_people_value"]: 0,
                    ["social_people_sign"]: "-1,0",
                    ["develop_people_value"]: 0,
                    ["develop_people_sign"]: "-1,0",
                });
            }else if(string === "set_up"){
                this.props.form.setFieldsValue({
                    [string + "_value"]: 2000,
                    [string + "_sign"]: "-1,0"
                });
            }else{
                this.props.form.setFieldsValue({
                    [string+"_value"]: 0,
                    [string+"_sign"]: "-1,0"
                });
            }
        }
    }
    addContent = () =>{
        this.setState({
            addContentNum:++this.state.addContentNum
        })
    }

    //选择省
    onProvinceChange = (value, option,i) =>{
        let { addressArr=[] } = this.state;
        addressArr[i] = {
            province:value
        };
        this.setState({
            addressArr,
            ["citySelect"+i]:null,
            ["areaSelect"+i]:null
        },()=>{
            this.getCityData(value,i);
        });
    }
    onCityChange = (value,option,i)=>{
        let { addressArr=[] } = this.state;
        if(!addressArr[i])addressArr[i] = {};
        addressArr[i].city = value;
        addressArr[i].area = '';
        this.setState({
            addressArr,
            ["areaSelect"+i]:null
        },()=>{
            this.getAreaData(value,i);
        });
    }
    onAreaChange = (value,option,i) =>{
        let { addressArr=[] } = this.state;
        if(!addressArr[i])addressArr[i] = {};
        addressArr[i].area = value;
        this.setState({
            addressArr
        });
    }
    //地址添加一项
    addAddress = () =>{
        this.setState({
            addressNum:++this.state.addressNum
        })
    }
    //注册地址
    addressDom = () =>{
        const {provinceSelect,addressNum,addressArr=[],address} = this.state;
        let html=[];
        for(let i = 0; i<addressNum;i++){
            html.push(<Row key={i} style={i==0? {} : {marginTop:"10px"}}>
                {provinceSelect ? <Col span={6}>
                    <div style={{marginRight:"40px"}}>
                        <Select
                            style={{ width: '100%',marginRight:"20px"}}
                            onChange={(value, option)=>this.onProvinceChange(value, option,i)}
                            value={addressArr[i] && addressArr[i].province}
                            disabled={!address}
                        >
                            {provinceSelect.map((item,idx)=><Option value={item.id} key={idx}>{item.value}</Option>)}
                        </Select>
                    </div>
                    <span className="address-title">省</span>
                </Col> : null}
                {this.state["citySelect"+i] && address ? <Col span={6}>
                    <div style={{marginRight:"40px"}}>
                        <Select
                            disabled={!address}
                            style={{ width: '100%',marginRight:"20px"}}
                            onChange={(value, option)=>this.onCityChange(value, option,i)}
                            value={addressArr[i] && addressArr[i].city}
                        >
                            {this.state["citySelect"+i].map((item,idx)=><Option value={item.id} key={idx}>{item.value}</Option>)}
                        </Select>
                    </div>
                    <span className="address-title">市</span>
                </Col> : null}
                {this.state["areaSelect"+i] && address ? <Col span={6}>
                    <div style={{marginRight:"40px"}}>
                        <Select
                            disabled={!address}
                            style={{ width: '100%'}}
                            onChange={(value, option)=>this.onAreaChange(value, option,i)}
                            value={addressArr[i] && addressArr[i].area}
                        >
                            {this.state["areaSelect"+i].map((item,idx)=><Option value={item.id} key={idx}>{item.value}</Option>)}
                        </Select>
                    </div>
                    <span className="address-title">区县</span>
                </Col> : null}
                {i==0 ? <Col span={4}>
                    <Tag className="site-tag-plus" onClick={this.addAddress}>
                        {/*<PlusOutlined />*/}
                        <Icon type="plus" />
                        可多选
                    </Tag>
                </Col> : null}
            </Row>)
        }
        return (html);
    }
    //扶持内容
    contentDom = () =>{
        const {addContentNum,contentArr=[]} = this.state;
        const { getFieldDecorator } = this.props.form;
        let html=[];
        for(let i = 0; i<addContentNum;i++){
            html.push(<Row key={i} style={{marginBottom:"10px"}}>
                <Col span={16}>
                    <div style={{marginRight:"10px"}}>
                        {getFieldDecorator(`content[${i}]`)(<TextArea type="textarea" rows={4} style={{width:"100%",height:"100px"}}/>)}
                    </div>
                </Col>
                <Col span={4}>
                    <div>
                        <Button onClick={this.showContentModal}>{contentArr && contentArr[i] ? "编辑条件" : "添加条件"}</Button>
                    </div>
                </Col>
                {i==0 ? <Col span={4}>
                    <Tag className="site-tag-plus content-tag" onClick={this.addContent}>
                        {/*<PlusOutlined />*/}
                        <Icon type="plus" />
                        可多选
                    </Tag>
                </Col> : null}
            </Row>)
        }
        return (html);
    }
    onFinish = async (e) => {
        e.preventDefault();
        const {addressArr} = this.state;
        this.setState({
            state:true
        });
        this.props.form.validateFields(async (err, values) => {
            if(!err) {
                if (addressArr && addressArr.length) {
                    let register_address = addressArr.map((aitem, aidx) => {
                        let address;
                        if(aitem.province){
                            address = aitem.province
                        }
                        if(aitem.city){
                            address += ","+aitem.city
                        }
                        if(aitem.area){
                            address += ","+aitem.area
                        }

                        return address;
                        //(aitem.province ? aitem.province : '') + "," + (aitem.city ? aitem.city : '') + "," + (aitem.area ? aitem.area : '')
                    });
                    values.register_address = register_address.join("|"); //地址
                }
                this.props.callback(values);
            }else{
                message.error("请正确输入内容！");
                window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth',
                });
            }

        });
    }
    render() {
        const {industryData,set_up=true,knowledge=true,invention=true,declare=true,industry_label=true,social=true} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form ref="form" {...layout} name="dynamic_rule" onSubmit={this.onFinish}>
            <table style={{width:"100%"}} className="label-table">
                <thead>
                <tr>
                    <th style={{width:"100px"}}>标签</th>
                    <th>规则设置</th>
                    <th style={{width:"40px"}}>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>成立年限</td>
                    <td>
                        <Row>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('set_up_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            style={{ width: '90%' }}
                                            disabled={!set_up}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={19}>
                                <Form.Item>
                                    {getFieldDecorator('set_up_value',{
                                        initialValue:2000
                                    })(
                                        <Input disabled={!set_up}/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </td>
                    <td>
                        <Switch checked={this.state.set_up} onChange={(checked)=>this.switchChange(checked,"set_up")}/>
                    </td>
                </tr>
                <tr>
                    <td>注册地址</td>
                    <td>
                        {this.addressDom()}
                    </td>
                    <td><Switch checked={this.state.address} onChange={(checked)=>this.switchChange(checked,"address")}/></td>
                </tr>
                <tr>
                    <td>知识产权</td>
                    <td>
                        <Row>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('knowledge_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            disabled={!knowledge}
                                            style={{ width: '90%' }}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={19}>
                                <Form.Item>
                                    {getFieldDecorator('knowledge_value',{
                                        initialValue:0
                                    })(
                                        <Input disabled={!knowledge} suffix="个"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </td>
                    <td>
                        <Switch checked={this.state.knowledge} onChange={(checked)=>this.switchChange(checked,"knowledge")}/></td>
                </tr>
                <tr>
                    <td>发明专利</td>
                    <td>
                        <Row>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('invention_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            disabled={!invention}
                                            style={{ width: '90%' }}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={19}>
                                <Form.Item name="invention_value">
                                    {getFieldDecorator('invention_value',{
                                        initialValue:0
                                    })(
                                        <Input disabled={!invention} suffix="个"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </td>
                    <td><Switch checked={this.state.invention} onChange={(checked)=>this.switchChange(checked,"invention")}/></td>
                </tr>
                <tr>
                    <td>所属行业</td>
                    <td>
                        <Form.Item>
                            {getFieldDecorator('industry_label_ids')(
                                <Select
                                    disabled={!industry_label}
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                            key={item.id}>{item.name}</Option>) : ''}

                                </Select>
                            )}
                        </Form.Item>
                    </td>
                    <td><Switch checked={this.state.industry_label} onChange={(checked)=>this.switchChange(checked,"industry_label")}/></td>
                </tr>
                <tr>
                    <td>财务数据</td>
                    <td>
                        <Row>
                            <Col span={7}>研发投入</Col>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('develop_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            disabled={!declare}
                                            style={{ width: '90%' }}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item>
                                    {getFieldDecorator('develop_value',{
                                        initialValue:0
                                    })(
                                        <Input disabled={!declare} suffix="万元"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={7}>企业报税收入</Col>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('declare_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            disabled={!declare}
                                            style={{ width: '90%' }}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item>
                                    {getFieldDecorator('declare_value',{
                                        initialValue:0
                                    })(
                                        <Input disabled={!declare} suffix="万元"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={7}>研发资产总额</Col>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('develop_assets_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            disabled={!declare}
                                            style={{ width: '90%' }}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item>
                                    {getFieldDecorator('develop_assets_value',{
                                        initialValue:0
                                    })(
                                        <Input disabled={!declare} suffix="万元"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </td>
                    <td><Switch checked={this.state.declare} onChange={(checked)=>this.switchChange(checked,"declare")}/></td>
                </tr>
                <tr>
                    <td>人员数量</td>
                    <td>
                        <Row className="mt10">
                            <Col span={7}>最近一年缴纳社保人数</Col>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('social_people_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            disabled={!social}
                                            style={{ width: '90%' }}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item>
                                    {getFieldDecorator('social_people_value',{
                                        initialValue:0
                                    })(
                                        <Input disabled={!social} suffix="人"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={7}>研发人员</Col>
                            <Col span={4}>
                                <Form.Item>
                                    {getFieldDecorator('develop_people_sign',{
                                        initialValue:"0,1"
                                    })(
                                        <Select
                                            disabled={!social}
                                            style={{ width: '90%' }}
                                        >
                                            <Option value="0,1" key="≥">≥</Option>
                                            <Option value="0" key="=">=</Option>
                                            <Option value="-1,0" key="≤">≤</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item>
                                    {getFieldDecorator('develop_people_value',{
                                        initialValue:0
                                    },)(
                                        <Input disabled={!social} suffix="人"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </td>
                    <td><Switch checked={this.state.social} onChange={(checked)=>this.switchChange(checked,"social")}/></td>
                </tr>
                </tbody>
            </table>
                <div className="addProject-button">
                    <Button type="primary" htmlType="submit" ref="finish">确定</Button>
                    <Button type="primary" className="ml15" ref="save" onClick={this.props.onCancel}>取消</Button>
                </div>
            </Form>
        );
    };
}

export default Form.create()(AddContent);