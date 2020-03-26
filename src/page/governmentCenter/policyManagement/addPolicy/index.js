/**
 *  添加政策
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Input, Row, Col, Button, Select, DatePicker, Breadcrumb,Form,Upload, message} from 'antd';
import moment from 'moment';
// import { UploadOutlined } from '@ant-design/icons';
import {request} from '../../../../utils/request';
import Top from '../../../../component/top/index';
import cookie from 'react-cookies';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';

import E from 'wangeditor'



const { Option } = Select;

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



class AddPolicy extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:props.match.params ? props.match.params.id : null
        }
    }

    componentDidMount(){


        console.log(this.state.data);

        const elem = this.refs.editorElem; //获取editorElem盒子
        //const submit = this.refs.submit; //获取提交按钮
        const editor = new E(elem)  //new 一个 editorElem富文本
        editor.customConfig.uploadFileName = 'file'; //置上传接口的文本流字段
        editor.customConfig.uploadImgServer = uploadUrl;//服务器接口地址
        editor.customConfig.onchange = html => {
            this.setState({
                editorContent: html
            })
        };
        editor.customConfig.uploadImgHooks = {
            before: function (xhr, editor, files) {
                console.log(xhr, editor, files,"before")
            },
            success: function (xhr, editor, result) {
                console.log("上传成功");
                console.log(xhr, editor, result,"success")
            },
            fail: function (xhr, editor, result) {
                console.log("上传失败,原因是" + result);
                console.log(xhr, editor, result,"fail")
            },
            error: function (xhr, editor) {
                console.log("上传出错");
                console.log(xhr, editor,"error")
            },
            timeout: function (xhr, editor) {
                console.log("上传超时");
                console.log(xhr, editor,"timeout")
            },
            customInsert: function (insertImg, result, editor) {
                console.log(insertImg, result, editor, "file")
                if(result.success) {
                    var url = result.data.image_url  //监听图片上传成功更新页面
                    insertImg(url)
                }
            }
        };
        editor.create() //创建
        this.getDefalutData(editor);

        // editor.customConfig.uploadImgHooks = {
        //
        // }
        // submit.addEventListener('click', function () {  //监听点击提交按钮
        //     // 读取 html
        //     this.setState({
        //         content: editor.txt.html()  //获取富文本内容
        //     })
        // }, false)
        // this.refs.save.addEventListener('click', function () {  //监听点击提交按钮
        //     // 读取 html
        //     this.setState({
        //         content: editor.txt.html()  //获取富文本内容
        //     })
        // }, false)

    }
    getDefalutData = async(editor) =>{
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
                editor.txt.html(policy.content);
                this.belongChange(policy.belong); //请求发布机构
            }
        }
    }
    onSubmit = async(values,url) => {
        const {release_date,life_date,editorContent,id,fileList=[]} = this.state;
        values.release_date = release_date;
        values.life_date = life_date;
        values.content = editorContent;
        values.member_id = cookie.load("userId");
        values.username = cookie.load("userName");
        values.upload_file_list = fileList.map((item,idx)=>item.response.data.id);
        if(id){
            values.id = id;
        }
        const data = await request(this.state.id ? '/policy/update' : '/policy/add', 'POST',values);
        if(data.data && data.data.success){
            message.success(data.data.msg);
            setTimeout(()=>{
                this.props.history.push(url ? url+"/"+data.data.data.id : '/policyList');
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
        values.status = 1;
        this.onSubmit(values);

    }
    onView = () =>{
        let values = this.refs.form.getFieldsValue();
        values.status = 1;
        this.onSubmit(values,"/policyPreview");
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
        this.setState({
            release_date:dateString
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
        // fileList = fileList.slice(-2);

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
    render() {
        const {industryData,belongData,themeData,typeData,productData,id,data} = this.state;
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

        console.log(data && data.policy.release_date);

        return (
            <div className="addPolicy-template">
                <Top />
                <div className="addPolicy-label-box max-weight-box">
                <Row>
                    <Col span={4}>
                        <PolicyManagementMenu />
                    </Col>
                    <Col span={20}>
                    <Title name={id ? "编辑政策" : "添加政策"} />
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>政策管理</Breadcrumb.Item>
                        <Breadcrumb.Item href="/policyList">政策列表</Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? "编辑政策" : "添加政策"} </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="label-box">
                        <Form.Provider>
                        <Form ref="form" {...layout} name="dynamic_rule" onFinish={this.onFinish} validateMessages={validateMessages}>
                            <Form.Item name="title" label="政策标题" rules={[{required: true}]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="post_shop_name" label="发文字号" rules={[{required: true}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name="release_date" label="发文日期" rules={[{required: true}]}>
                                <DatePicker onChange={this.onDateChange} />
                            </Form.Item>
                            <Form.Item name="life_date" label="政策有效期" rules={[{required: true}]}>
                                <DatePicker onChange={this.onDateLifeChange} />
                            </Form.Item>
                            <Form.Item name="industry_label_id_list" label="所属行业" rules={[{required: true}]}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                        key={item.id}>{item.name}</Option>) : ''}

                                </Select>
                            </Form.Item>
                            <Form.Item name="policy_theme_label_list" label="政策主题" rules={[{required: true}]}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {themeData ? themeData.map((item, idx) => <Option value={item.id}
                                                                                            key={item.id}>{item.name}</Option>) : ''}

                                </Select>
                            </Form.Item>
                            <Form.Item name="use_type_list" label="应用类型" rules={[{required: true}]}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {typeData ? typeData.map((item, idx) => <Option value={item.id}
                                                                                      key={item.id}>{item.name}</Option>) : ''}

                                </Select>
                            </Form.Item>
                            <Form.Item name="belong" label="所属层级" rules={[{required: true}]}>
                                <Select onChange={this.belongChange}>
                                    {belongData ? belongData.map((item, idx) => <Option value={item.id}
                                                                                            key={item.id}>{item.name}</Option>) : ''}
                                </Select>
                            </Form.Item>
                            <Form.Item name="organization_label_list" label="发布机构" rules={[{required: true}]}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {productData ? productData.map((item, idx) => <Option value={item.id}
                                                                                        key={item.id}>{item.name}</Option>) : ''}
                                </Select>
                            </Form.Item>
                            <Form.Item name="content" label="政策正文" required>
                                <div ref="editorElem">
                                </div>
                            </Form.Item>
                            <Form.Item name="username" label="上传附件" required>
                                <Upload {...props} fileList={this.state.fileList}>
                                    <Button>
                                        {/*<UploadOutlined /> */}
                                        上传文件
                                    </Button>
                                </Upload>
                                <span>支持扩展名为.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf/.zip/.rar，大小不超过100M</span>
                            </Form.Item>
                            <div className="addPolicy-button">
                                <Button type="primary" htmlType="submit" ref="finish">发布</Button>
                                <Button type="primary" className="ml15" ref="save" onClick={()=>this.onSave()}>保存</Button>
                                <Button type="primary" className="ml15" onClick={()=>this.onView()}>预览</Button>
                                <Button className="ml15" onClick={()=>window.history.back()}>返回</Button>
                            </div>
                        </Form>
                        </Form.Provider>
                    </div>
                    </Col>
                </Row>
                </div>
                {/*<Footer/>*/}
            </div>
        );
    };
}

export default AddPolicy;