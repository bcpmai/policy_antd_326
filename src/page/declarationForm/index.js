/**
 * 申请书
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Breadcrumb,Button,Alert,Form,message,Input,Select,Row,Col} from 'antd';
// import { StarOutlined } from '@ant-design/icons';
import Top from './../../component/top';
import './index.css';
import TitleTwo from "../../component/titleTwo";
import cookie from "react-cookies";
import {request} from "../../utils/request";
import moment from "moment/moment";
import Form1 from './form1';
import Form2 from './form2';
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
const {Option} = Select;
class DeclarationForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:props.match.params ? props.match.params.id : null
        };
    }
    async componentDidMount() {
        this.getData(this.state.id);
    }
    getData = async(id) =>{
        const responest = await request('/declare/get-one/' + id, 'POST'); //详情
        this.setState({
            detailInfo:responest.data
        })

    }
    render() {
        const {detailInfo,id} = this.state;
        return (
            <div className="itemText-template">
                <Top />
                <div className="itemText-label-box max-weight-box">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>申报政策</Breadcrumb.Item>
                        <Breadcrumb.Item href="">项目正文</Breadcrumb.Item>
                        <Breadcrumb.Item href="">申请书填写</Breadcrumb.Item>
                    </Breadcrumb>
                    <Alert message="您正在申报政策，请如实填写以下信息！" type="warning" showIcon />
                    <div className="itemText-infor item-box">
                        <TitleTwo name="申报政策" />
                        <table className="itemText-infor-table">
                            <thead>
                            <tr>
                                <td style={{width:"200px"}}>项目标题</td>
                                <td>{detailInfo && detailInfo.declare.title}</td>
                            </tr>
                            </thead>
                            <tbody>
                            {detailInfo && detailInfo.declare.organization_label_str ?
                            <tr>
                                <td>发布机构</td>
                                <td>{detailInfo && detailInfo.declare.organization_label_str}</td>
                            </tr>:null}
                            {detailInfo && detailInfo.declare.declare_material ?
                            <tr>
                                <td>申报材料</td>
                                <td><div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_material }}></div></td>
                            </tr>:null}
                            {detailInfo && detailInfo.declare.declare_process ?
                            <tr>
                                <td>申报流程</td>
                                <td><div dangerouslySetInnerHTML = {{ __html:detailInfo.declare.declare_process }}></div></td>
                            </tr>
                                :null}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <TitleTwo name="申请书" />
                        {id == 59 ? <Form1/> : null}
                        {id == 60 ? <Form2/> : null}
                    </div>
                </div>
            </div>
        );
    };
}

export default DeclarationForm;