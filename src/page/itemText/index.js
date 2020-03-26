/**
 * 项目正文
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Breadcrumb,Descriptions,Tag,Button,Row,Col,Card,List} from 'antd';
// import { StarOutlined } from '@ant-design/icons';
import axios from 'axios';
import Top from './../../component/top';
// import Footer from "../../component/footer";
import './index.css';
import TitleTwo from "../../component/titleTwo";
import cookie from "react-cookies";
import {message} from "antd/lib/index";
import {request} from "../../utils/request";


class ItemText extends Component {
    constructor(props){
        super(props);
        this.state = {};
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
    //收藏
    onCollection = async (id) =>{
        const responest = await request('/common/my-company-collection', 'POST',{member_id:cookie.load('userId'),resource_id:id,resource_type:2}); //收藏
        const data = responest.data;
        if(data && data.success){
            message.success(data.msg);
            this.setState({
                isCollection:true
            });
        }else{
            message.error(data.msg);
        }
    }
    render() {
       // const {arrdown,labelTheme,labelType,labelProduct,arrProduct} = this.state;
        return (
            <div className="itemText-template">
                <Top />
                <div className="itemText-label-box max-weight-box">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>申报政策</Breadcrumb.Item>
                        <Breadcrumb.Item href="">项目正文</Breadcrumb.Item>
                    </Breadcrumb>
                   <div className="itemText-descriptions">
                    <Descriptions title="政策标题：重庆市发改委关于申报2018年XXXXX专项资金的通知">
                        <Descriptions.Item label="发布机构" span={2}><span title="重庆市发改委重庆市发改委重庆市发改委">重庆市发改委</span></Descriptions.Item>
                        <Descriptions.Item label="发文日期">2018-04-13</Descriptions.Item>
                        <Descriptions.Item label="政策标题" span={3}>重庆市发改委关于申报2018年XXXXX专项资金</Descriptions.Item>
                    </Descriptions>
                   </div>
                    <div className="collection-butn">
                        <Button type="primary">立即申报</Button>
                        <Button onClick={()=>this.onCollection()} type="primary" /*icon={<StarOutlined />}*/ className="ml15">收藏</Button>
                    </div>
                    <div className="itemText-infor item-box">
                        <TitleTwo name="基本信息" />
                        <table className="itemText-infor-table">
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
                    <div className="item-box">
                        <TitleTwo name="扶持方向" />
                    </div>
                    <div className="item-box">
                        <TitleTwo name="申报条件" />
                    </div>
                    <div className="item-box">
                        <TitleTwo name="扶持内容" />
                    </div>
                    <div className="item-box">
                        <TitleTwo name="联系方式" />
                    </div>
                    <div className="item-box">
                        <TitleTwo name="申报材料" />
                    </div>
                    <div className="item-box">
                        <TitleTwo name="申报流程" />
                    </div>
                    <div className="item-box">
                        <TitleTwo name="评审流程" />
                    </div>
                    <div className="item-box">
                        <TitleTwo name="附件" />
                    </div>
                </div>
                {/*<Footer/>*/}
            </div>
        );
    };
}

export default ItemText;