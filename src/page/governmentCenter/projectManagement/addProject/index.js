/**
 *  添加项目
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Input, Row, Col, Button, Select, DatePicker, Breadcrumb,Form,Upload, message, Modal, Table, Tooltip, Checkbox, Switch,Tag} from 'antd';
import moment from 'moment';
// import { UploadOutlined,PlusOutlined} from '@ant-design/icons';
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
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};

const uploadUrl = 'http://web.js.policy.com/api/common/upload-file';

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

const { RangePicker } = DatePicker;

class AddProject extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:props.match.params ? props.match.params.id : null,
            policyVisible:false,
            tableData:[],
            addressNum:1
        }
    }

    componentDidMount(){
        this.createEditor("editorElem1","support_direction");//扶持方向
        this.createEditor("editorElem2","declare_condition");//申报条件
        this.createEditor("editorElem3","support_content");//扶持内容
        this.createEditor("editorElem4","declare_material");//申报材料
        this.createEditor("editorElem5","declare_process");//申报流程
        this.createEditor("editorElem6","review_process");//评审流程
        this.getDefalutData();
        this.getTableData();
        this.getProvinceData();//获取省
        this.columns = [
            {
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                width: 180,
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><a onClick={()=>this.props.history.push(`/policyPreview/${record.id}`)}>{text.length < 15 ? text : text.substr(0,15)+"..."}</a></Tooltip>
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
            },
            {
                title: '操作',
                key: 'action',
                width:120,
                render: (text, record) => (<p align="center"><a onClick={()=>this.props.history.push(`/addProject/${record.id}`)}>编辑</a><a onClick={()=>this.showModal(record.id)} className="ml15">删除</a></p>),
            },
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
    createEditor = (editorElem,editorContent) =>{
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
    }
    getDefalutData = async() =>{
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型
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
            belongData.data.unshift(allItem);
            industryData.data.unshift(allItem);
            this.setState({
                themeData: themData.data,
                typeData: typeData.data,
                belongData: belongData.data,
                industryData: industryData.data

            })
        }
        //编辑时，获取默认值
        if(this.state.id){
            const {data} = await request(`/policy/get/${this.state.id}`, 'GET'); //请求默认数据
            if(data){
                const {policy} = data;
                this.setState({
                    data,
                    release_date:policy.release_date,
                    content:policy.content
                });
                policy.release_date = moment(policy.release_date, 'YYYY-MM-DD');
                policy.life_date = moment(policy.life_date, 'YYYY-MM-DD');

                this.refs.form.setFieldsValue(policy);
                //editor.txt.html(policy.content);
                this.belongChange(policy.belong); //请求发布机构
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
        const {id,fileList=[],addressArr,selectedRowKeys,support_direction,declare_condition,support_content,declare_material,declare_process,review_process,declare_start_date,declare_end_date} = this.state;
        if(addressArr && addressArr.length) {
            let register_address = addressArr.map((aitem, aidx) => aitem.province + "," + aitem.city + "," + aitem.area);
            values.register_address = register_address.join("|"); //地址
        }
        if(selectedRowKeys && selectedRowKeys.length) {
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
        if(fileList && fileList.length) {
            values.upload_file_list = fileList.map((item, idx) => item.response.data.id); //附件
        }
        if(id){
            values.id = id;
        }
        const data = await request(this.state.id ? '/declare/update' : '/declare/add', 'POST',values);
        if(data.data && data.data.success){
            message.success(data.data.msg);
            setTimeout(()=>{
                this.props.history.push(url ? url+"/"+data.data.data.id : '/projectList');
            },2000);
        }else{
            message.error(data.data.msg);
        }
    }
    onFinish = async (values) => {
        console.log(values,this);
        values.status = 2;
        this.onSubmit(values);

    }
    onSave = async () => {
        let values = this.refs.form.getFieldsValue();
        // const {addressArr,selectedRowKeys,support_direction,declare_condition,support_content,declare_material,declare_process,review_process} = this.state;
        // console.log(values,selectedRowKeys,addressArr,support_direction,declare_condition,support_content,declare_material,declare_process,review_process);
        values.status = 1;
        this.onSubmit(values);

    }
    onView = () =>{
        let values = this.refs.form.getFieldsValue();
        values.status = 1;
        this.onSubmit(values,"/projectPreview");
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
        fileList = fileList.slice(-2);

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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys,selectedRows,selectedRows.title);
        this.setState({ selectedRowKeys,policyTitle:selectedRows[0].title });
    };
    //复选框选中取消
    setCheckBox = (e) =>{
        const {checked,value} = e.target;
        this.setState({
            [value]:checked
        });
        if(!checked){
            this.refs.form.setFieldsValue({
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
                this.refs.form.setFieldsValue({
                    ["develop_assets_value"]: undefined,
                    ["develop_assets_sign"]: undefined,
                    ["declare_value"]: undefined,
                    ["declare_sign"]: undefined,
                    ["develop_sign"]: undefined,
                    ["develop_value"]: undefined
                });
            }else if(string === "social"){
                this.refs.form.setFieldsValue({
                    ["develop_people_value"]: undefined,
                    ["develop_people_sign"]: undefined,
                    ["develop_people_value"]: undefined,
                    ["develop_people_sign"]: undefined,
                });
            }else {
                this.refs.form.setFieldsValue({
                    [string+"_value"]: undefined,
                    [string+"_sign"]: undefined
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
        const {provinceSelect,addressNum} = this.state;
        let html=[];
        for(let i = 0; i<addressNum;i++){
            html.push(<Row clasName="mt10">
                {provinceSelect ? <Col span={6}>
                    <Form.Item>
                        <Select
                            style={{ width: '100%',marginRight:"20px"}}
                            onChange={(value, option)=>this.onProvinceChange(value, option,i)}
                        >
                            {provinceSelect.map((item,idx)=><Option value={item.id} key={idx}>{item.value}</Option>)}
                        </Select>
                    </Form.Item>
                    <span className="address-title">省</span>
                </Col> : null}
                {this.state["citySelect"+i] ? <Col span={6}>
                    <Form.Item>
                        <Select
                            style={{ width: '100%',marginRight:"20px"}}
                            onChange={(value, option)=>this.onCityChange(value, option,i)}
                        >
                            {this.state["citySelect"+i].map((item,idx)=><Option value={item.id} key={idx}>{item.value}</Option>)}
                        </Select>
                    </Form.Item>
                    <span className="address-title">市</span>
                </Col> : null}
                {this.state["areaSelect"+i] ? <Col span={6}>
                    <Form.Item>
                        <Select
                            style={{ width: '100%'}}
                            onChange={(value, option)=>this.onAreaChange(value, option,i)}
                        >
                            {this.state["areaSelect"+i].map((item,idx)=><Option value={item.id} key={idx}>{item.value}</Option>)}
                        </Select>
                    </Form.Item>
                    <span className="address-title">区县</span>
                </Col> : null}
                {i==0 ? <Col span={4}>
                    <Tag className="site-tag-plus" onClick={this.addAddress}>
                        {/*<PlusOutlined />*/}
                        可多选
                    </Tag>
                </Col> : null}
            </Row>)
        }
        return (html);
    }
    render() {
        const {industryData,belongData,typeData,productData,id,tableData,selectedRowKeys,formValues,post_material,declare_net,set_up=true,knowledge=true,invention=true,declare=true,industry_label=true,social=true,isSelectPolicy} = this.state;
        const props = {
            //action: 'http://web.js.policy.com/api/common/upload-file',
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
                        <Form.Provider>
                        <Form ref="form" {...layout} name="dynamic_rule" onFinish={this.onFinish} validateMessages={validateMessages}>
                            <Form.Item name="title" label="项目标题" rules={[{required: true}]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="policy_id" label="关联政策" rules={[{required: true}]}>
                                {isSelectPolicy ? <span>{this.state.policyTitle}</span> : null}
                                <Button onClick={this.showPolicy}>选择政策</Button>
                            </Form.Item>
                            <Form.Item name="belong" label="所属层级" rules={[{required: true}]}>
                                <Select onChange={this.belongChange}>
                                    {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                        key={item.id}>{item.name}</Option>) : ''}
                                </Select>
                            </Form.Item>
                            <Form.Item name="organization_label_ids" label="发布机构" rules={[{required: true}]}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {productData ? productData.map((item, idx) => <Option value={item.id}
                                                                                          key={item.id}>{item.name}</Option>) : ''}
                                </Select>
                            </Form.Item>
                            <Form.Item name="web_url" label="官文网址" rules={[{required: true}]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="declare_start_date" label="申报时间">
                                <RangePicker onChange={this.onDateChange} />
                            </Form.Item>
                            <Form.Item name="use_type" label="应用类型" rules={[{required: true}]}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {typeData ? typeData.map((item, idx) => <Option value={item.id}
                                                                                    key={item.id}>{item.name}</Option>) : ''}

                                </Select>
                            </Form.Item>
                            <Form.Item name="industry_label_ids" label="所属行业" rules={[{required: true}]}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                            key={item.id}>{item.name}</Option>) : ''}

                                </Select>
                            </Form.Item>
                            <Form.Item name="content" label="扶持方向" required>
                                <div ref="editorElem1">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="申报条件" required>
                                <div ref="editorElem2">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="扶持内容" required>
                                <div ref="editorElem3">
                                </div>
                            </Form.Item>
                            <Form.Item name="contact" label="联系方式">
                                <Input />
                            </Form.Item>
                            <Form.Item name="content" label="申报材料" required>
                                <div ref="editorElem4">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="申报流程" required>
                                <div ref="editorElem5">
                                </div>
                            </Form.Item>
                            <Form.Item name="content" label="评审流程">
                                <div ref="editorElem6">
                                </div>
                            </Form.Item>
                            <Form.Item name="username" label="上传附件">
                                <Upload {...props} fileList={this.state.fileList}>
                                    <Button>
                                        {/*<UploadOutlined /> */}
                                        上传文件
                                    </Button>
                                </Upload>
                                <span>支持扩展名为.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf/.zip/.rar，大小不超过100M</span>
                            </Form.Item>
                            <p style={{fontWight:"bold",color:"#000",fontSize:"16px"}}><span style={{color: "#ff4d4f"}}>*</span>请选择申报方式（可多选）</p>
                            <Row>
                                <Col span={4}><Checkbox value="declare_net" onChange={this.setCheckBox}>网上申报</Checkbox></Col>
                                <Col span={10}><Form.Item name="declare_net">
                                    <Input disabled={!declare_net}/>
                                </Form.Item></Col>
                            </Row>
                            <Row>
                                <Col span={4}><Checkbox value="post_material" onChange={this.setCheckBox}>纸质材料提交至</Checkbox></Col>
                                <Col span={20}><Form.Item name="post_material">
                                    <TextArea disabled={!post_material} rows={4}/>
                                </Form.Item></Col>
                            </Row>
                            <Row>
                                <Col span={4}>申报条件标签：</Col>
                                <Col span={20}>
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
                                                    <Form.Item name="set_up_sign">
                                                    <Select
                                                        style={{ width: '90%' }}
                                                        disabled={!set_up}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={19}>
                                                    <Form.Item name="set_up_value">
                                                        <Input disabled={!set_up}/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td><Switch defaultChecked onChange={(checked)=>this.switchChange(checked,"set_up")}/></td>
                                    </tr>
                                    <tr>
                                        <td>注册地址</td>
                                        <td>
                                              {this.addressDom()}
                                        </td>
                                        <td><Switch defaultChecked onChange={(checked)=>this.switchChange(checked,"set_up")}/></td>
                                    </tr>
                                    <tr>
                                        <td>知识产权</td>
                                        <td>
                                            <Row>
                                                <Col span={4}>
                                                    <Form.Item name="knowledge_sign">
                                                    <Select
                                                        disabled={!knowledge}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={19}>
                                                    <Form.Item name="knowledge_value">
                                                    <Input disabled={!knowledge} suffix="个"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td><Switch defaultChecked onChange={(checked)=>this.switchChange(checked,"knowledge")}/></td>
                                    </tr>
                                    <tr>
                                        <td>发明专利</td>
                                        <td>
                                            <Row>
                                                <Col span={4}>
                                                    <Form.Item name="invention_sign">
                                                    <Select
                                                        disabled={!invention}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={19}>
                                                    <Form.Item name="invention_value">
                                                    <Input  disabled={!invention} suffix="个"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td><Switch defaultChecked onChange={(checked)=>this.switchChange(checked,"invention")}/></td>
                                    </tr>
                                    <tr>
                                        <td>所属行业</td>
                                        <td>
                                            <Form.Item name="industry_label_ids">
                                            <Select
                                                disabled={!industry_label}
                                                mode="multiple"
                                                style={{ width: '100%' }}
                                                onChange={this.handleChange}
                                            >
                                                {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                        key={item.id}>{item.name}</Option>) : ''}

                                            </Select>
                                            </Form.Item>
                                        </td>
                                        <td><Switch defaultChecked onChange={(checked)=>this.switchChange(checked,"industry_label")}/></td>
                                    </tr>
                                    <tr>
                                        <td>财务数据</td>
                                        <td>
                                            <Row>
                                                <Col span={7}>研发投入</Col>
                                                <Col span={4}>
                                                    <Form.Item name="develop_sign">
                                                    <Select
                                                        disabled={!declare}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10}>
                                                    <Form.Item name="develop_value">
                                                    <Input disabled={!declare} suffix="万元"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row className="mt10">
                                                <Col span={7}>企业报税收入</Col>
                                                <Col span={4}>
                                                    <Form.Item name="declare_sign">
                                                    <Select
                                                        disabled={!declare}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10}>
                                                    <Form.Item name="declare_value">
                                                    <Input disabled={!declare} suffix="万元"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row className="mt10">
                                                <Col span={7}>研发资产总额</Col>
                                                <Col span={4}>
                                                    <Form.Item name="develop_assets_sign">
                                                    <Select
                                                        disabled={!declare}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10}>
                                                    <Form.Item name="develop_assets_value">
                                                    <Input disabled={!declare} suffix="万元"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td><Switch defaultChecked onChange={(checked)=>this.switchChange(checked,"declare")}/></td>
                                    </tr>
                                    <tr>
                                        <td>人员数量</td>
                                        <td>
                                            <Row className="mt10">
                                                <Col span={7}>最近一年缴纳社保人数</Col>
                                                <Col span={4}>
                                                    <Form.Item name="social_people_sign">
                                                    <Select
                                                        disabled={!social}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10}>
                                                    <Form.Item name="social_people_value">
                                                    <Input disabled={!social} suffix="人"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row className="mt10">
                                                <Col span={7}>研发人员</Col>
                                                <Col span={4}>
                                                    <Form.Item name="develop_people_sign">
                                                    <Select
                                                        disabled={!social}
                                                        style={{ width: '90%' }}
                                                    >
                                                        <Option value="-1,0" key="≥">≥</Option>
                                                        <Option value="0" key="=">=</Option>
                                                        <Option value="0,1" key="≤">≤</Option>
                                                    </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10}>
                                                    <Form.Item name="develop_people_value">
                                                    <Input disabled={!social} suffix="人"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td><Switch defaultChecked onChange={(checked)=>this.switchChange(checked,"social")}/></td>
                                    </tr>
                                    </tbody>
                                </table>
                                </Col>
                            </Row>
                            <div className="addProject-button">
                                <Button type="primary" htmlType="submit" ref="finish">发布</Button>
                                <Button type="primary" className="ml15" ref="save" onClick={()=>this.onSave()}>存为草稿</Button>
                                <Button type="primary" className="ml15" onClick={()=>this.onView()}>预览</Button>
                                <Button className="ml15" onClick={()=>window.history.back()}>返回</Button>
                            </div>
                        </Form>
                        </Form.Provider>
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
                        onSearch={value => console.log(value)}
                        style={{ width: 300 }}
                        enterButton
                    />
                    <Table rowSelection={rowSelection} columns={this.columns} dataSource={tableData ? tableData.result : []} pagination={pagination} rowKey="id"  />
                </Modal>
            </div>
        );
    };
}

export default AddProject;