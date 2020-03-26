/**
 * 首页
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Carousel, Row, Col, Button, Divider, Card, message, Modal } from 'antd';
// import { BarsOutlined,SearchOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import {request} from './../../utils/request';
import Top from './../../component/top';
import Label from "../../component/label";
import policyIcon from "./img/policy-icon.jpg";
import projectIcon from "./img/project-icon.jpg";
import bannerImg from "./img/WechatIMG9515.jpeg";
import bannerImg1 from "./img/WechatIMG9516.jpeg";

import './index.css';


const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 10},
};

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


class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            label:[
                {
                    title:"政策主题",
                    item:["综合政策","财税支持","融资促进","市场开拓","服务措施","权益保护","创业扶持","创新支持","监督检查"]
                },
                {
                    title:"应用类型",
                    item:["规范规划类","资金支持类","税费减免类","资质认定类","行业管制类"]
                },
                {
                    title:"所属行业",
                    item:["A.农、林、牧、渔业","B.采矿业","C.制造业","D.电力、热力、燃气及水生产和供应业","E.建筑业","F.批发和零售业","G.交通运输、仓储和邮政业","H.住宿和餐饮业", "I.信息传输、软件和信息技术服务业","J.金融业","K.房地产业","L.租赁和商务服务业","M.科学研究和技术服务业","N.水利、环境和公共设施管理业", "O.居民服务、修理和其他服务业","P.教育","Q.卫生和社会工作","R.文化、体育和娱乐业","S.公共管理、社会保障和社会组织","T.国际组织"]
                }
            ]
        }
    }
    async componentWillMount() {
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业


        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && industryData && industryData.success) {
            const allItem = {id: 0,name: "全部"};
            themData.data.unshift(allItem);
            typeData.data.unshift(allItem);
            industryData.data.unshift(allItem);
            this.setState({
                label:[{
                    title: "政策主题：",
                    item: themData.data
                },
                {
                    title: "应用类型：",
                    item: typeData.data
                },
                {
                    title:"所属行业：",
                    item: industryData.data
                }]
            })
        }
    }
    goDeclarePush = () =>{
        if(cookie.load('userId')){
            this.props.history.push('/declarePush');
        }else{
            message.warning('请先登录');
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
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
    };
    render() {
        const { label } = this.state;
        return (
            <div className="index-template">
                <Top />
                <div className="index-box">
                    <div className="carousel-box">
                        <Carousel autoplay>
                            <div>
                                <img src={bannerImg1} />
                            </div>
                            {/*<div>*/}
                                {/*<img src={bannerImg} />*/}
                            {/*</div>*/}
                        </Carousel>
                    </div>
                    {/*<div className="max-weight-box">*/}
                    {/*<Row className="item-box" gutter={16}>*/}
                        {/*<Col span={11} className="item-policy">*/}
                            {/*<div className="item-policy-box">*/}
                                {/*<Link to="/latestPolicy">*/}
                                    {/*<img src={policyIcon}></img>*/}
                                    {/*<span>找政策</span>*/}
                                {/*</Link>*/}
                            {/*</div>*/}
                        {/*</Col>*/}
                        {/*<Col span={1}></Col>*/}
                        {/*<Col span={11} className="item-project">*/}
                            {/*<div className="item-project-box">*/}
                                {/*<Link to="/declarationItem">*/}
                                    {/*<img src={projectIcon}></img>*/}
                                    {/*<span>报项目</span>*/}
                                {/*</Link>*/}
                            {/*</div>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                    {/*</div>*/}
                    <div className="matching-box">
                        {/*<Divider>快速匹配</Divider>*/}
                        {/*<div className="matching-divider">*/}
                            {/*<div className="max-weight-box">*/}
                                {/*<span className="title">快速匹配</span>*/}
                                {/*<p className="desc">请选择您感兴趣的标签，智能匹配相关申报政策。</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="matching-divider-arr"><span className="arr"></span></div>*/}
                        <div className="width-min-title">
                            <Divider>快速匹配</Divider>
                        </div>
                        <div className="matching-label-box max-weight-box">
                            <p className="desc">请选择您感兴趣的标签，智能匹配相关申报政策。</p>
                            <div>
                                {label.map((labelItem,labelIdx)=>{
                                    return <Label span={{title:3,label:21}} onClick={()=>this.labelChange()} title={labelItem.title} item={labelItem.item} key={labelIdx} />
                                })}
                                <div className="matching-button">
                                    <Button type="primary" shape="round" size="large" onClick={this.goDeclarePush}>
                                        立即匹配
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="application-box">
                            {/*<div className="matching-divider">*/}
                                {/*<div className="max-weight-box">*/}
                                    {/*<span className="title">申报政策</span>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="matching-divider-arr"><span className="arr"></span></div>*/}
                            <div className="width-min-title"><Divider>申报政策</Divider></div>
                            <div className="max-weight-box">
                            <Row className="application-item-box">
                                <Col span={8}>
                                    <div className="item">
                                        <span className="tips">资金</span>
                                        <p className="title"><a href="">关于应对新型冠状病毒肺炎疫情设立渝北区抗击疫情转贷应急周转资金的实施细则</a></p>
                                        <span className="line"></span>
                                        <p className="time">2019-03-15</p>
                                        <div className="desc">
                                            <p><strong>扶持内容：</strong><span>（一）企业申请的单笔转贷应急周转资金额度原则上不超过1000万元（含）。</span></p>
                                            <p>（二）转贷应急周转资金使用时间原则上控制在20个工作日以内。资金使用费按每个工作日0.1‰计算收取，收费不满1个工作日的按1个工作日计算收取。若20个工作日还不能······</p>
                                        </div>
                                        <p className="button-center" onClick={this.showModal}><Button type="primary" shape="round" >立即申报</Button></p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="tips">资金</span>
                                        <p className="title"><a href="">关于应对新型冠状病毒肺炎疫情设立渝北区抗击疫情转贷应急周转资金的实施细则</a></p>
                                        <span className="line"></span>
                                        <p className="time">2019-03-15</p>
                                        <div className="desc">
                                            <p><strong>扶持内容：</strong><span>（一）企业申请的单笔转贷应急周转资金额度原则上不超过1000万元（含）。</span></p>
                                            <p>（二）转贷应急周转资金使用时间原则上控制在20个工作日以内。资金使用费按每个工作日0.1‰计算收取，收费不满1个工作日的按1个工作日计算收取。若20个工作日还不能······</p>
                                        </div>
                                        <p className="button-center" onClick={this.showModal}><Button type="primary" shape="round" >立即申报</Button></p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="tips">资金</span>
                                        <p className="title"><a href="">关于应对新型冠状病毒肺炎疫情设立渝北区抗击疫情转贷应急周转资金的实施细则</a></p>
                                        <span className="line"></span>
                                        <p className="time">2019-03-15</p>
                                        <div className="desc">
                                            <p><strong>扶持内容：</strong><span>（一）企业申请的单笔转贷应急周转资金额度原则上不超过1000万元（含）。</span></p>
                                            <p>（二）转贷应急周转资金使用时间原则上控制在20个工作日以内。资金使用费按每个工作日0.1‰计算收取，收费不满1个工作日的按1个工作日计算收取。若20个工作日还不能······</p>
                                        </div>
                                        <p className="button-center" onClick={this.showModal}><Button type="primary" shape="round" >立即申报</Button></p>
                                    </div>
                                </Col>
                            </Row>
                            </div>
                            <div className="application-more max-weight-box"><a href="/declarationItem">查看更多</a></div>
                        </div>
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
                    <p>该项目网上申报后，需提交纸质材料。</p>
                    <Row>
                        <Col span={8}>1.点击进入网上申报：</Col>
                        <Col span={16}>
                            <span>http://web.js.policy.com</span>
                            <Button className="model-button" key="submit" onClick={()=>{window.open('http://web.js.policy.com/declarationItem')}}>网上申报</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>2.纸质材料提交至</Col>
                        <Col span={16}>重庆市九龙坡区人民政府<br />王先生  18809870987
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    };
}

export default Register;