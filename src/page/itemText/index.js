/**
 * 项目正文
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Breadcrumb,Descriptions,Button,Row,Col,Modal,Icon} from 'antd';
// import { StarOutlined } from '@ant-design/icons';
import Top from './../../component/top';
import './index.css';
import TitleTwo from "../../component/titleTwo";
import cookie from "react-cookies";
import {message} from "antd/lib/index";
import {request} from "../../utils/request";


class ItemText extends Component {
    constructor(props){
        super(props);
        this.state = {
            butnText:"收藏"
        };
    }
    async componentDidMount() {
        const {id} = this.props.match.params;
        this.getData(id);
        this.getCollection(id);
    }
    getData = async(id) =>{
        const responest = await request('/declare/get-one/' + id, 'POST',{member_id:cookie.load('userId')}); //详情
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
    //收藏
    onCollection = async () =>{
        const {id} = this.props.match.params;
        const {isCollection} = this.state;
        let url = '/common/my-company-collection';
        if(isCollection){
            url = '/common/cancel-company-collection';
        }
        const responest = await request(url, 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type:2}); //收藏
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);
            this.setState({
                butnText: isCollection ? "收藏" : "取消收藏",
                isCollection:!isCollection
            });
        }else{
            message.error(data.msg);
        }
    }
    showModal = () => {
        const {id} = this.props.match.params;
        console.log(id);
        if(id == 59 || id == 60){
            this.props.history.push(`/declarationForm/${id}`);
        }else {
            this.setState({
                visible: true
            });
        }
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
       const {detailInfo,butnText} = this.state;
        return (
            <div className="itemText-template">
                <Top />
                <div className="itemText-label-box max-weight-box">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>申报政策</Breadcrumb.Item>
                        <Breadcrumb.Item href="">项目正文</Breadcrumb.Item>
                    </Breadcrumb>
                   <div className="itemText-descriptions">
                    <Descriptions>
                        <Descriptions.Item label="项目标题" span={3}><span>{detailInfo && detailInfo.declare.title}</span></Descriptions.Item>
                        <Descriptions.Item label="发布机构" span={2}><span title={detailInfo && detailInfo.declare.organization_label_str}>{detailInfo && detailInfo.declare.organization_label_str}</span></Descriptions.Item>
                        <Descriptions.Item label="发文日期">{detailInfo && detailInfo.declare.release_date}</Descriptions.Item>
                        <Descriptions.Item label="政策标题" span={3}><a href={`/policyText/${detailInfo && detailInfo.declare.policy_id}`} >{detailInfo && detailInfo.declare.pc_title}</a></Descriptions.Item>
                    </Descriptions>
                   </div>
                    <div className="collection-butn">
                        <Button onClick={()=>this.showModal()} type="primary">立即申报</Button>
                        {cookie.load("userType") != 2 ? <Button onClick={()=>this.onCollection()} type="primary" icon="star" className="ml15">{butnText}</Button> : null}
                        <Button className="back-butn" icon="rollback" onClick={()=>{this.props.history.goBack()}}>返回</Button>
                    </div>
                    <div className="itemText-infor item-box">
                        <TitleTwo name="基本信息" />
                        <table className="itemText-infor-table">
                            <thead>
                            <tr>
                                <td style={{width:"200px"}}>所属层级</td>
                                <td>{detailInfo && detailInfo.declare.belong_str}</td>
                            </tr>
                            </thead>
                            <tbody>
                            {detailInfo && detailInfo.declare.organization_label_str ?
                            <tr>
                                <td>发布机构</td>
                                <td>{detailInfo && detailInfo.declare.organization_label_str}</td>
                            </tr>:null}
                            {detailInfo && detailInfo.declare.web_url ?
                            <tr>
                                <td>官文网址</td>
                                <td><div style={{wordBreak:"break-all"}}>{detailInfo ? <a href={detailInfo.declare.web_url} target="_blank">{detailInfo.declare.web_url}</a> : "/"}</div></td>
                            </tr>:null}
                            {detailInfo && detailInfo.declare.money ?
                            <tr>
                                <td>扶持金额</td>
                                <td>{detailInfo ? detailInfo.declare.money+"万元" : "-"}</td>
                            </tr>
                                :null}
                            {detailInfo && detailInfo.declare.declare_start_date ?
                            <tr>
                                <td>申报时间</td>
                                <td>{detailInfo.declare.declare_start_date}</td>
                            </tr>
                                :null}
                            {detailInfo && detailInfo.declare.use_type_label_str ?
                            <tr>
                                <td>应用类型</td>
                                <td>{detailInfo.declare.use_type_label_str}</td>
                            </tr>
                            :null}
                            {detailInfo && detailInfo.declare.industry_label_str ?
                            <tr>
                                <td>所属行业</td>
                                <td>{detailInfo.declare.industry_label_str}</td>
                            </tr> : null}
                            </tbody>
                        </table>
                    </div>
                    {/*{detailInfo && detailInfo.declare.support_direction ? <div className="item-box">*/}
                        {/*<TitleTwo name="扶持方向" />*/}
                        {/*<div className="item-desc">*/}
                        {/*<div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.support_direction }}></div>*/}
                        {/*</div>*/}
                    {/*</div>:null}*/}
                    {/*{detailInfo && detailInfo.declare.declare_condition ? <div className="item-box">*/}
                        {/*<TitleTwo name="申报条件" />*/}
                        {/*<div className="item-desc">*/}
                        {/*<div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_condition }}></div>*/}
                        {/*</div>*/}
                    {/*</div>:null}*/}
                    {detailInfo && detailInfo.declare.declare_matching_details_list ?<div className="policyPreview-content-box">
                        <TitleTwo name="扶持内容" />
                        <div className="policyPreview-content">
                            <div className="policyPreview-content-text">
                                {detailInfo.declare.declare_matching_details_list.map((item,idx)=>{
                                    return (<div style={item.matching_bool ? {fontWeight:"bold",borderBottom:"1px dotted #d9d9d9",paddingBottom:"20px"} : {borderBottom:"1px dotted #d9d9d9",paddingBottom:"20px"}}  dangerouslySetInnerHTML = {{ __html:item.content }}></div>)
                                })}

                            </div>
                        </div>
                    </div>:null}
                    {detailInfo && detailInfo.declare.contact ?<div className="item-box">
                        <TitleTwo name="联系方式" />
                        <div className="item-desc">
                        <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.contact }}></div>
                        </div>
                    </div>:null}
                    {detailInfo && detailInfo.declare.declare_material ?<div className="item-box">
                        <TitleTwo name="申报材料" />
                        <div className="item-desc">
                        <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_material }}></div>
                        </div>
                    </div>:null}
                    {detailInfo && detailInfo.declare.declare_process ?<div className="item-box">
                        <TitleTwo name="申报流程" />
                        <div className="item-desc">
                        <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_process }}></div>
                        </div>
                    </div>:null}
                    {detailInfo && detailInfo.declare.review_process ?<div className="item-box">
                        <TitleTwo name="评审流程" />
                        <div className="item-desc">
                        <div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.review_process }}></div>
                        </div>
                    </div>:null}
                    {detailInfo && detailInfo.resource_file_list && detailInfo.resource_file_list.length>0 ? <div className="item-box">
                        <TitleTwo name="附件" />
                        <div className="item-desc">
                        {detailInfo.resource_file_list.map((item,idx)=>{
                            return <p key={idx}><a href={item.image_url} target="_blank">{item.file_ori_name}</a> </p>
                        })}
                        </div>
                    </div> : null}
                </div>
                <Modal
                    title="申报提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="删除"
                    cancelText="关闭"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            关闭
                        </Button>
                    ]}
                >
                    <p>该项目网上申报后，需提交纸质材料。</p>
                    {detailInfo!=undefined && detailInfo.declare.declare_net ?
                    <Row>
                        <Col span={8}>1.点击进入网上申报：</Col>
                        <Col span={16}>
                            <span>{detailInfo!=undefined ? detailInfo.declare.declare_net : null}</span>
                            {detailInfo!=undefined ? <a className="model-button" href={detailInfo.declare.declare_net} target="_blank">网上申报</a> : null}
                        </Col>
                    </Row> : null}
                    {detailInfo!=undefined && detailInfo.declare.post_material ?
                    <Row>
                        <Col span={8}>{detailInfo!=undefined && detailInfo.declare.declare_net ? "2": "1" }.纸质材料提交至</Col>
                        <Col span={16}>{detailInfo!=undefined ? detailInfo.declare.post_material : null}
                        </Col>
                    </Row> : null}
                </Modal>
            </div>
        );
    };
}

export default ItemText;