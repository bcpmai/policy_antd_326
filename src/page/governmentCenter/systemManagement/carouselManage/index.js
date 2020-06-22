/**
 *  轮播图管理
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Row, Col, Breadcrum,Upload,Breadcrumb,Button,Icon,message,Form,Input} from 'antd';
import Top from '../../../../component/top/index';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import cookie from "react-cookies";
import {request} from "../../../../utils/request";
// import { UploadOutlined } from '@ant-design/icons';

const uploadUrl = window.location.href.indexOf("http://jlpzc.cicba.cn") != -1 ? 'http://jlpzc.cicba.cn/api/common/upload-file' : 'https://jlpzc.cicba.cn/api/common/upload-file';
class CarouselManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList:[],
            defaultFileList:[]
        }
    }

    async componentDidMount() {
        this.getDefalut();
    }
    getDefalut = async() =>{
        const responest = await request('/common/get-slideshow', 'POST'); //详情

        let defaultFileList=[];
        responest.data.map((item,idx)=>{
            defaultFileList.push(
                {
                    uid: item.id,
                    name:item.url,
                    status: 'done',
                    response: {
                        data: {
                            image_url: item.url,
                            sort:item.sort,
                            id:item.id
                        }
                    }
                }
            )
        })
        this.setState({
            fileList:responest.data,
            defaultFileList
        })
    }
    handleUploadChange = info => {
        console.log(info);
        const {defaultFileList} = this.state;
        let fileList = [...info.fileList];
        if(info.file.status == 'done'){
            fileList = defaultFileList.concat(fileList);
        }
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-3);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                const {image_url,id,sort} = file.response.data;
                file.url = image_url;
                file.sort = sort;
                file.id = sort ? id : null;
            }
            return file;
        });

        this.setState({ fileList });
    }
    remove = async(id,idx) => {
        let {fileList,defaultFileList} = this.state;
        if (id) {
            const responest = await request('/common/del-slideshow', 'POST', {id});
            const {msg, success} = responest.data;
            if (success) {
                fileList.splice(idx, 1);
                defaultFileList.splice(idx,1);
                this.setState({
                    fileList,
                    defaultFileList
                });
                message.success(msg)
            } else {
                message.error(msg);
            }
        }else{
            fileList.splice(idx, 1);
            defaultFileList.splice(idx,1);
            this.setState({
                fileList,
                defaultFileList
            });
            message.success("删除成功！")
            this.setState(fileList);
        }
        // this.setState({
        //     fileList:responest.data
        // })
    }
    handleSubmit = (e) =>{
        e.preventDefault();
        if(cookie.load('userId')) {
            this.props.form.validateFields(async(err, values) => {
                if (!err) {
                    let data = [];
                    if(values.url){
                        values.url.map((item,idx)=>data.push({sort:values.sort[idx],url:item}));
                        const responest = await request('/common/add-slideshow', 'POST', {data}); //详情
                        const {msg,success} = responest.data;
                        if(success){
                            message.success(msg);
                            setTimeout(()=>{
                                window.location.reload()
                            },2000);
                        }else{
                            message.error(msg);
                        }
                    }else{
                        message.error("您还没有上传轮播图！")
                    }
                }
            });
        }else{
            message.error("请登录后再操作！")
        }
    }
    render() {

        const {fileList,defaultFileList=[]} = this.state;
        console.log(defaultFileList)
        const props = {
            action: 'http://106.75.17.129:5000/api/common/upload-file',
            // action:uploadUrl,
            onChange: this.handleUploadChange,
            multiple: true,
            data:{
                userId:cookie.load("userId"),
                userName:cookie.load("userName"),
                userType:cookie.load("userType"),
            },
            defaultFileList:[...defaultFileList],
            accept:".jpg,.jpeg,png"
        };
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        return (
            <div className="carouselManage-template">
                <Top/>
                <div className="carouselManage-label-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <PolicyManagementMenu menu="systemManagement" current="carouselManage"/>
                        </Col>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Col span={20}>
                            <Title name="轮播图管理"/>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                                <Breadcrumb.Item href="">轮播图管理</Breadcrumb.Item>
                            </Breadcrumb>
                            <Row gutter={16} className="img-list">
                                {fileList.length ? fileList.map((item,idx)=>{
                                        return <Col span={8} key={idx} style={{border:"1px solid #f1f1f1"}}>
                                            <img src={item.url} />
                                            <Row>
                                                <Col span={8}>
                                                    <p onClick={()=>this.remove(item.id,idx)} style={{marginTop:"10px"}}><a>删除</a></p>
                                                </Col>
                                                <Col span={16}>
                                                    <div>
                                                    <Form.Item
                                                        label='权重'
                                                        key={`sort${idx}`}
                                                        style={{marginBottom:"0px"}}
                                                    >
                                                        {getFieldDecorator(`sort[${idx}]`,{
                                                            initialValue:item.sort
                                                        })(<Input placeholder="请输入整数" style={{ width: '100%', marginRight: 8 }} />)}
                                                    </Form.Item>
                                                    <Form.Item
                                                        label=''
                                                        key={`url${idx}`}
                                                        style={{marginBottom:"0px"}}
                                                    >
                                                        {getFieldDecorator(`url[${idx}]`,{
                                                            initialValue:item.url
                                                        })(<Input type="hidden" />)}

                                                    </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                }) : null}
                            </Row>
                            <Row className="label-box">
                                <Col span={4}>
                                    上传图片
                                </Col>
                                <Col span={18}>
                                <Upload {...props} showUploadList={false}>
                                    <Button>
                                        {/*<UploadOutlined />*/}
                                        <Icon type="upload" />
                                        点击上传轮播图
                                    </Button>
                                </Upload>
                                <span>支持上传文件格式包括JPG,JPEG、PNG。<br />单个图片/文件不要超过30M大小!<br />最多3张</span>
                                </Col>
                            </Row>
                            <div className="operation-button" style={{marginLeft:"260px"}}>
                                <Button type="primary" htmlType="submit">发布</Button>
                                <Button className="ml15" onClick={()=>window.history.back()}>取消</Button>
                            </div>
                        </Col>
                        </Form>
                    </Row>
                </div>
            </div>
        );
    };
}

export default Form.create()(CarouselManage);