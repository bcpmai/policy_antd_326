/**
 * 项目预览
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Breadcrumb,Descriptions,Tag,Button,Row,Col,Card,List} from 'antd';
// import { StarOutlined } from '@ant-design/icons';
import axios from 'axios';
import Top from '../../../../component/top/index';
import Title from '../../../../component/title/index';
// import Footer from "../../component/footer";
import './index.css';
import {request} from "../../../../utils/request";


class policyPreview extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:props.match.params ? props.match.params.id : null,
            policy:{}
        };
        this.listData = [
            {
                title: '国家企业技术中心认定管理办法',
                time:'2016-02-26',
                link:'www.baidu.com'
            },
            {
                title: '工业和信息化部关于申报2019年工业和信息化领域公共服务能力提升专项的通知',
                time:'2016-02-26',
                link:'www.baidu.com'
            },
            {
                title: '关于申报2019年科研机构绩效激励引导专项的通知',
                time:'2016-02-26',
                link:'www.baidu.com'
            },
        ];
    }
    componentDidMount() {
        this.getDefalutData();
    }
    getDefalutData = async() =>{
        const {data} = await request(`/policy/get/${this.state.id}`, 'GET'); //请求默认数据
        this.setState({
            policy:data.policy
        })
    }
    render() {
        const {policy} = this.state;
        const labelStr = policy.label_add_str ? policy.label_add_str.split(",") : null;
        return (
            <div className="policyPreview-template">
                <Top />
                <div className="max-weight-box"><Title name="项目预览" /></div>
                <div className="policyPreview-label-box">
                    <div className="max-weight-box">
                       <div className="policyPreview-descriptions">
                        <Descriptions column={2}>
                            <Descriptions.Item label="项目标题" span={2}><span>{policy.title}</span></Descriptions.Item>
                            <Descriptions.Item label="发布机构"><span title="重庆市发改委重庆市发改委重庆市发改委">重庆市发改委</span></Descriptions.Item>
                            <Descriptions.Item label="发文日期">{policy.release_date}</Descriptions.Item>
                            <Descriptions.Item label="政策标题" span={2}><span>{policy.title}</span></Descriptions.Item>
                        </Descriptions>
                       </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">基本信息</div>
                            <div className="policyPreview-content">
                                <table>
                                    <tr>
                                        <td>所属层级</td>
                                        <td>重庆市级</td>
                                    </tr>
                                    <tr>
                                        <td>发布机构</td>
                                        <td>市政府</td>
                                    </tr>
                                    <tr>
                                        <td>官文网址</td>
                                        <td>www.baidu.com</td>
                                    </tr>
                                    <tr>
                                        <td>申报网址</td>
                                        <td>\</td>
                                    </tr>
                                    <tr>
                                        <td>申报时间</td>
                                        <td>2020-01-01至2020-05-01</td>
                                    </tr>
                                    <tr>
                                        <td>应用类型</td>
                                        <td>资金支持、人才计划</td>
                                    </tr>
                                    <tr>
                                        <td>所属行业</td>
                                        <td>A.农业</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">扶持方向</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">申报条件</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">扶持内容</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">联系方式</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">申报材料</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">申报流程</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">评审流程</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="policyPreview-content-box">
                            <div className="information-title">附件</div>
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default policyPreview;