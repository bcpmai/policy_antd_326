/**
 * 申报推送
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Tag, Button, Modal, Row, Col } from 'antd';
import Title from "./../../component/title/index";
import Top from './../../component/top';
import './index.css';

class DeclarePush extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
        this.columns = [
            {
                title: '项目标题',
                dataIndex: 'title',
                key: 'title',
                render: text => <a href="/itemText">{text}</a>,
            },
            {
                title: '应用类型',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '发布机构',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '扶持金额',
                key: 'money',
                dataIndex: 'money'
            },
            {
                title: '申报日期',
                key: 'time',
                dataIndex: 'time'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (<span><a onClick={this.showModal}>立即申报</a></span>),
            },
        ];

        this.data = [
            {
                key: '1',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
            },
            {
                key: '2',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
            },
            {
                key: '3',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
            },
            {
                key: '4',
                title: '科技部国际合作司关于征集2020年度中国亚太经合组织合作基金项目的通知',
                type: "资金支持",
                address: '工业和信息化部',
                money: '10万',
                time:'2019-08-28至2020-03-14'
            }
        ];
        function onShowSizeChange(current, pageSize) {
            console.log(current, pageSize);
        }
        this.pagination = {
            showSizeChanger:true,
            defaultCurrent:1,
            total:500,
            pageSizeOptions:['10', '20', '30', '50','100','150'],
            onShowSizeChange:onShowSizeChange
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
        return (
            <div className="declarePush-template">
                <Top />
                <div className="declarePush-form-box max-weight-box">
                    <Title name="申报推送" />
                    <div className="declarePush-title-h1">根据您所填信息，您可申报以下项目</div>
                    <Table columns={this.columns} dataSource={this.data} pagination={this.pagination} />
                    <div className="declarePush-title-h1">完善企业信息，推送更精准</div>
                    <Button type="primary" onClick={()=>{window.location.href="/information"}}>精准匹配</Button>
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

export default DeclarePush;