/**
 * 首页
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Carousel, Row, Col, Button, Divider, Card, message, Modal,Statistic } from 'antd';
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import {request} from './../../utils/request';
import Top from './../../component/top';
import Label from "../../component/label";
import bannerImg1 from "./img/new_banner.jpg";
import policyImg from "./img/policy.jpg";
import projectImg from "./img/project.jpg";
import Icon1 from "./img/icon1.png";
import Icon2 from "./img/icon2.png";
import Icon3 from "./img/icon3.png";
import Icon4 from "./img/icon4.png";

import './index.css';

const { Countdown } = Statistic;

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            company_count: 0,
            macthing_declare: 0,
            policy_click_count: 0,
            policy_spider_count: 0
        }
    }
    async componentWillMount() {
        const numberData = await request('/common/get-bananer','POST');
        const listData = await request('/declare/list','POST',{ page: 1, max_line: 3,status:2 }); //获取最新政策数据

        if (listData && listData.status==200 && numberData.status == 200) {

            console.log(numberData.data)
            let list = listData.data.result;
            list.map((item,idx)=>{
                list[idx].use_type_label_str = item.use_type_label_str.split(",");
            })
            this.setState({
                dataList: list,
                //number:numberData.data
            })
        }
        let timeer = setInterval(()=>{
            const {company_count,macthing_declare,policy_click_count,policy_spider_count} = numberData.data;
            const time = 200;
            const companyCount = this.state.company_count + parseInt(company_count/time)+1;
            const macthingCount = this.state.macthing_declare + parseInt(macthing_declare/time)+1;
            const clickCount = this.state.policy_click_count + parseInt(policy_click_count/time)+1;
            const spiderCount = this.state.policy_spider_count + parseInt(policy_spider_count/time)+1;
            console.log(company_count,macthing_declare,policy_click_count,policy_spider_count)
            console.log(companyCount,macthingCount,clickCount,spiderCount);
            if(companyCount>=company_count && macthingCount>=macthing_declare && clickCount >= policy_click_count && spiderCount >=policy_spider_count){
                this.setState({
                    company_count:company_count ,
                    macthing_declare:macthing_declare,
                    policy_click_count:policy_click_count,
                    policy_spider_count:policy_spider_count
                })
                clearInterval(timeer);
            }else{
                this.setState({
                    company_count:companyCount >= company_count ? company_count : companyCount,
                    macthing_declare:macthingCount >= macthing_declare ? macthing_declare : macthingCount,
                    policy_click_count:clickCount >= policy_click_count ? policy_click_count : clickCount,
                    policy_spider_count:spiderCount >= policy_spider_count ? policy_spider_count : spiderCount
                })
            }
        },1)
    }
    getListData = () =>{

    }
    setDeclarePush = (list,idx) =>{
        let key = ["organization_label_list","use_type_list","industry_label_list"];
        this.setState({
            [key[idx]]:list
        })
    }
    goDeclarePush = () =>{
        if(cookie.load('userId')){
            const {organization_label_list,use_type_list,industry_label_list} = this.state;
            let url="/";
            if(organization_label_list){
                url +=organization_label_list.join(",")+"&";
            }else{
                url += "-1&";
            }
            if(use_type_list){
                url+=use_type_list.join(",")+"&";
            }else{
                url += "-1&";
            }
            if(industry_label_list){
                url+=industry_label_list;
            }else{
                url += "-1";
            }
            this.props.history.push('/declarePush'+url);
        }else{
            message.warning('请先登录');
        }
    }
    showModal = (idx) => {
        this.setState({
            visible: true,
            idx
        });
        console.log(idx);
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
    };
    render() {
        const { label, dataList,idx,company_count,
            macthing_declare,
            policy_click_count,
            policy_spider_count } = this.state;
        return (
            <div className="index-template">
                <Top />
                <div className="index-box">
                    <div className="carousel-box">
                        <Carousel autoplay>
                            <div>
                                <img src={bannerImg1} />
                            </div>
                            <div>
                                <img src={bannerImg1} />
                            </div>
                        </Carousel>
                    </div>
                    <div className="center-banner">
                        <Row className="max-weight-box">
                            <Col span={6}>
                                <img src={Icon1} />
                                <p className="number">{policy_spider_count}<span>条</span></p>
                                <p className="desc">政策采集条数</p>
                            </Col>
                            <Col span={6}>
                                <img src={Icon2} />
                                <p className="number">{policy_click_count}<span>次</span></p>
                                <p className="desc">政策点击次数</p>
                            </Col>
                            <Col span={6}>
                                <img src={Icon3} />
                                <p className="number">{macthing_declare}<span>次</span></p>
                                <p className="desc">精准匹配次数</p>
                            </Col>
                            <Col span={6}>
                                <img src={Icon4} />
                                <p className="number">{company_count}<span>家</span></p>
                                <p className="desc">服务企业总数</p>
                            </Col>
                        </Row>
                    </div>
                    <div className="matching-box">
                        <div className="index-item-link">
                            <div className="max-weight-box">
                                <Row style={{marginLeft:"60px"}}>
                                    <Col span={8}>
                                        <Link to="/latestPolicy">
                                            <div className="item">
                                                <p className="title">查找政策</p>
                                                <p className="desc">快速查询相关政策</p>
                                            </div>
                                        </Link>
                                    </Col>
                                    <Col span={8}>
                                        <Link to="/declarationItem">
                                        <div className="item">
                                            <p className="title">申报项目</p>
                                            <p className="desc">获取项目政策扶持</p>
                                        </div>
                                        </Link>
                                    </Col>
                                    <Col span={8}>
                                        <Link to="/matching">
                                        <div className="item">
                                            <p className="title">精准匹配</p>
                                            <p className="desc">结合情况进行匹配</p>
                                        </div>
                                        </Link>
                                    </Col>
                                </Row>
                        </div>
                        </div>
                        <div className="max-weight-box desc-item-box">
                            <ul>
                                <li>
                                    <p className="title">真实权威的官方数据平台</p>
                                    <p className="desc">政府牵头搭建，政企联合开发<br />更新全面及时，数据真实权威</p>
                                </li>
                                <li>
                                    <p className="title">高效查询，精准匹配，在线申报</p>
                                    <p className="desc">大数据存储技术及人工智能算法分析技术<br />高效整合、全面覆盖，方便政企对接<br />提供匹配查询到在线申报的一条龙服务</p>
                                </li>
                                <li>
                                    <p className="title">一键式傻瓜操作</p>
                                    <p className="desc">极低的操作门槛，杜绝误操作，降低沟通成本<br />提升匹配精准度及项目申报成功率<br />省时、省心、省力</p>
                                </li>
                            </ul>
                        </div>
                        <div className="application-box">
                            <div className="max-weight-box">
                            <Row className="application-item-box">
                                {dataList && dataList.length ? dataList.map((item,idx)=>{
                                   return <Col span={8} key={idx}>
                                        <div className="item">
                                            <p className="title"><a href={`/itemText/${item.id}`} title={item.title}>{item.title.length < 45 ? item.title : item.title.substr(0,45)+"..."}</a></p>
                                            <p align="center">{item.use_type_label_str ? item.use_type_label_str.map((tagItem,tagIdx)=>{
                                                return <span className="tips mr10" key={tagIdx}>{tagItem}</span>
                                            }) : null}</p>
                                            <div className="content">
                                                <Row>
                                                    <Col span={8}>发布机构：</Col>
                                                    <Col span={13}>{item.organization_label_str}</Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}>扶持金额：</Col>
                                                    <Col span={13}>{item.money}万元</Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}>发布日期：</Col>
                                                    <Col span={13}>{item.release_date}</Col>
                                                </Row>
                                            </div>
                                            <p className="button-center" onClick={()=>this.showModal(idx)}><Button type="primary" shape="round" >立即申报</Button></p>
                                        </div>
                                    </Col>
                                }) : <Col span={24} className="no-data">暂无数据！</Col>}
                            </Row>
                            </div>
                            {/*<div className="application-more max-weight-box"><a href="/declarationItem">查看更多</a></div>*/}
                        </div>
                    </div>
                </div>
                <div className="index-footer-box">
                    <div className="max-weight-box">
                        <p className="title">建议使用1920×768分辨率 IE9.0及以上版本浏览</p>
                        <p>联系电话：023-61739999<br />
                            ICP备案：渝ICP备19013939号-1
                        </p>
                    </div>
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
                    <p>本项目采用以下申报方式：</p>
                    {idx!=undefined && dataList[idx].declare_net ?
                    <Row>
                        <Col span={8}>1.点击进入网上申报：</Col>
                        <Col span={16}>
                            <a href={dataList[idx].declare_net.indexOf("http") == -1 ? "http://"+dataList[idx].declare_net.trim() : dataList[idx].declare_net} target="_blank">{idx!=undefined ? dataList[idx].declare_net : null}</a>
                            {idx!=undefined ? <a className="model-button" href={dataList[idx].declare_net.indexOf("http") == -1 ? "http://"+dataList[idx].declare_net.trim() : dataList[idx].declare_net} target="_blank" style={{marginTop:0}}>网上申报</a> : null}
                        </Col>
                    </Row>
                        : null}
                    {idx!=undefined && dataList[idx].post_material ?
                    <Row>
                        <Col span={8}>{idx!=undefined && dataList[idx].declare_net ? "2" : "1"}.纸质材料提交至</Col>
                        <Col span={16}>{idx!=undefined ? dataList[idx].post_material : null}
                        </Col>
                    </Row>
                        : null}
                </Modal>
            </div>
        );
    };
}

export default Home;