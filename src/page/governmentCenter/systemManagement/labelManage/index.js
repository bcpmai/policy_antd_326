/**
 *  标签管理
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Input, Row, Col, Button, Breadcrumb, Modal, Form,Tag ,Tooltip } from 'antd';
import Top from '../../../../component/top/index';
import PolicyManagementMenu from "../../../../component/policyManagementMenu/index";
import Title from "../../../../component/title/index";
import './index.css';
// import { PlusOutlined } from '@ant-design/icons';
import {request} from "../../../../utils/request";

class LabelManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            themeData:[],
            typeData:[],
            belongData:[],
            industryData:[],
            inputVisible: false,
            inputValue: '',
        }
    }
    async componentDidMount() {
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const selectBelongData = await request('/common/get-all-belong-label', 'POST'); //所属层级
        const labelThemeData = await request('/common/get-all-policy-theme-label', 'POST'); //政策主题
        const labelTypeData = await request('/common/get-all-use-type-label', 'POST'); //应用类型



        const themData = labelThemeData.data;
        const typeData = labelTypeData.data;
        const belongData = selectBelongData.data;
        const industryData = selectIndustryData.data;

        if (themData && themData.success && typeData && themData.success && belongData && belongData.success && industryData && industryData.success) {
              this.setState({
                themeData: themData.data,
                typeData: typeData.data,
                belongData: belongData.data,
                industryData: industryData.data
            })
        }
    }
    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    saveInputRef = input => (this.input = input);
    render() {
        const { tags, inputVisible, inputValue ,themeData , typeData, belongData, industryData} = this.state;
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
                                            return <Tag key={tag.id} closable onClose={() => this.handleClose(tag.name)}>
                                                        {tag.name}
                                                    </Tag>
                                        })}
                                        {inputVisible && (
                                            <Input
                                                ref={this.saveInputRef}
                                                type="text"
                                                size="small"
                                                style={{ width: 78 }}
                                                value={inputValue}
                                                onChange={this.handleInputChange}
                                                onBlur={this.handleInputConfirm}
                                                onPressEnter={this.handleInputConfirm}
                                            />
                                        )}
                                        {!inputVisible && (
                                            <Tag className="site-tag-plus" onClick={this.showInput}>
                                                {/*<PlusOutlined />*/}
                                                添加标签
                                            </Tag>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="title">所属层级</td>
                                <td>
                                    {belongData.map((tag, index) => {
                                        return <Tag key={tag.id} closable onClose={() => this.handleClose(tag.name)}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {inputVisible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                        />
                                    )}
                                    {!inputVisible && (
                                        <Tag className="site-tag-plus" onClick={this.showInput}>
                                            {/*<PlusOutlined />*/}
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">政策主题</td>
                                <td>
                                    {themeData.map((tag, index) => {
                                        return <Tag key={tag.id} closable onClose={() => this.handleClose(tag.name)}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {inputVisible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                        />
                                    )}
                                    {!inputVisible && (
                                        <Tag className="site-tag-plus" onClick={this.showInput}>
                                            {/*<PlusOutlined />*/}
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">应用类型</td>
                                <td>
                                    {typeData.map((tag, index) => {
                                        return <Tag key={tag.id} closable onClose={() => this.handleClose(tag.name)}>
                                            {tag.name}
                                        </Tag>
                                    })}
                                    {inputVisible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                        />
                                    )}
                                    {!inputVisible && (
                                        <Tag className="site-tag-plus" onClick={this.showInput}>
                                            {/*<PlusOutlined />*/}
                                            添加标签
                                        </Tag>
                                    )}
                                </td>
                            </tr>
                        </table>
                    </Col>
                </Row>
                </div>
            </div>
        );
    };
}

export default LabelManage;