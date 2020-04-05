/**
 * 政策正文
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Breadcrumb,Descriptions,Tag,Button,Row,Col,Card,List,Icon} from 'antd';
// import { StarOutlined } from '@ant-design/icons';
import axios from 'axios';
import Top from './../../component/top';
// import Footer from "../../component/footer";
import './index.css';
import {request} from "../../utils/request";
import cookie from "react-cookies";
import {message} from "antd/lib/index";


class PolicyText extends Component {
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
                link:'/itemText'
            },
            {
                title: '工业和信息化部关于申报2019年工业和信息化领域公共服务能力提升专项的通知',
                time:'2016-02-26',
                link:'/itemText'
            },
            {
                title: '关于申报2019年科研机构绩效激励引导专项的通知',
                time:'2016-02-26',
                link:'/itemText'
            },
        ];
    }
    componentDidMount() {
        this.getDefalutData();
        this.getCollection(this.state.id);
    }
    getDefalutData = async() =>{
        const {data} = await request(`/policy/get/${this.state.id}`, 'GET'); //请求默认数据
        this.setState({
            policy:data.policy,
            resource_file_list:data.resource_file_list
        })
    }
    getCollection = async (id) =>{
        const res = await request('/common/get-collection-info', 'POST',{ member_id:cookie.load('userId'), resource_id:parseInt(id), resource_type:1}); //是否收茂
        console.log(res);
        if (res.data.success && res.data.res){
            this.setState({
                isCollection:true
            });
        }else{
            this.setState({
                isCollection: false
            });
        }

    }
    //收藏
    onCollection = async (id) =>{
        // const {id} = this.props.match.params;
        const {isCollection} = this.state;
        let url = '/common/my-company-collection';
        if(isCollection){
            url = '/common/cancel-company-collection';
        }
        const responest = await request(url, 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type:1}); //收藏
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);
            this.setState({
                isCollection:!isCollection
            });
        }else{
            message.error(data.msg);
        }
    }
    render() {
        const {policy,resource_file_list=[],isCollection} = this.state;
        // const labelStr = policy.label_add_str ? policy.label_add_str.split(",") : null;
        return (
            <div className="policyText-template">
                <Top />
                <div className="policyText-label-box max-weight-box">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>最新政策</Breadcrumb.Item>
                        <Breadcrumb.Item href="">政策正文</Breadcrumb.Item>
                    </Breadcrumb>
                   <div className="policyText-descriptions">
                       <Descriptions>
                           <Descriptions.Item label="政策标题" span={3}><span>{policy.title}</span></Descriptions.Item>
                           <Descriptions.Item label="发布机构"><span title="重庆市发改委重庆市发改委重庆市发改委">重庆市发改委</span></Descriptions.Item>
                           <Descriptions.Item label="发文日期">{policy.release_date}</Descriptions.Item>
                           <Descriptions.Item label="发文字号">{policy.post_shop_name}</Descriptions.Item>
                           {policy.label_add_str ? <Descriptions.Item label="政策标签" span={3} className="labelAdd">
                                   {policy.label_add_str}</Descriptions.Item> : null}
                           {policy.life_date ? <Descriptions.Item label="政策有效期">
                               {policy.life_date}
                           </Descriptions.Item> : null}
                       </Descriptions>
                   </div>
                    <div className="policy-butn">
                        {cookie.load("userType") != 2 ? <Button onClick={()=>this.onCollection(policy.id)} type="primary" icon="star">{isCollection ? "已收藏" : "收藏" }</Button> : null}
                        <Button className="back-butn" icon="rollback" onClick={()=>{this.props.history.goBack()}}>返回</Button>
                    </div>
                    <Row gutter={16} className="policyText-content-box">
                        <Col span={24} className="policyText-content">
                            {/*<p className="policyText-content-title">云南省工业和信息化委关于申报2018年省级工业和信息化发展专项资金(技术改造方向)项目的通知</p>*/}
                            <div className="policyText-content-text">
                                <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                            </div>
                            {resource_file_list &&
                                resource_file_list.length>0 ?<Row>
                                <Col span={2}>附件：</Col>
                                <Col>
                                    {resource_file_list.map((item,idx)=><p key={idx}><a href={item.image_url} key={idx} target="_blank">{item.file_ori_name}</a></p>)}

                                </Col>
                            </Row>:null}
                        </Col>
                        {/*<Col span={6}>*/}
                            {/*<Card title="申报政策">*/}
                                {/*<List*/}
                                    {/*itemLayout="horizontal"*/}
                                    {/*dataSource={this.listData}*/}
                                    {/*renderItem={item => (*/}
                                        {/*<List.Item>*/}
                                            {/*<List.Item.Meta*/}
                                                {/*title={<a href={item.link} target="_blank">{item.title}</a>}*/}
                                                {/*description={item.time}*/}
                                            {/*/>*/}
                                        {/*</List.Item>*/}
                                    {/*)}*/}
                                {/*/>,*/}
                            {/*</Card>*/}
                        {/*</Col>*/}
                    </Row>
                </div>
                {/*<Footer/>*/}
            </div>
        );
    };
}

export default PolicyText;