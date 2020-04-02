/**
 *  标签管理
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Input, Row, Col, Button, Breadcrumb, Modal, Form,Tag ,Tooltip,Icon } from 'antd';
import Top from '../../../../component/top/index';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
// import { PlusOutlined } from '@ant-design/icons';
import {request} from "../../../../utils/request";
import {message} from "antd/lib/index";

class LabelManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            themeData:[],
            typeData:[],
            belongData:[],
            industryData:[],
            productData1:[],
            productData2:[],
            productData3:[],
            declareTypeData:[],
            inputVisible: false,
            inputValue: '',
        }
    }
    async componentDidMount() {
        this.getDefaultData();
    }
    getDefaultData = async() =>{
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const selectBelongData = await request('/common/get-all-belong-label', 'POST'); //所属层级
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型
        const declareLabelTypeData = await request('/common/get-all-use-type-declare-label', 'POST'); //应用类型


        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const declareTypeData = declareLabelTypeData.data;
        const belongData = selectBelongData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && belongData && belongData.success && industryData && industryData.success && declareTypeData && declareTypeData.success) {
            this.setState({
                themeData: themData.data,
                typeData: typeData.data,
                belongData: belongData.data,
                industryData: industryData.data,
                declareTypeData:declareTypeData.data
            })
        }
        this.belongChange(1);
        this.belongChange(2);
        this.belongChange(3);
    }
    belongChange = async (value) => {
        const labelProductData = await request('/common/get-all-organization-label', 'POST', {belong_id: value}); //发布机构
        const productData = labelProductData.data;
        if (productData && productData.success) {
            this.setState({
                ["productData"+value]: productData.data
            })
        }
    }

    showInput = (tagType) => {
        this.setState({ [tagType+"Visible"]: true }, () => this.input.focus());
    };

    handleInputChange = (e,key) => {
        this.setState({ [key+"inputValue"]: e.target.value });
    };
    showEditLabel =(tag,tagType)=>{
        this.setState({
            tagModal:true,
            tag,
            tagType
        })
    }
    hideEditLabel =()=>{
        this.setState({
            tagModal:false,
            tag:null,
            tagType:null
        })
    }
    /*添加*/
    handleInputConfirm = async(key) => {
        const inputValue = this.state[key+"inputValue"];
        //let { tags } = this.state;
        // if (inputValue && tags.indexOf(inputValue) === -1) {
        //     tags = [...tags, inputValue];
        // }
        console.log(inputValue);
        let url;
        switch (key){
            case "industry":
                url = '/common/add-industry-label';
                break;
            case "theme":
                url = '/common/add-policy-theme-label';
                break;
            case "type":
                url = '/common/add-use-type-label';
                break;
            case "declareType":
                url = '/common/add-use-type-declare-label';
                break;
            case "product1":
            case "product2":
            case "product3":
                url = '/common/add-organization-label';
                break;

        }
        let value;
        if(key == "product1"){
            value = {belong_id:1,organization: inputValue};
        }else if(key == "product2"){
            value = {belong_id:2,organization: inputValue};
        }else if(key == "product3"){
            value = {belong_id:3,organization: inputValue};
        }else{
            value = {value: inputValue};
        }
        if(inputValue) {
            const res = await request(url, 'POST',value);
            if (res.data && res.data.success) {
                message.success(res.data.msg);
                this.setState({
                    tagModal: false,
                    tag: null,
                    tagType: null
                });
                this.getDefaultData();
            } else {
                message.error(res.data.msg);
            }
            this.setState({
                [key + "Visible"]: false,
                [key + "inputValue"]: '',
            });
        }else{
            this.setState({
                tagModal: false,
                tag: null,
                tagType: null
            });
        }
    };
    /*编辑*/
    onModalSubmit = async(id) =>{
        const {tagType} = this.state;
        let url;
        switch (tagType){
            case "industry":
                url = '/common/update-industry-label';
                break;
            case "theme":
                url = '/common/update-policy-theme-label';
                break;
            case "type":
                url = '/common/update-use-type-label';
                break;
            case "declareType":
                url = '/common/update-use-type-declare-label';
                break;
            case "product1":
            case "product2":
            case "product3":
                url = '/common/update-organization-label';
                break;
        }
        let value = {id,[tagType == "product1" || tagType == "product2" || tagType == "product3" ? "organization" : "value"]:this.refs.tagInput.state.value};
        const res = await request(url, 'POST',value); //所属行业
        if(res.data && res.data.success){
            message.success(res.data.msg);
            this.setState({
                tagModal:false,
                tag:null,
                tagType:null
            });
            this.getDefaultData();
        }else{
            message.error(res.data.msg);
        }
    }
    /*删除*/
    onDeleteTag = async(removedTag,id,tagType) => {
        let url;
        switch (tagType){
            case "industry":
                url = '/common/del-industry-label';
                break;
            case "theme":
                url = '/common/del-policy-theme-label';
                break;
            case "type":
                url = '/common/del-use-type-label';
                break;
            case "declareType":
                url = '/common/del-use-type-declare-label';
                break;
            case "product1":
            case "product2":
            case "product3":
                url = '/common/del-organization-label';
                break;

        }

        const res = await request(url, 'POST',{id}); //所属行业
        if(res.data && res.data.success){
            message.success(res.data.msg);
        }else{
            message.error(res.data.msg);
        }
    };
    saveInputRef = input => (this.input = input);
    render() {
        const { tags,tagModal,tag, inputVisible, inputValue ,themeData , typeData, belongData,declareTypeData,productData1,productData2,productData3, industryData} = this.state;
        return (
            <div className="labelMange-template">
                <Top />
                <div className="policyUser-label-box max-weight-box">
                <Row>
                    <Col span={4}>
                        <PolicyManagementMenu menu="systemManagement" current="labelManage" />
                    </Col>
                    <Col span={20}>
                        <Title name="标签管理" />
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                            <Breadcrumb.Item href="">标签管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <table className="label-manage-table">
                            <tr>
                                <th>政策标签类别</th>
                                <th>枚举值<span>（提示：点击标签可进行修改）</span></th>
                            </tr>
                            <tr>
                                <td className="title">所属行业</td>
                                <td>
                                    <div>
                                        {industryData.map((tag, index) => {
                                            return <span className="tag-item-box">
                                                        {/*<Input className="tag-item-input" ref={"tagInput"+tag.id} defaultValue={tag.name} />*/}
                                                        {/*<Button onClick={()=>{console.log(this.refs["tagInput"+tag.id])}}>保存</Button>*/}
                                                        <Tag key={tag.id} onClick={()=>this.showEditLabel(tag,"industry")} closable onClose={() => this.onDeleteTag(tag.name,tag.id,"industry")}>
                                                                {tag.name}
                                                        </Tag>
                                                    </span>
                                        })}
                                        {this.state.industryVisible && (
                                            <Input
                                                ref={this.saveInputRef}
                                                type="text"
                                                size="small"
                                                style={{ width: 78 }}
                                                onChange={(value)=>this.handleInputChange(value,"industry")}
                                                onBlur={()=>this.handleInputConfirm("industry")}
                                                onPressEnter={()=>this.handleInputConfirm("industry")}
                                            />
                                        )}
                                        {!this.state.industryVisible && (
                                            <Tag className="site-tag-plus" onClick={()=>this.showInput("industry")}>
                                                {/*<PlusOutlined />*/}
                                                <Icon type="plus" />
                                                添加标签
                                            </Tag>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="title">政策主题</td>
                                <td>
                                    {themeData.map((tag, index) => {
                                        return <Tag key={tag.id} onClick={()=>this.showEditLabel(tag,"theme")} closable onClose={() => this.onDeleteTag(tag.name,tag.id,"theme")}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {this.state.themeVisible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            onChange={(value)=>this.handleInputChange(value,"theme")}
                                            onBlur={()=>this.handleInputConfirm("theme")}
                                            onPressEnter={()=>this.handleInputConfirm("theme")}
                                        />
                                    )}
                                    {!this.state.themeVisible && (
                                        <Tag className="site-tag-plus" onClick={()=>this.showInput("theme")}>
                                            {/*<PlusOutlined />*/}
                                            <Icon type="plus" />
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">政策应用类型</td>
                                <td>
                                    {typeData.map((tag, index) => {
                                        return <Tag key={tag.id} onClick={()=>this.showEditLabel(tag,"type")} closable onClose={() => this.onDeleteTag(tag.name,tag.id,"type")}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {this.state.typeVisible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            onChange={(value)=>this.handleInputChange(value,"type")}
                                            onBlur={()=>this.handleInputConfirm("type")}
                                            onPressEnter={()=>this.handleInputConfirm("type")}
                                        />
                                    )}
                                    {!this.state.typeVisible && (
                                        <Tag className="site-tag-plus" onClick={()=>this.showInput("type")}>
                                            {/*<PlusOutlined />*/}
                                            <Icon type="plus" />
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">项目应用类型</td>
                                <td>
                                    {declareTypeData.map((tag, index) => {
                                        return <Tag key={tag.id} onClick={()=>this.showEditLabel(tag,"declareType")} closable onClose={() => this.onDeleteTag(tag.name,tag.id,"declareType")}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {this.state.declareTypeVisible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            onChange={(value)=>this.handleInputChange(value,"declareType")}
                                            onBlur={()=>this.handleInputConfirm("declareType")}
                                            onPressEnter={()=>this.handleInputConfirm("declareType")}
                                        />
                                    )}
                                    {!this.state.declareTypeVisible && (
                                        <Tag className="site-tag-plus" onClick={()=>this.showInput("declareType")}>
                                            {/*<PlusOutlined />*/}
                                            <Icon type="plus" />
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td className="title">国家级</td>
                                <td>
                                    {productData1.map((tag, index) => {
                                        return <Tag key={tag.id} onClick={()=>this.showEditLabel(tag,"product1")} closable onClose={() => this.onDeleteTag(tag.name,tag.id,"product1")}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {this.state.product1Visible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            onChange={(value)=>this.handleInputChange(value,"product1")}
                                            onBlur={()=>this.handleInputConfirm("product1")}
                                            onPressEnter={()=>this.handleInputConfirm("product1")}
                                        />
                                    )}
                                    {!this.state.product1Visible && (
                                        <Tag className="site-tag-plus" onClick={()=>this.showInput("product1")}>
                                            {/*<PlusOutlined />*/}
                                            <Icon type="plus" />
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">重庆市级</td>
                                <td>
                                    {productData2.map((tag, index) => {
                                        return <Tag key={tag.id} onClick={()=>this.showEditLabel(tag,"product2")} closable onClose={() => this.onDeleteTag(tag.name,tag.id,"product2")}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {this.state.product2Visible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            onChange={(value)=>this.handleInputChange(value,"product2")}
                                            onBlur={()=>this.handleInputConfirm("product2")}
                                            onPressEnter={()=>this.handleInputConfirm("product2")}
                                        />
                                    )}
                                    {!this.state.product2Visible && (
                                        <Tag className="site-tag-plus" onClick={()=>this.showInput("product2")}>
                                            {/*<PlusOutlined />*/}
                                            <Icon type="plus" />
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">区县级</td>
                                <td>
                                    {productData3.map((tag, index) => {
                                        return <Tag key={tag.id} onClick={()=>this.showEditLabel(tag,"product3")} closable onClose={() => this.onDeleteTag(tag.name,tag.id,"product3")}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {this.state.product3Visible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            onChange={(value)=>this.handleInputChange(value,"product3")}
                                            onBlur={()=>this.handleInputConfirm("product3")}
                                            onPressEnter={()=>this.handleInputConfirm("product3")}
                                        />
                                    )}
                                    {!this.state.product3Visible && (
                                        <Tag className="site-tag-plus" onClick={()=>this.showInput("product3")}>
                                            {/*<PlusOutlined />*/}
                                            <Icon type="plus" />
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                    { tag ? <Modal
                    title="修改标签"
                    visible={this.state.tagModal}
                    onOk={this.handleOk}
                    width={500}
                    onCancel={()=>this.hideEditLabel()}
                    footer={[
                        <Button key="back" onClick={()=>this.onModalSubmit(tag.id)}>
                            保存
                        </Button>,
                        <Button key="submit" type="primary" onClick={()=>this.hideEditLabel()}>
                            取消
                        </Button>
                    ]}
                >
                    <Input className="tag-item-input" ref="tagInput" defaultValue={tag.name} />

                </Modal> : null}
                </div>
            </div>
        );
    };
}

export default LabelManage;