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
import TitleTwo from "../../../../component/titleTwo";
import cookie from "react-cookies";


class policyPreview extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:props.match.params ? props.match.params.id : null,
            policy:{}
        };
    }
    componentDidMount() {
        this.getDefalutData();
    }
    getDefalutData = async() =>{
        const responest = await request(`/declare/get-one/${this.state.id}`, 'POST',{member_id:cookie.load('userId')}); //请求默认数据
        this.setState({
            detailInfo:responest.data
        })
    }
    getCollection = async (id) =>{
        const res = await request('/common/get-collection-info', 'POST',{ member_id:cookie.load('userId'), resource_id:parseInt(id), resource_type:2}); //是否收茂
        console.log(res);
        if (res.data.success && res.data.res){
            this.setState({
                butnText: "取消收藏",
                isCollection:true
            });
        }else{
            this.setState({
                butnText: "收藏",
                isCollection: false
            });
        }

    }
    showModal = () => {
        this.setState({
            visible: true
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    render() {
        const {detailInfo,butnText,policy,id} = this.state;
        // const labelStr = policy.label_add_str ? policy.label_add_str.split(",") : null;
        return (
            <div className="policyPreview-template">
                <Top />
                <div className="policyPreview-label-box">
                    <div className="max-weight-box">
                        <div className="max-weight-box"><Title name="项目预览" /></div>
                       <div className="policyPreview-descriptions">
                        <Descriptions column={2}>
                            <Descriptions.Item label="项目标题" span={2}><span>{detailInfo && detailInfo.declare.title}</span></Descriptions.Item>
                            <Descriptions.Item label="发布机构"><span title={detailInfo && detailInfo.declare.organization_label_str}>{detailInfo && detailInfo.declare.organization_label_str}</span></Descriptions.Item>
                            <Descriptions.Item label="发文日期">{detailInfo && detailInfo.declare.release_date}</Descriptions.Item>
                            <Descriptions.Item label="政策标题" span={3}>{detailInfo && detailInfo.declare.pc_title}</Descriptions.Item>
                        </Descriptions>
                       </div>
                        <div>
                            <Button icon="rollback" onClick={()=>{this.props.history.push(`/addProject/${id}`)}}>返回</Button>
                        </div>
                        <div className="policyPreview-content-box">
                            <TitleTwo name="基本信息" />
                            <div className="policyPreview-content">
                                <table className="itemText-infor-table">
                                    <thead>
                                    {detailInfo && detailInfo.declare.belong_str ?
                                    <tr>
                                        <td style={{width:'200px'}}>所属层级</td>
                                        <td>{detailInfo && detailInfo.declare.belong_str}</td>
                                    </tr>
                                        : null}
                                    </thead>
                                    <tbody>
                                    {detailInfo && detailInfo.declare.organization_label_str ?
                                    <tr>
                                        <td>发布机构</td>
                                        <td>{detailInfo && detailInfo.declare.organization_label_str}</td>
                                    </tr>
                                        : null}
                                    {detailInfo && detailInfo.declare.web_url ?
                                    <tr>
                                        <td>官文网址</td>
                                        <td>{detailInfo ? <a href={detailInfo.declare.web_url} target="_blank">{detailInfo.declare.web_url}</a> : "/"}</td>
                                    </tr> : null}
                                    {detailInfo && detailInfo.declare.declare_net ?
                                    <tr>
                                        <td>申报网址</td>
                                        <td>{detailInfo ? <a href={detailInfo.declare.declare_net} target="_blank">{detailInfo.declare.declare_net}</a> : "/"}</td>
                                    </tr>
                                        : null}
                                    {detailInfo && detailInfo.declare.declare_start_date ?
                                    <tr>
                                        <td>申报时间</td>
                                        <td>{detailInfo && detailInfo.declare.declare_start_date}</td>
                                    </tr>:null}
                                    {detailInfo && detailInfo.declare.use_type_label_str ?
                                    <tr>
                                        <td>应用类型</td>
                                        <td>{detailInfo && detailInfo.declare.use_type_label_str}</td>
                                    </tr>:null}
                                    {detailInfo && detailInfo.declare.industry_label_str ?
                                    <tr>
                                        <td>所属行业</td>
                                        <td>{detailInfo && detailInfo.declare.industry_label_str}</td>
                                    </tr>:null}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/*{detailInfo && detailInfo.declare.support_direction ?*/}
                        {/*<div className="policyPreview-content-box">*/}
                            {/*<TitleTwo name="扶持方向" />*/}
                            {/*<div className="policyPreview-content">*/}
                                {/*<div className="policyPreview-content-text">*/}
                                    {/*<div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.support_direction }}></div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>:null}*/}
                        {/*{detailInfo && detailInfo.declare.declare_condition ?<div className="policyPreview-content-box">*/}
                            {/*<TitleTwo name="申报条件" />*/}
                            {/*<div className="policyPreview-content">*/}
                                {/*<div className="policyPreview-content-text">*/}
                                    {/*<div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_condition }}></div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>:null}*/}
                        {detailInfo && detailInfo.declare.declare_matching_details_list ?<div className="policyPreview-content-box">
                            <TitleTwo name="扶持内容" />
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    {detailInfo.declare.declare_matching_details_list.map((item,idx)=>{
                                       return (<div style={item.matching_bool ? {color:"red"} : {}}>{item.content}</div>)
                                    })}
                                </div>
                            </div>
                        </div>:null}
                        {detailInfo && detailInfo.declare.contact ?<div className="policyPreview-content-box">
                            <TitleTwo name="联系方式" />
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.contact }}></div>
                                </div>
                            </div>
                        </div> : null}
                        {detailInfo && detailInfo.declare.declare_material ?<div className="policyPreview-content-box">
                            <TitleTwo name="申报材料" />
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_material }}></div>
                                </div>
                            </div>
                        </div>:null}
                        {detailInfo && detailInfo.declare.declare_process ?<div className="policyPreview-content-box">
                            <TitleTwo name="申报流程" />
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_process }}></div>
                                </div>
                            </div>
                        </div> : null}
                        {detailInfo && detailInfo.declare.review_process ?
                            <div className="policyPreview-content-box">
                            <TitleTwo name="评审流程" />
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.review_process }}></div>
                                </div>
                            </div>
                        </div> : null}
                        {detailInfo && detailInfo.resource_file_list && detailInfo.resource_file_list.length >0 ?
                        <div className="policyPreview-content-box">
                            <TitleTwo name="附件" />
                            <div className="policyPreview-content">
                                <div className="policyPreview-content-text">
                                    {detailInfo.resource_file_list.map((item,idx)=>{
                                        return <p key={idx}><a href={item.image_url} target="_blank">{item.file_ori_name}</a> </p>
                                    })}</div>
                            </div>
                        </div>
                            : null}
                    </div>
                </div>
            </div>
        );
    };
}

export default policyPreview;