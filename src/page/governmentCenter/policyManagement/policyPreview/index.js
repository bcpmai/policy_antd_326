/**
 * 政策预览
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
            policy:data.policy,
            resource_file_list:data.resource_file_list
        })
    }
    render() {
        const {policy,resource_file_list=[]} = this.state;
        const labelStr = policy.label_add_str ? policy.label_add_str.split(",") : null;
        return (
            <div className="policyPreview-template">
                <Top />
                <div className="policyPreview-label-box">
                    <div className="max-weight-box" style={{minHeight: "750px"}}>
                        <div className="max-weight-box"><Title name="政策预览" /></div>
                       <div className="policyPreview-descriptions">
                        <Descriptions>
                            <Descriptions.Item label="政策标题" span={3}><span>{policy.title}</span></Descriptions.Item>
                            <Descriptions.Item label="发布机构"><span title="重庆市发改委重庆市发改委重庆市发改委">重庆市发改委</span></Descriptions.Item>
                            <Descriptions.Item label="发文日期">{policy.release_date}</Descriptions.Item>
                            <Descriptions.Item label="发文字号">{policy.post_shop_name}</Descriptions.Item>
                            {labelStr ? <Descriptions.Item label="政策标签" span={3} className="labelAdd">
                                {labelStr.map((item,idx)=><Tag key={idx}>{item}</Tag>)}</Descriptions.Item> : null}
                            {labelStr ? <Descriptions.Item label="政策有效期">
                                {policy.life_date}
                            </Descriptions.Item> : null}
                        </Descriptions>
                       </div>
                        <div className="policyPreview-content-box">
                            <div className="policyPreview-content">
                                {/*<p className="policyPreview-content-title">云南省工业和信息化委关于申报2018年省级工业和信息化发展专项资金(技术改造方向)项目的通知</p>*/}
                                <div className="policyPreview-content-text">
                                    <div dangerouslySetInnerHTML = {{ __html:policy.content }}></div>
                                    <Row>
                                        <Col span={2}>附件：</Col>
                                        <Col>
                                            {resource_file_list ?
                                                resource_file_list.map((item,idx)=><p><a href={item.image_url} key={idx} target="_blank">{item.file_ori_name}</a></p>)
                                                : null}

                                        </Col>
                                    </Row>
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