/**
 *  添加政策
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Input, Row, Col, Button, Select, DatePicker, Breadcrumb, Form, Upload, message, Icon} from 'antd';
import moment from 'moment';
import {request} from '../../../../utils/request';
import Top from '../../../../component/top/index';
import cookie from 'react-cookies';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';

import E from 'wangeditor'


const {Option} = Select;

const layout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
};

const uploadUrl = 'http://58.144.217.13:5001/api/common/upload-file';

class AddPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params ? props.match.params.id : null
        }
    }

    componentDidMount() {

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
                console.log(xhr, editor, files, "before")
            },
            success: function (xhr, editor, result) {
                console.log("上传成功");
                console.log(xhr, editor, result, "success")
            },
            fail: function (xhr, editor, result) {
                console.log("上传失败,原因是" + result);
                console.log(xhr, editor, result, "fail")
            },
            error: function (xhr, editor) {
                console.log("上传出错");
                console.log(xhr, editor, "error")
            },
            timeout: function (xhr, editor) {
                console.log("上传超时");
                console.log(xhr, editor, "timeout")
            },
            customInsert: function (insertImg, result, editor) {
                console.log(insertImg, result, editor, "file")
                if (result.success) {
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

    getDefalutData = async (editor) => {
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型
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
                themeData: themData.data,
                typeData: typeData.data,
                belongData: belongData.data,
                industryData: industryData.data

            })
        }
        //编辑时，获取默认值
        if (this.state.id) {
            const {data} = await request(`/policy/get/${this.state.id}`, 'GET'); //请求默认数据
            if (data) {
                const {policy} = data;
                this.setState({
                    data,
                    release_date: policy.release_date,
                    content: policy.content
                });
                if (policy.release_date) {
                    policy.release_date = moment(policy.release_date, 'YYYY-MM-DD');
                }
                if (policy.life_date) {
                    policy.life_date = moment(policy.life_date, 'YYYY-MM-DD');
                }
                if(policy.content){
                    this.setState({
                        editorContent:policy.content
                    })
                }

                this.props.form.setFieldsValue(policy);
                editor.txt.html(policy.content);
                this.belongChange(policy.belong); //请求发布机构
            }
        }
    }
    onSubmit = async (values, url) => {
        const {release_date, life_date, editorContent, id, fileList = []} = this.state;
        if (editorContent) {
            values.release_date = release_date;
            values.life_date = life_date;
            values.content = editorContent;
            values.member_id = cookie.load("userId");
            values.username = cookie.load("userName");
            if (fileList.length) {
                values.upload_file_list = fileList.map((item, idx) => item.response.data.id);
            }
            if (id) {
                values.id = id;
            }
            const data = await request(this.state.id ? '/policy/update' : '/policy/add', 'POST', values);
            if (data.data && data.data.success) {
                message.success(data.data.msg);
                setTimeout(() => {
                    this.props.history.push(url ? url + "/" + data.data.data.id : '/policyList');
                }, 2000);
            } else {
                message.error(data.data.msg);
            }
        }else{
            message.error("政策正文不能为空！");
        }
    }
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.setState({
            state:true
        });
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
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
    onView = (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if(!err) {
                values.status = 1;
                this.onSubmit(values, "/policyPreview");
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
    onDateChange = (date, dateString) => {
        this.setState({
            release_date: dateString
        })
    }
    onDateLifeChange = (date, dateString) => {
        this.setState({
            life_date: dateString
        })
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    handleUploadChange = info => {
        console.log(info, "info")
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

        this.setState({fileList});
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {industryData, belongData, themeData, typeData, productData, id, data, editorContent,state} = this.state;
        const props = {
            //action: 'http://58.144.217.13:5002/api/common/upload-file',
            action: uploadUrl,
            onChange: this.handleUploadChange,
            multiple: true,
            data: {
                userId: cookie.load("userId"),
                userName: cookie.load("userName"),
                userType: cookie.load("userType"),
            },
            accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,ppt,.pptx,.xls,.xlsx,.pdf,.zip,.rar"
        };
        return (
            <div className="addPolicy-template">
                <Top/>
                <div className="addPolicy-label-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <PolicyManagementMenu/>
                        </Col>
                        <Col span={20}>
                            <Title name={id ? "编辑政策" : "添加政策"}/>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>政策管理</Breadcrumb.Item>
                                <Breadcrumb.Item href="/policyList">政策列表</Breadcrumb.Item>
                                <Breadcrumb.Item>{id ? "编辑政策" : "添加政策"} </Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="label-box">
                                <Form ref="form" {...layout} name="dynamic_rule" onSubmit={this.onFinish}>
                                    <Form.Item label="政策标题">
                                        {getFieldDecorator('title', {
                                            rules: [{
                                                required: true,
                                                message: '请输入政策标题'
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="发文字号">
                                        {getFieldDecorator('post_shop_name')(
                                            <Input/>
                                        )}
                                    </Form.Item>
                                    <Row>
                                        <Col span={12} className="release_date">
                                            <Form.Item labelCol={{span: 6}} label="发文日期">
                                                {getFieldDecorator('release_date', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择发文日期'
                                                    },{
                                                        validator: (rule, value, callback) => {

                                                            const { form } = this.props;
                                                            if(form.getFieldValue('declare_start_date')) {
                                                                const rData = new Date(form.getFieldValue('declare_start_date'));
                                                                const dData = new Date(value);

                                                                if (rData.getTime() < dData.getTime()) {
                                                                    callback('发文日期必须小于政策有效期!');
                                                                } else {
                                                                    callback();
                                                                }
                                                            }else{
                                                                callback();
                                                            }
                                                        }
                                                    }]
                                                })(
                                                    <DatePicker onChange={this.onDateChange}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}></Col>
                                        <Col span={8} className="declare_start_date">
                                            <Form.Item labelCol={{span: 11}} label="政策有效期">
                                                {getFieldDecorator('life_date', {
                                                    rules: [{
                                                        required: true,
                                                        message: '请选择政策有效期'
                                                    },{
                                                        validator: (rule, value, callback) => {

                                                            const { form } = this.props;
                                                            if(form.getFieldValue('release_date')) {
                                                                const rData = new Date(form.getFieldValue('release_date'));
                                                                const dData = new Date(value);

                                                                if (rData.getTime() > dData.getTime()) {
                                                                    callback('政策有效期必须大于发文日期!');
                                                                } else {
                                                                    callback();
                                                                }
                                                            }else{
                                                                callback();
                                                            }
                                                        }
                                                    }]
                                                })(
                                                    <DatePicker onChange={this.onDateLifeChange}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item label="所属行业">
                                        {getFieldDecorator('industry_label_id_list', {
                                            rules: [{
                                                required: true,
                                                message: '请选择所属行业'
                                            }]
                                        })(
                                            <Select
                                                mode="multiple"
                                                style={{width: '100%'}}
                                                onChange={this.handleChange}
                                            >
                                                {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                        key={item.id}>{item.name}</Option>) : ''}

                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="政策主题">
                                        {getFieldDecorator('policy_theme_label_list', {
                                            rules: [{
                                                required: true,
                                                message: '请选择政策主题'
                                            }]
                                        })(
                                            <Select
                                                mode="multiple"
                                                style={{width: '100%'}}
                                                onChange={this.handleChange}
                                            >
                                                {themeData ? themeData.map((item, idx) => <Option value={item.id}
                                                                                                  key={item.id}>{item.name}</Option>) : ''}

                                            </Select>
                                        )}

                                    </Form.Item>
                                    <Form.Item label="应用类型">
                                        {getFieldDecorator('use_type_list', {
                                            rules: [{
                                                required: true,
                                                message: '请选择应用类型'
                                            }]
                                        })(
                                            <Select
                                                mode="multiple"
                                                style={{width: '100%'}}
                                                onChange={this.handleChange}
                                            >
                                                {typeData ? typeData.map((item, idx) => <Option value={item.id}
                                                                                                key={item.id}>{item.name}</Option>) : ''}

                                            </Select>
                                        )}
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
                                        {getFieldDecorator('organization_label_list', {
                                            rules: [{
                                                required: true,
                                                message: '请选择发布机构'
                                            }]
                                        })(
                                            <Select
                                                mode="multiple"
                                                style={{width: '100%'}}
                                                onChange={this.handleChange}
                                            >
                                                {productData ? productData.map((item, idx) => <Option value={item.id}
                                                                                                      key={item.id}>{item.name}</Option>) : ''}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item name="content" label="政策正文" required
                                               validateStatus={!editorContent && state ? "error" : ""}
                                               help={!editorContent && state ? "必填项" : ""}>
                                        <div ref="editorElem">
                                        </div>
                                    </Form.Item>
                                    <Form.Item name="username" label="上传附件">
                                        <Upload {...props} fileList={this.state.fileList}>
                                            <Button>
                                                {/*<UploadOutlined />*/}
                                                <Icon type="upload"/>
                                                上传文件
                                            </Button>
                                        </Upload>
                                        <span>支持扩展名为.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf/.zip/.rar，大小不超过100M</span>
                                    </Form.Item>
                                    <div className="addPolicy-button">
                                        <Button type="primary" htmlType="submit" ref="finish">发布</Button>
                                        <Button type="primary" className="ml15" ref="save"
                                                onClick={this.onSave}>保存</Button>
                                        <Button type="primary" className="ml15"
                                                onClick={this.onView}>预览</Button>
                                        <Button className="ml15" onClick={() => window.history.back()}>返回</Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    };
}

export default Form.create()(AddPolicy);