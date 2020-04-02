/**
 *  轮播图管理
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Row, Col, Breadcrum,Upload,Breadcrumb,Button,Icon} from 'antd';
import Top from '../../../../component/top/index';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
import cookie from "react-cookies";
// import { UploadOutlined } from '@ant-design/icons';

const uploadUrl = 'http://58.144.217.13:5001/api/common/upload-file';
class CarouselManage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
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
        return (
            <div className="carouselManage-template">
                <Top/>
                <div className="carouselManage-label-box max-weight-box">
                    <Row>
                        <Col span={4}>
                            <PolicyManagementMenu menu="systemManagement" current="carouselManage"/>
                        </Col>
                        <Col span={20}>
                            <Title name="轮播图管理"/>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                                <Breadcrumb.Item href="">轮播图管理</Breadcrumb.Item>
                            </Breadcrumb>
                            {/*<Row gutter={16} className="img-list">*/}
                                {/*<Col span={8}>*/}
                                    {/*<img src="http://web.file.policy.com/static/2020/03/24/61fa3cece4258993a6c29c82f6324852.jpg" />*/}
                                    {/*<p><a>删除</a></p>*/}
                                {/*</Col>*/}
                            {/*</Row>*/}
                            <Row className="label-box">
                                <Col span={4}>
                                    上传图片
                                </Col>
                                <Col span={18}>
                                <Upload {...props} fileList={this.state.fileList}>
                                    <Button>
                                        {/*<UploadOutlined />*/}
                                        <Icon type="upload" />
                                        点击上传轮播图
                                    </Button>
                                </Upload>
                                <span>支持上传文件格式包括JPG,JPEG、PNG或者pdf,doc,docx,xlsx,xls。<br />单个图片/文件不要超过30M大小!<br />最多3张</span>
                                </Col>
                            </Row>
                            <div className="operation-button" style={{marginLeft:"260px"}}>
                                <Button type="primary" htmlType="submit" ref="finish">发布</Button>
                                <Button className="ml15" onClick={()=>window.history.back()}>取消</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    };
}

export default CarouselManage;