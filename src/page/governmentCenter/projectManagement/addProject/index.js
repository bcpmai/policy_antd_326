/**
 *  添加项目
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {
    Input,
    Row,
    Col,
    Button,
    Select,
    DatePicker,
    Breadcrumb,
    Form,
    Upload,
    Icon,
    message,
    Modal,
    Table,
    Tooltip,
    Checkbox,
    Switch,
    Tag,
    InputNumber
} from 'antd';
import moment from 'moment';
import {request} from '../../../../utils/request';
import Top from '../../../../component/top/index';
import cookie from 'react-cookies';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import AddContent from './addContent';
import './index.css';

import E from 'wangeditor'


const {Option} = Select;
const {Search, TextArea} = Input;
const layout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
};


const uploadUrl = window.location.href.indexOf("http://jlpzc.cicba.cn") != -1 ? 'http://jlpzc.cicba.cn/api/common/upload-file' : 'https://jlpzc.cicba.cn/api/common/upload-file';

const {RangePicker} = DatePicker;

class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params ? props.match.params.id : null,
            policyVisible: false,
            tableData: [],
            addContentNum: 1,
            contentArr: [],
            set_up: true,
            knowledge: true,
            invention: true,
            industry_label: true,
            declare: true,
            social: true
        }
    }

    componentDidMount() {
        if (!this.state.id) {
            //this.createEditor("editorElem1", "support_direction");//扶持方向
            //this.createEditor("editorElem2", "declare_condition");//申报条件
            // this.createEditor("editorElem3", "support_content");//扶持内容
            this.createEditor("content0", "content0");//扶持内容
            this.createEditor("editorElem4", "declare_material");//申报材料
            this.createEditor("editorElem5", "declare_process");//申报流程
            this.createEditor("editorElem6", "review_process");//评审流程
        }
        this.getDefalutData();
        this.getTableData();
        this.columns = [
            {
                title: '政策标题',
                dataIndex: 'title',
                key: 'title',
                width: 280,
                render: (text, record) => {
                    return <Tooltip placement="topLeft" title={text}><a href={`/policyText/${record.id}`} target="_blank">{text.length < 15 ? text : text.substr(0, 15) + "..."}</a></Tooltip>

                    // return <Tooltip placement="topLeft" title={text}><a
                    //     onClick={() => this.onSelectChange(record.id, record.title, true)}>{text.length < 15 ? text : text.substr(0, 15) + "..."}</a></Tooltip>
                }
            },
            {
                title: '发布机构',
                dataIndex: 'organization_label_str',
                key: 'organization_label_str',
                render: (text, record) => {
                    return <Tooltip placement="topLeft"
                                    title={text}><span>{text.length < 10 ? text : text.substr(0, 10) + "..."}</span></Tooltip>
                }
            },
            {
                title: '发文日期',
                key: 'release_date',
                dataIndex: 'release_date',
                width: 200
            }
        ];

    }

    getTableData = async (values = {}) => {
        if (!values.max_line) {
            values.max_line = 5;
        }
        const tableData = await request('/policy/list', 'POST', values); //获取table
        if (tableData.status == 200) {
            this.setState({
                tableData: tableData.data,
                formValues: values
            });
        }
    }
    onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
        let {formValues = {}} = this.state;
        formValues.page = current;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }
    onPaginChange = (page, pageSize) => {
        console.log(page, pageSize);
        let {formValues = {}} = this.state;
        formValues.page = page;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }
    createEditor = (editorElem, editorContent, value) => {
        console.log(this.refs,editorElem, editorContent, value)
        const elem = this.refs[editorElem]; //获取editorElem盒子
        //const submit = this.refs.submit; //获取提交按钮
        const editor = new E(elem)  //new 一个 editorElem富文本
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'image',  // 插入图片
            'table',  // 表格
            'undo',  // 撤销
            'redo'  // 重复
        ]
        editor.customConfig.uploadFileName = 'file'; //置上传接口的文本流字段
        editor.customConfig.uploadImgServer = uploadUrl;//服务器接口地址
        editor.customConfig.onchange = html => {
            console.log(editorContent,html)
            this.setState({
                [editorContent]: html
            })
        };
        editor.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                console.log(insertImg, result, editor, "file")
                if (result.success) {
                    var url = result.data.image_url  //监听图片上传成功更新页面
                    insertImg(url)
                }
            }
        };
        editor.create() //创建

        if (value) {
            editor.txt.html(value);
        }
        window[editorElem] = editor;
    }
    getDefalutData = async () => {
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
        if (this.state.id) {
            const {data} = await request(`/declare/get-one/${this.state.id}`, 'GET'); //请求默认数据
            console.log(data, "dddd")
            if (data) {
                const {declare, resource_file_list = []} = data;
                let fileList = [];
                resource_file_list.length >= 1 && resource_file_list.forEach((item, idx) => {
                    item.name = item.file_ori_name;
                    item.uid = item.id;
                    item.url = item.image_url;
                    fileList.push(item);
                })
                this.setState({
                    data,
                    // addressList,
                    fileList,
                    release_date: declare.release_date,
                    content: declare.content,
                    policyTitle: declare.pc_title,
                    selectedRowKeys: [declare.policy_id],
                    isSelectPolicy: true,
                    declare_net: declare.declare_net,
                    post_material: declare.post_material,
                    // addressNum: addressList.length <= 0 ? 1 : addressList.length,
                    declare_start_date: declare.declare_start_date,
                    declare_end_date: declare.declare_end_date,
                    support_direction: declare.support_direction,
                    declare_condition: declare.declare_condition,
                    // support_content: declare.support_content,
                    declare_material: declare.declare_material,
                    declare_process: declare.declare_process,
                    review_process: declare.review_process,
                    addContentNum: declare.declare_matching_details_list.length <= 0 ? 1 : declare.declare_matching_details_list.length,
                    contentArr: declare.declare_matching_details_list
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
                if (declare.industry_label_ids && declare.industry_label_ids != '') {
                    industry_label_ids = []
                    declare.industry_label_ids.split(",").forEach((item) => {
                        industry_label_ids.push(parseInt(item));
                    })
                }
                declare.d_industry_label_ids = d_industry_label_ids;
                declare.industry_label_ids = industry_label_ids;
                declare.content = [];
                declare.declare_matching_details_list.forEach((item, idx) => {
                    declare.content[idx] = item.content;
                    this.createEditor("content"+idx, "content"+idx,item.content);//扶持内容
                    this.setState({
                        ["content"+idx]:item.content
                    })
                })

                this.props.form.setFieldsValue(declare);

                // if(declare.set_up_sign == "-1,0,1"){
                //     this.switchChange(false,"set_up");
                // }
                // if(declare.knowledge_sign== "-1,0,1"){
                //     this.switchChange(false,"knowledge");
                // }
                // if(declare.register_address== ""){
                //     this.switchChange(false,"address");
                // }
                // if(declare.invention_sign== "-1,0,1"){
                //     this.switchChange(false,"invention");
                // }
                // if(declare.industry_label_list.length <=0){
                //     this.switchChange(false,"industry_label");
                // }
                // if(declare.declare_sign== "-1,0,1"){
                //     this.switchChange(false,"declare");
                // }
                // if(declare.social_people_sign == "-1,0,1"){
                //     this.switchChange(false,"social");
                // }

                //editor.txt.html(policy.content);
                this.belongChange(declare.belong); //请求发布机构

                //this.createEditor("editorElem1", "support_direction", declare.support_direction);//扶持方向
                //this.createEditor("editorElem2", "declare_condition", declare.declare_condition);//申报条件
                // this.createEditor("editorElem3", "support_content",declare.support_content);//扶持内容
                this.createEditor("editorElem4", "declare_material", declare.declare_material);//申报材料
                this.createEditor("editorElem5", "declare_process", declare.declare_process);//申报流程
                this.createEditor("editorElem6", "review_process", declare.review_process);//评审流程
            }
        }
    }


    onSubmit = async (values, url) => {
        const {addContentNum, contentArr, policyTitle, id, fileList = [], addressArr, selectedRowKeys, support_direction, declare_condition, support_content, declare_material, declare_process, review_process, declare_start_date, declare_end_date, release_date} = this.state;
        if (policyTitle && declare_material && declare_process) {

            // if (addressArr && addressArr.length) {
            //     let register_address = addressArr.map((aitem, aidx) => {
            //         return (aitem.province ? aitem.province : '') + "," + (aitem.city ? aitem.city : '') + "," + (aitem.area ? aitem.area : '')
            //     });
            //     values.register_address = register_address.join("|"); //地址
            // }
            //扶持内容 new
            values.declare_matching_details_list = [];
            for (let i = 0; i < addContentNum; i++) {
                const content = this.state["content"+i] || (values.content && values.content[i])
                let tcontentArr = contentArr[i];
                if(tcontentArr && tcontentArr.industry_label_ids && typeof tcontentArr.industry_label_ids == "string" && tcontentArr.industry_label_list){
                    tcontentArr.industry_label_ids = tcontentArr.industry_label_list;
                }
                values.declare_matching_details_list.push({
                    ...tcontentArr,
                    content:content
                })
            }
            if (selectedRowKeys && selectedRowKeys.length) {
                values.policy_id = selectedRowKeys[0]; //政策id
            }
            values.content = undefined;
            values.support_direction = support_direction;
            values.declare_condition = declare_condition;
            // values.support_content = support_content;
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
                    // if(url){
                    //     window.open(url + "/" + data.data.data.id);
                    // }else{
                    this.props.history.push(url ? url + "/" + data.data.data.id : '/projectList');
                    //}
                    // this.props.history.push(url ? url+"/"+data.data.data.id : '/projectList');
                }, 2000);
            } else {
                message.error(data.data.msg);
            }
        } else {
            let msg;
            // if (!support_direction) {
            //     msg = "扶持方向不能为空！";
            // }
            // if (!declare_condition) {
            //     msg = "申报条件不能为空！";
            // }
            // if(!support_content){
            //     msg="扶持内容不能为空！";
            // }
            if (!declare_material) {
                msg = "申报材料不能为空！";
            }
            if (!declare_process) {
                msg = "申报流程不能为空！";
            }
            if(!policyTitle){
                msg = "关联政策不能为空！";
            }
            // if(!review_process){
            //     msg="评审流程不能为空！";
            // }
            message.error(msg);
        }
    }
    onFinish = async (e) => {
        e.preventDefault();
        const _this = this;
        this.setState({
            state: true
        });
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.status = 2;
                this.onSubmit(values);
            } else {
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
            state: true
        });
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.status = 1;
                this.onSubmit(values);
            } else {
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
        this.setState({
            state: true
        });
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.status = 1;
                this.onSubmit(values, "/projectPreview");
            } else {
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
        console.log(date, dateString)
        this.setState({
            declare_start_date: dateString[0],
            declare_end_date: dateString[1]
        })
    }
    onDatePickerChange = (date, dateString) => {
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
        //fileList = fileList.slice(-2);

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
    showPolicy = () => {
        this.setState({
            policyVisible: true
        })
    }
    handleOk = async (e) => {
        this.setState({
            policyVisible: false,
            isSelectPolicy: true
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


    onSelectChange = (selectedRowKeys, selectedRows, isSelect) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows, isSelect);

        if (isSelect) {
            this.setState({selectedRowKeys: [selectedRowKeys], policyTitle: selectedRows});
            this.handleOk();
        } else {
            this.setState({selectedRowKeys, policyTitle: selectedRows[0].title});
        }
    };
    //复选框选中取消
    setCheckBox = (e) => {
        const {checked, value} = e.target;
        this.setState({
            [value]: checked
        });
        if (!checked) {
            this.props.form.setFieldsValue({
                [value]: undefined
            });
        }
    }
    //开关关闭开启
    switchChange = (checked, string) => {
        this.setState({
            [string]: checked
        })

        if (!checked) {
            if (string === "declare") {
                this.props.form.setFieldsValue({
                    ["develop_assets_value"]: undefined,
                    ["develop_assets_sign"]: undefined,
                    ["declare_value"]: undefined,
                    ["declare_sign"]: undefined,
                    ["develop_sign"]: undefined,
                    ["develop_value"]: undefined
                });
            } else if (string === "social") {
                this.props.form.setFieldsValue({
                    ["social_people_value"]: undefined,
                    ["social_people_sign"]: undefined,
                    ["develop_people_value"]: undefined,
                    ["develop_people_sign"]: undefined,
                });
            } else if (string === "address") {
                this.setState({
                    addressArr: [],
                    addressNum: 1
                })
            } else if (string === "industry_label") {
                this.props.form.setFieldsValue({
                    ["industry_label_ids"]: undefined
                });
            } else {
                this.props.form.setFieldsValue({
                    [string + "_value"]: undefined,
                    [string + "_sign"]: undefined
                });
            }
        } else {
            if (string === "declare") {
                this.props.form.setFieldsValue({
                    ["develop_assets_value"]: 0,
                    ["develop_assets_sign"]: "-1,0",
                    ["declare_value"]: 0,
                    ["declare_sign"]: "-1,0",
                    ["develop_sign"]: "-1,0",
                    ["develop_value"]: 0
                });
            } else if (string === "social") {
                this.props.form.setFieldsValue({
                    ["social_people_value"]: 0,
                    ["social_people_sign"]: "-1,0",
                    ["develop_people_value"]: 0,
                    ["develop_people_sign"]: "-1,0",
                });
            } else if (string === "set_up") {
                this.props.form.setFieldsValue({
                    [string + "_value"]: 2000,
                    [string + "_sign"]: "-1,0"
                });
            } else {
                this.props.form.setFieldsValue({
                    [string + "_value"]: 0,
                    [string + "_sign"]: "-1,0"
                });
            }
        }
    }

    addContent = () => {
        const addContentNum = ++this.state.addContentNum;
        this.setState({
            addContentNum
        },()=>{
            this.createEditor(`content${addContentNum-1}`, `content${addContentNum-1}`);//扶持内容
        })


    }
    deleteContent = (idx) => {
        const {contentArr,addContentNum} = this.state;
        const newContent = contentArr.filter((item, tidx) => {
            return tidx != idx;
        });
        let newContentArr={};
        for(let i = 0,j=0 ;i<addContentNum;i++){
            if(i != idx) {
                const content = this.state["content" + i];
                console.log(content,j,i)
                window["content" + j] && window["content" + j].txt.html(content);
                newContentArr["content" + j] = content;
                j++;
            }
        }
        console.log(newContentArr,idx);
        // let content = this.props.form.getFieldValue("content");
        // content = content.filter((item, tidx) => {
        //     return tidx != idx;
        // });
        // this.props.form.setFieldsValue({content});
        this.setState({
            addContentNum:--this.state.addContentNum,
            contentArr:newContent,
            ...newContentArr
        });
    }
    showContentModal = (i, content) => {
        this.setState({
            contentVisible: true,
            contentNumber: i,
            content
        })
    }
    handleCancel = e => {
        console.log(e);
        this.setState({
            [typeof e != "object" ? e : "policyVisible"]: false,
            contentNumber: 0,
            content: null
        });
    };
    //注册地址
    addressDom = () => {
        const {provinceSelect, addressNum, addressArr = [], address} = this.state;
        let html = [];
        for (let i = 0; i < addressNum; i++) {
            html.push(<Row key={i} style={i == 0 ? {} : {marginTop: "10px"}}>
                {provinceSelect ? <Col span={6}>
                    <div style={{marginRight: "40px"}}>
                        <Select
                            style={{width: '100%', marginRight: "20px"}}
                            onChange={(value, option) => this.onProvinceChange(value, option, i)}
                            value={addressArr[i] && addressArr[i].province}
                            disabled={!address}
                        >
                            {provinceSelect.map((item, idx) => <Option value={item.id} key={idx}>{item.value}</Option>)}
                        </Select>
                    </div>
                    <span className="address-title">省</span>
                </Col> : null}
                {this.state["citySelect" + i] && address ? <Col span={6}>
                    <div style={{marginRight: "40px"}}>
                        <Select
                            disabled={!address}
                            style={{width: '100%', marginRight: "20px"}}
                            onChange={(value, option) => this.onCityChange(value, option, i)}
                            value={addressArr[i] && addressArr[i].city}
                        >
                            {this.state["citySelect" + i].map((item, idx) => <Option value={item.id}
                                                                                     key={idx}>{item.value}</Option>)}
                        </Select>
                    </div>
                    <span className="address-title">市</span>
                </Col> : null}
                {this.state["areaSelect" + i] && address ? <Col span={6}>
                    <div style={{marginRight: "40px"}}>
                        <Select
                            disabled={!address}
                            style={{width: '100%'}}
                            onChange={(value, option) => this.onAreaChange(value, option, i)}
                            value={addressArr[i] && addressArr[i].area}
                        >
                            {this.state["areaSelect" + i].map((item, idx) => <Option value={item.id}
                                                                                     key={idx}>{item.value}</Option>)}
                        </Select>
                    </div>
                    <span className="address-title">区县</span>
                </Col> : null}
                {i == 0 ? <Col span={4}>
                    <Tag className="site-tag-plus" onClick={this.addAddress}>
                        {/*<PlusOutlined />*/}
                        <Icon type="plus"/>
                        可多选
                    </Tag>
                </Col> : null}
            </Row>)
        }
        return (html);
    }
    //扶持内容
    contentDom = () => {
        const {addContentNum, contentArr = []} = this.state;
        const {getFieldDecorator} = this.props.form;
        let html = [];
        for (let i = 0; i < addContentNum; i++) {
            html.push(<Row key={i} style={{marginBottom: "10px"}}>
                <Col span={16}>
                    <div style={{marginRight: "10px"}}>
                        <div ref={`content${i}`}>
                        </div>
                    </div>
                </Col>
                <Col span={4}>
                    <div>
                        <Button
                            onClick={() => this.showContentModal(i, contentArr[i])}>{contentArr && contentArr[i] ? "编辑条件" : "添加条件"}</Button>
                    </div>
                </Col>
                {i == addContentNum -1 ? <Col span={4}>
                    <Tag className="site-tag-plus content-tag" onClick={this.addContent}>
                        {/*<PlusOutlined />*/}
                        <Icon type="plus"/>
                        可多选
                    </Tag>
                </Col> : null}
                {i < addContentNum -1 ? <Col span={4}>
                    <Tag className="site-tag-plus content-tag" onClick={() => this.deleteContent(i)}>
                        {/*<PlusOutlined />*/}
                        <Icon type="minus"/>
                        删除
                    </Tag>
                </Col> : null}
            </Row>)
        }
        return (html);
    }
    contentCallback = (e) => {
        const {contentArr, contentNumber} = this.state;
        contentArr[contentNumber || 0] = e;
        this.setState({
            contentArr
        })
        console.log(contentArr, contentNumber, "2223333")
        this.handleCancel("contentVisible");
    }

    render() {
        const {
            industryData, policyTitle, belongData, typeData, productData, id, tableData, selectedRowKeys, formValues, post_material, declare_net, set_up = true, knowledge = true, invention = true, declare = true, industry_label = true, social = true, isSelectPolicy,
            support_direction, declare_condition, support_content, declare_material, declare_process, review_process, state, data = {}
        } = this.state;
        const {getFieldDecorator} = this.props.form;
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
        const rowSelection = {
            selectedRowKeys,
            type: "radio",
            onChange: this.onSelectChange
        };
        const pagination = {
            current: formValues && formValues.page ? formValues.page : 1,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 5,
            total: tableData.sum || 0,
            showTotal: (total, range) => `共 ${tableData.page_num} 页 总计 ${tableData.sum} 条政策`,
            pageSizeOptions: ['10', '20', '30', '50', '100', '150'],
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onPaginChange
        }
        return (
            <div className="addProject-template">
                <Top/>
                <div className="addProject-label-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <PolicyManagementMenu menu="projectList" current="projectList"/>
                        </Col>
                        <Col span={20}>
                            <Title name={id ? "编辑项目" : "添加项目"}/>
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
                                                style={{width: '100%'}}
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
                                                style={{width: '100%'}}
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
                                                style={{width: '100%'}}
                                                onChange={this.handleChange}
                                            >
                                                {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                        key={item.id}>{item.name}</Option>) : ''}

                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="联系方式">
                                        {getFieldDecorator('contact')(
                                            <Input/>
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
                                                    <DatePicker style={{width: "300px"}}
                                                                onChange={this.onDatePickerChange}/>
                                                )}
                                            </Form.Item>

                                        </Col>
                                        <Col span={12} className="declare_start_date">
                                            <Form.Item labelCol={{span: 6}} label="申报时间">
                                                {getFieldDecorator('declare_start_date')(
                                                    <RangePicker style={{width: "300px"}} onChange={this.onDateChange}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="release_date">
                                            <Form.Item labelCol={{span: 6}} label="扶持金额">
                                                {getFieldDecorator('money')(
                                                    <Input prefix="￥" suffix="万元" style={{width: "300px"}}/>
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
                                                    <Input style={{width: "300px"}}/>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {/*<Form.Item name="content" label="扶持方向"*/}
                                               {/*required*/}
                                               {/*validateStatus={!support_direction && state ? "error" : ""}*/}
                                               {/*help={!support_direction && state ? "必填项" : ""}>*/}
                                        {/*<div ref="editorElem1">*/}
                                        {/*</div>*/}
                                    {/*</Form.Item>*/}
                                    {/*<Form.Item name="content" label="申报条件" required*/}
                                               {/*validateStatus={!declare_condition && state ? "error" : ""}*/}
                                               {/*help={!declare_condition && state ? "必填项" : ""}*/}
                                    {/*>*/}
                                        {/*<div ref="editorElem2">*/}
                                        {/*</div>*/}
                                    {/*</Form.Item>*/}
                                    <Form.Item name="content" label="扶持内容"
                                        // required
                                        // validateStatus={!support_content && state ? "error" : ""}
                                        // help={!support_content && state ? "必填项" : ""}
                                    >
                                        {this.contentDom()}
                                        {/*<div ref="editorElem3">*/}
                                        {/*</div>*/}
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
                                    <Form.Item name="content" label="其它内容">
                                        <div ref="editorElem6">
                                        </div>
                                    </Form.Item>
                                    <Form.Item name="username" label="上传附件">
                                        <Upload {...props} fileList={this.state.fileList}
                                                defaultFileList={this.state.fileList}>
                                            <Button>
                                                {/*<UploadOutlined />*/}
                                                <Icon type="upload"/>
                                                上传文件
                                            </Button>
                                        </Upload>
                                        <span>支持扩展名为.doc/.docx/.ppt/.pptx/.xls/.xlsx/.pdf/.zip/.rar，大小不超过100M</span>
                                    </Form.Item>
                                    <p style={{fontWight: "bold", color: "#000", fontSize: "16px"}}><span
                                        style={{color: "#ff4d4f", "padding-left": "25px"}}>*</span>申报方式（可多选）</p>
                                    <Row className="declare-box">
                                        <Col span={4} style={{paddingLeft: "13px"}}><Checkbox value="declare_net"
                                                                                              checked={this.state.declare_net ? true : false}
                                                                                              onChange={this.setCheckBox}>网上申报</Checkbox></Col>
                                        <Col span={10}><Form.Item>
                                            {getFieldDecorator('declare_net')(
                                                <Input disabled={!declare_net}/>
                                            )}
                                        </Form.Item></Col>
                                    </Row>
                                    <Row className="declare-box">
                                        <Col span={4} style={{paddingLeft: "13px"}}>
                                            <Checkbox value="post_material"
                                                      checked={this.state.post_material ? true : false}
                                                      onChange={this.setCheckBox}>纸质材料提交至</Checkbox>
                                        </Col>
                                        <Col span={20}><Form.Item>
                                            {getFieldDecorator('post_material')(
                                                <TextArea disabled={!post_material} rows={4}/>
                                            )}
                                        </Form.Item></Col>
                                    </Row>
                                    {/*<Row>*/}
                                    {/*<Col span={3} style={{paddingTop:"8px",paddingRight:"20px",textAlign:"right",color:"#000"}}>申报标签：</Col>*/}
                                    {/*<Col span={21}>*/}
                                    {/*</Col>*/}
                                    {/*</Row>*/}
                                    <div className="addProject-button">
                                        <Button type="primary" htmlType="submit" ref="finish">发布</Button>
                                        <Button type="primary" className="ml15" ref="save"
                                                onClick={this.onSave}>存为草稿</Button>
                                        <Button type="primary" className="ml15" onClick={this.onView}>预览</Button>
                                        <Button className="ml15" onClick={() => window.history.back()}>返回</Button>
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
                        onSearch={value => this.getTableData({title: value})}
                        style={{width: 300}}
                        enterButton
                    />
                    <Table rowSelection={rowSelection} columns={this.columns}
                           dataSource={tableData ? tableData.result : []} pagination={pagination} rowKey="id"/>
                </Modal>
                {this.state.contentVisible ? <Modal
                    title={this.state.content ? "编辑条件" : "添加条件"}
                    visible
                    onOk={this.contentCallback}
                    onCancel={() => this.handleCancel("contentVisible")}
                    width="1000px"
                    className="select-porject-modal"
                    footer={null}
                    maskClosable={false}
                >
                    <AddContent defaultValue={this.state.content} callback={this.contentCallback}
                                onCancel={() => this.handleCancel("contentVisible")}/>
                </Modal> : null}
            </div>
        );
    };
}

export default Form.create()(AddProject);