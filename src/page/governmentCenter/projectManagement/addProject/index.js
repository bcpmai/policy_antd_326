/**
 *  添加项目
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

class AddProject extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:props.match.params ? props.match.params.id : null,
            policyVisible:false,
            tableData:[],
            addressNum:1,
            address:true,
            set_up:true,
            knowledge:true,
            address:true,
            invention:true,
            industry_label:true,
            declare:true,
            social:true
        }
    }

    componentDidMount(){
        if(!this.state.id) {
            this.createEditor("editorElem1", "support_direction");//扶持方向
            this.createEditor("editorElem2", "declare_condition");//申报条件
            this.createEditor("editorElem3", "support_content");//扶持内容
            this.createEditor("editorElem4", "declare_material");//申报材料
            this.createEditor("editorElem5", "declare_process");//申报流程
            this.createEditor("editorElem6", "review_process");//评审流程
        }
        this.getDefalutData();
        this.getTableData();
        this.getProvinceData();//获取省
        this.columns = [
            {
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                width: 280,
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><a onClick={()=>this.onSelectChange(record.id,record.title,true)}>{text.length < 15 ? text : text.substr(0,15)+"..."}</a></Tooltip>
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
                title: '发文日期',
                key: 'updated_date',
                dataIndex: 'updated_date',
                width: 200
            }
        ];

    }
    getTableData = async (values={}) =>{
        if(!values.max_line){
            values.max_line = 5;
        }
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
    createEditor = (editorElem,editorContent,value) =>{
        const elem = this.refs[editorElem]; //获取editorElem盒子
        //const submit = this.refs.submit; //获取提交按钮
        const editor = new E(elem)  //new 一个 editorElem富文本
        editor.customConfig.uploadFileName = 'file'; //置上传接口的文本流字段
        editor.customConfig.uploadImgServer = uploadUrl;//服务器接口地址
        editor.customConfig.onchange = html => {
            this.setState({
                [editorContent]: html
            })
        };
        editor.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                console.log(insertImg, result, editor, "file")
                if(result.success) {
                    var url = result.data.image_url  //监听图片上传成功更新页面
                    insertImg(url)
                }
            }
        };
        editor.create() //创建

        if(value){
            editor.txt.html(value);
        }
    }
    getDefalutData = async() =>{
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-declare-label', 'POST'); //应用类型
        const selectBelongData = await request('/common/get-all-belong-label', 'POST'); //所属层级
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业


        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const belongData = selectBelongData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && belongData && belongData.success && industryData && industryData.success) {
            // const allItem = {id: 0,name: "全部"};
            // themData.data.unshift(allItem);
            // typeData.data.unshift(allItem);
            // belongData.data.unshift(allItem);
            // industryData.data.unshift(allItem);
            this.setState({
                themeData: themData.data,
                typeData: typeData.data,
                belongData: belongData.data,
                industryData: industryData.data

            })
        }
        //编辑时，获取默认值
        if(this.state.id){
            const {data} = await request(`/declare/get-one/${this.state.id}`, 'GET'); //请求默认数据
            console.log(data,"dddd")
            if(data) {
                const {declare, resource_file_list = []} = data;
                let fileList = [];
                resource_file_list.forEach((item, idx) => {
                    item.name = item.file_ori_name;
                    item.uid = item.id;
                    item.url = item.image_url;
                    fileList.push(item);
                })
                let addressList = [];
                declare.register_address && declare.register_address.split("|").forEach((item, idx) => {
                    const itemList = item.split(",");
                    if (itemList.length > 0) {
                        let {addressArr = []} = this.state;
                        if (!addressArr[idx]) addressArr[idx] = {}
                        addressArr[idx].province = parseInt(itemList[0]);
                        if (itemList.length >= 3) {
                            addressArr[idx].city = parseInt(itemList[1]);
                            addressArr[idx].area = parseInt(itemList[2]);
                        } else if (itemList.length == 2) {
                            addressArr[idx].city = parseInt(itemList[1]);
                        }
                        this.setState({
                            addressArr
                        });
                    }
                    itemList.forEach((iItem, iIdx) => {
                        if (iIdx == 1) {
                            this.getCityData(parseInt(itemList[0]), idx);
                        }
                        if (iIdx == 2) {
                            this.getAreaData(parseInt(itemList[1]), idx)
                        }
                    });
                    addressList.push(itemList);
                });
                this.setState({
                    data,
                    addressList,
                    fileList,
                    release_date: declare.release_date,
                    content: declare.content,
                    policyTitle: declare.pc_title,
                    selectedRowKeys: [declare.policy_id],
                    isSelectPolicy: true,
                    declare_net: declare.declare_net,
                    post_material: declare.post_material,
                    addressNum: addressList.length <= 0 ? 1 : addressList.length,
                    declare_start_date: declare.declare_start_date,
                    declare_end_date: declare.declare_end_date,
                    support_direction: declare.support_direction,
                    declare_condition: declare.declare_condition,
                    support_content: declare.support_content,
                    declare_material: declare.declare_material,
                    declare_process: declare.declare_process,
                    review_process: declare.review_process
                });

                if (declare.declare_start_date && declare.declare_end_date) {
                    declare.declare_start_date = [moment(declare.declare_start_date, 'YYYY-MM-DD'), moment(declare.declare_end_date, 'YYYY-MM-DD')];
                }
                if (declare.release_date) {
                    declare.release_date = moment(declare.release_date, 'YYYY-MM-DD');
                }
                // values.declare_end_date = declare_end_date;
                //  declare.release_date = moment(declare.release_date, 'YYYY-MM-DD');
                // declare.life_date = moment(declare.life_date, 'YYYY-MM-DD');

                declare.organization_label_ids = declare.organization_label_list;
                declare.use_type = declare.use_type_list;
                let d_industry_label_ids;
                if (declare.d_industry_label_ids && declare.d_industry_label_ids != '') {
                    d_industry_label_ids = [];
                    declare.d_industry_label_ids.split(",").forEach((item) => {
                        d_industry_label_ids.push(parseInt(item));
                    });
                }
                let industry_label_ids;
                if (declare.industry_label_ids && declare.industry_label_ids != ''){
                    industry_label_ids =[]
                    declare.industry_label_ids.split(",").forEach((item) => {
                        industry_label_ids.push(parseInt(item));
                    })
                 }
                declare.d_industry_label_ids = d_industry_label_ids;
                declare.industry_label_ids = industry_label_ids;

                this.props.form.setFieldsValue(declare);

                if(declare.set_up_sign == "-1,0,1"){
                    this.switchChange(false,"set_up");
                }
                if(declare.knowledge_sign== "-1,0,1"){
                    this.switchChange(false,"knowledge");
                }
                if(declare.register_address== ""){
                    this.switchChange(false,"address");
                }
                if(declare.invention_sign== "-1,0,1"){
                    this.switchChange(false,"invention");
                }
                if(declare.industry_label_list.length <=0){
                    this.switchChange(false,"industry_label");
                }
                if(declare.declare_sign== "-1,0,1"){
                    this.switchChange(false,"declare");
                }
                if(declare.social_people_sign == "-1,0,1"){
                    this.switchChange(false,"social");
                }

                //editor.txt.html(policy.content);
                this.belongChange(declare.belong); //请求发布机构

                this.createEditor("editorElem1", "support_direction",declare.support_direction);//扶持方向
                this.createEditor("editorElem2", "declare_condition",declare.declare_condition);//申报条件
                this.createEditor("editorElem3", "support_content",declare.support_content);//扶持内容
                this.createEditor("editorElem4", "declare_material",declare.declare_material);//申报材料
                this.createEditor("editorElem5", "declare_process",declare.declare_process);//申报流程
                this.createEditor("editorElem6", "review_process",declare.review_process);//评审流程
            }
        }
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

    onSubmit = async(values,url) => {
        const {policyTitle,id,fileList=[],addressArr,selectedRowKeys,support_direction,declare_condition,support_content,declare_material,declare_process,review_process,declare_start_date,declare_end_date,release_date} = this.state;
        if(policyTitle,support_direction && declare_condition && support_content && declare_material && declare_process) {

            if (addressArr && addressArr.length) {
                let register_address = addressArr.map((aitem, aidx) => aitem.province + "," + aitem.city + "," + aitem.area);
                values.register_address = register_address.join("|"); //地址
            }
            if (selectedRowKeys && selectedRowKeys.length) {
                values.policy_id = selectedRowKeys[0]; //政策id
            }
            values.support_direction = support_direction;
            values.declare_condition = declare_condition;
            values.support_content = support_content;
            values.declare_material = declare_material;
            values.declare_process = declare_process;
            values.review_process = review_process;
            values.declare_start_date = declare_start_date;
            values.declare_end_date = declare_end_date;
            values.release_date = release_date;
            values.d_industry_label_list = values.d_industry_label_ids;
            if (fileList && fileList.length) {
                console.log(fileList);
                values.upload_file_list = fileList.map((item, idx) => {
                    if (item.response) {
                        return item.response.data.id
                    } else {
                        return item.id
                    }
                }); //附件
            }
            if (id) {
                values.id = id;
            }
            const data = await request(this.state.id ? '/declare/update' : '/declare/add', 'POST', values);
            if (data.data && data.data.success) {
                message.success(data.data.msg);
                setTimeout(() => {
                    if(url){
                        window.open(url + "/" + data.data.data.id);
                    }else{
                        this.props.history.push('/projectList');
                    }
                    // this.props.history.push(url ? url+"/"+data.data.data.id : '/projectList');
                }, 2000);
            } else {
                message.error(data.data.msg);
            }
        }else{
            let msg;
            if(!support_direction){
                msg="扶持方向不能为空！";
            }
            if(!declare_condition){
                msg="申报条件不能为空！";
            }
            if(!support_content){
                msg="扶持内容不能为空！";
            }
            if(!declare_material){
                msg="申报材料不能为空！";
            }
            if(!declare_process){
                msg="申报流程不能为空！";
            }
            if(!review_process){
                msg="评审流程不能为空！";
            }
            message.error(msg);
        }
    }
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.setState({
            state:true
        });
        this.props.form.validateFields(async (err, values) => {
            if(!err) {
                values.status = 2;
                this.onSubmit(values);
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
    onSave = async (e) => {
        e.preventDefault();
        const _this = this;
        this.setState({
            state:true
        });
        this.props.form.validateFields(async (err, values) => {
            if(!err) {
                values.status = 1;
                this.onSubmit(values);
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
    onView = (e) =>{
        e.preventDefault();
        const _this = this;
        this.setState({
            state:true
        });
        this.props.form.validateFields(async (err, values) => {
            if(!err) {
                values.status = 1;
                this.onSubmit(values, "/projectPreview");
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
    belongChange = async (value) => {
        const labelProductData = await request('/common/get-all-organization-label', 'POST', {belong_id: value}); //发布机构
        const productData = labelProductData.data;
        if (productData && productData.success) {
            this.setState({
                productData: productData.data
            })
        }
    }
    //发文日期
    onDateChange = (date,dateString) =>{
        console.log(date,dateString)
        this.setState({
            declare_start_date:dateString[0],
            declare_end_date:dateString[1]
        })
    }
    onDatePickerChange = (date,dateString) =>{
        this.setState({
            release_date  :dateString
        })
    }
    onDateLifeChange = (date,dateString) =>{
        this.setState({
            life_date:dateString
        })
    }
    handleChange = (value) =>{
        console.log(`selected ${value}`);
    }
    handleUploadChange = info => {
        console.log(info,"info")
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        //fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        this.setState({ fileList });
    };
    showPolicy = () =>{
        this.setState({
            policyVisible:true
        })
    }
    handleOk = async(e) => {
        this.setState({
            policyVisible: false,
            isSelectPolicy:true
        });
        // const deleteData = await request('/policy/del', 'POST',{id:this.state.id}); //删除数据
        // if(deleteData.data && deleteData.data.success){
        //     message.success(deleteData.data.msg);
        //     this.setState({
        //         policyVisible: false,
        //         id:null
        //     });
        //     setTimeout(()=>{
        //         this.getTableData(this.state.formValues);
        //     },1000);
        // }else{
        //     message.error(deleteData.data.msg);
        // }
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            policyVisible: false,
        });
    };

    onSelectChange = (selectedRowKeys, selectedRows,isSelect) => {
         console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows,isSelect);

        if(isSelect){
            this.setState({ selectedRowKeys:[selectedRowKeys],policyTitle:selectedRows });
            this.handleOk();
        }else{
            this.setState({ selectedRowKeys,policyTitle:selectedRows[0].title });
        }
    };
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
    //地址添加一项
    addAddress = () =>{
        this.setState({
            addressNum:++this.state.addressNum
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
    //注册地址
    addressDom = () =>{
        const {provinceSelect,addressNum,addressArr=[],address} = this.state;
        let html=[];
        for(let i = 0; i<addressNum;i++){
            html.push(<Row key={i}>
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
    render() {
        const {industryData,policyTitle,belongData,typeData,productData,id,tableData,selectedRowKeys,formValues,post_material,declare_net,set_up=true,knowledge=true,invention=true,declare=true,industry_label=true,social=true,isSelectPolicy,
            support_direction,declare_condition,support_content,declare_material,declare_process,review_process,state,data={}
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        const props = {
            //action: 'http://58.144.217.13:5002/api/common/upload-file',
            action:uploadUrl,
            onChange: this.handleUploadChange,
            multiple: true,
            data:{
                userId:cookie.load("userId"),
                userName:cookie.load("userName"),
                userType:cookie.load("userType"),
            },
            accept:".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,ppt,.pptx,.xls,.xlsx,.pdf,.zip,.rar"
        };
        const rowSelection = {
            selectedRowKeys,
            type:"radio",
            onChange: this.onSelectChange
        };
        const pagination = {
            current:formValues && formValues.page ? formValues.page : 1,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize:5,
            total:tableData.sum || 0,
            showTotal:(total, range) => `共 ${tableData.page_num} 页 总计 ${tableData.sum} 条政策`,
            pageSizeOptions: ['10', '20', '30', '50', '100', '150'],
            onShowSizeChange: this.onShowSizeChange,
            onChange:this.onPaginChange
        }
        console.log(id,data.declare && data.declare.set_up_sign);
        return (
            <div className="addProject-template">
                <Top />
                <div className="addProject-label-box max-weight-box">
                <Row>
                    <Col span={4}>
                        <PolicyManagementMenu menu="projectList" current="projectList" />
                    </Col>
                    <Col span={20}>
                    <Title name={id ? "编辑项目" : "添加项目"} />
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                        <Breadcrumb.Item href="/projectList">项目列表</Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? "编辑项目" : "添加项目"} </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="label-box">
                        <Form ref="form" {...layout} name="dynamic_rule" onSubmit={this.onFinish}
                        >
                            <Form.Item label="项目标题">
                                {getFieldDecorator('title', {
                                    rules: [{
                                        required: true,
                                        message: '请输入项目标题'
                                    }]
                                })(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item name="policy_id" label="关联政策"
                                       required
                                       validateStatus={!policyTitle && state ? "error" : ""}
                                       help={!policyTitle && state ? "请选择关联政策" : ""}>
                                {isSelectPolicy ? <span>{this.state.policyTitle}</span> : null}
                                <Button onClick={this.showPolicy}>选择政策</Button>
                            </Form.Item>
                            <Form.Item label="所属层级">
                                {getFieldDecorator('belong', {
                                    rules: [{
                                        required: true,
                                        message: '请选择所属层级'
                                    }]
                                })(
                                    <Select onChange={this.belongChange}>
                                        {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                            key={item.id}>{item.name}</Option>) : ''}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="发布机构">
                                {getFieldDecorator('organization_label_ids', {
                                    rules: [{
                                        required: true,
                                        message: '请选择发布机构'
                                    }]
                                })(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        onChange={this.handleChange}
                                    >
                                        {productData ? productData.map((item, idx) => <Option value={item.id}
                                                                                              key={item.id}>{item.name}</Option>) : ''}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="应用类型">
                                {getFieldDecorator('use_type', {
                                    rules: [{
                                        required: true,
                                        message: '请选择应用类型'
                                    }]
                                })(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        onChange={this.handleChange}
                                    >
                                        {typeData ? typeData.map((item, idx) => <Option value={item.id}
                                                                                        key={item.id}>{item.name}</Option>) : ''}

                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="所属行业">
                                {getFieldDecorator('d_industry_label_ids', {
                                    rules: [{
                                        required: true,
                                        message: '请选择所属行业'
                                    }]
                                })(
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        onChange={this.handleChange}
                                    >
                                        {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                key={item.id}>{item.name}</Option>) : ''}

                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="联系方式">
                                {getFieldDecorator('contact')(
                                    <Input />
                                )}
                            </Form.Item>
                            <Row>
                                <Col span={12} className="release_date">
                                    <Form.Item labelCol={{span: 6}} label="发布日期">
                                        {getFieldDecorator('release_date', {
                                            rules: [{
                                                required: true,
                                                message: '请选择发布日期'
                                            }]
                                        })(
                                            <DatePicker style={{width:"300px"}} onChange={this.onDatePickerChange} />
                                        )}
                                    </Form.Item>

                                </Col>
                                <Col span={12} className="declare_start_date">
                                    <Form.Item labelCol={{span: 6}} label="申报时间">
                                        {getFieldDecorator('declare_start_date')(
                                            <RangePicker style={{width:"300px"}} onChange={this.onDateChange} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} className="release_date">
                                    <Form.Item labelCol={{span: 6}} label="扶持金额">
                                        {getFieldDecorator('money')(
                                            <Input prefix="￥" suffix="万元" style={{width:"300px"}} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12} className="declare_start_date">
                                    <Form.Item labelCol={{span: 6}} label="官文网址">
                                        {getFieldDecorator('web_url', {
                                            rules: [{
                                                required: true,
                                                message: '请输入官文网址'
                                            }]
                                        })(
                                            <Input style={{width:"300px"}} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="content" label="扶持方向"
                                       required
                                       validateStatus={!support_direction && state ? "error" : ""}
                                       help={!support_direction && state ? "必填项" : ""}>
                                <div ref="editorElem1">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="申报条件" required
                                       validateStatus={!declare_condition && state ? "error" : ""}
                                       help={!declare_condition && state ? "必填项" : ""}
                            >
                                <div ref="editorElem2">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="扶持内容"
                                       required
                                       validateStatus={!support_content && state ? "error" : ""}
                                       help={!support_content && state ? "必填项" : ""}
                                       >
                                <div ref="editorElem3">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="申报材料"
                                       required
                                       validateStatus={!declare_material && state ? "error" : ""}
                                       help={!declare_material && state ? "必填项" : ""}
                                       >
                                <div ref="editorElem4">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="申报流程"
                                       required
                                       validateStatus={!declare_process && state ? "error" : ""}
                                       help={!declare_process && state ? "必填项" : ""}>
                                <div ref="editorElem5">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="评审流程">
                                <div ref="editorElem6">
                                </div>
                            </Form.Item>
                            <Form.Item name="username" label="上传附件">
                                <Upload {...props} fileList={this.state.fileList} defaultFileList={this.state.fileList}>
                                    <Button>
                                        {/*<UploadOutlined />*/}
                                        <Icon type="upload" />
                                        上传文件
                                    </Button>
                                </Upload>
                                <span>支持扩展名为.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf/.zip/.rar，大小不超过100M</span>
                            </Form.Item>
                            <p style={{fontWight:"bold",color:"#000",fontSize:"16px"}}><span style={{color: "#ff4d4f","padding-left":"25px"}}>*</span>申报方式（可多选）</p>
                            <Row className="declare-box">
                                <Col span={4} style={{paddingLeft:"13px"}}><Checkbox value="declare_net" checked={this.state.declare_net ? true : false} onChange={this.setCheckBox}>网上申报</Checkbox></Col>
                                <Col span={10}><Form.Item>
                                    {getFieldDecorator('declare_net')(
                                        <Input disabled={!declare_net}/>
                                    )}
                                </Form.Item></Col>
                            </Row>
                            <Row className="declare-box">
                                <Col span={4} style={{paddingLeft:"13px"}}>
                                    <Checkbox value="post_material" checked={this.state.post_material ? true : false} onChange={this.setCheckBox}>纸质材料提交至</Checkbox>
                                </Col>
                                <Col span={20}><Form.Item>
                                    {getFieldDecorator('post_material')(
                                        <TextArea disabled={!post_material} rows={4}/>
                                    )}
                                </Form.Item></Col>
                            </Row>
                            <Row>
                                <Col span={3} style={{paddingTop:"8px",paddingRight:"20px",textAlign:"right",color:"#000"}}>申报标签：</Col>
                                <Col span={21}>
                                <table style={{width:"100%"}} className="label-table">
                                    <thead>
                                    <tr>
                                        <th style={{width:"100px"}}>标签</th>
                                        <th>规则设置</th>
                                        <th style={{width:"100px"}}>操作</th>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                style={{ width: '90%' }}
                                                                disabled={!set_up}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                disabled={!knowledge}
                                                                style={{ width: '90%' }}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                disabled={!invention}
                                                                style={{ width: '90%' }}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                disabled={!declare}
                                                                style={{ width: '90%' }}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                disabled={!declare}
                                                                style={{ width: '90%' }}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                disabled={!declare}
                                                                style={{ width: '90%' }}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                disabled={!social}
                                                                style={{ width: '90%' }}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                                            initialValue:"-1,0"
                                                        })(
                                                            <Select
                                                                disabled={!social}
                                                                style={{ width: '90%' }}
                                                            >
                                                                <Option value="-1,0" key="≥">≥</Option>
                                                                <Option value="0" key="=">=</Option>
                                                                <Option value="0,1" key="≤">≤</Option>
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
                                </Col>
                            </Row>
                            <div className="addProject-button">
                                <Button type="primary" htmlType="submit" ref="finish">发布</Button>
                                <Button type="primary" className="ml15" ref="save" onClick={this.onSave}>存为草稿</Button>
                                <Button type="primary" className="ml15" onClick={this.onView}>预览</Button>
                                <Button className="ml15" onClick={()=>window.history.back()}>返回</Button>
                            </div>
                        </Form>
                    </div>
                    </Col>
                </Row>
                </div>
                <Modal
                    title="选择政策"
                    visible={this.state.policyVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width="800px"
                    className="select-porject-modal"
                >
                    <Search
                        onSearch={value => this.getTableData({title:value})}
                        style={{ width: 300 }}
                        enterButton
                    />
                    <Table rowSelection={rowSelection} columns={this.columns} dataSource={tableData ? tableData.result : []} pagination={pagination} rowKey="id"  />
                </Modal>
            </div>
        );
    };
}

export default Form.create()(AddProject);