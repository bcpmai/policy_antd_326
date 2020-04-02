/**
 * 申报推送
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Table, Tag, Button, Modal, Row, Col } from 'antd';
import Title from "./../../component/title/index";
import Top from './../../component/top';
import './index.css';
import {request} from "../../utils/request";

class DeclarePush extends Component {
    constructor(props){
        super(props);
        console.log(props,"props");
        this.state = {
            tableData:[]
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
                dataIndex: 'use_type_label_str',
                key: 'use_type_label_str',
            },
            {
                title: '发布机构',
                dataIndex: 'organization_label_str',
                key: 'organization_label_str',
            },
            {
                title: '扶持金额',
                key: 'money',
                dataIndex: 'money'
            },
            {
                title: '申报日期',
                key: 'created_date',
                dataIndex: 'created_date'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (<span><a onClick={()=>this.showModal(record)}>立即申报</a></span>),
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
    componentDidMount() {
        this.getTableData();
    }
    getTableData = async (values) =>{
        const {keyString} = this.props.match.params;
        const [organization_label_list,use_type_list,industry_label_list] = keyString.split("&");
        console.log(organization_label_list,use_type_list,industry_label_list,keyString.split("&"));
        const tableData = await request('/declare/list', 'POST', {
            organization_label_list:organization_label_list!=-1 ? organization_label_list.split(",") : undefined,
            use_type_list:use_type_list != -1 ? use_type_list.split(",") : undefined,
            d_industry_label_list:industry_label_list != -1 ? [industry_label_list] : undefined,
            ...values
        });

        if(tableData.status == 200){
            this.setState({
                tableData: tableData.data,
                formValues:values
            });
        }


        // let list = responest.data.result;
        // list.map((item, idx) => {
        //     list[idx].use_type_label_str = item.use_type_label_str.split(",");
        // })
        // this.setState({
        //     tableData: list
        // })

    }
    showModal = (record) => {
        this.setState({
            visible: true,
            record
        });
    }

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    onShowSizeChange = (current, pageSize) =>{
        console.log(current, pageSize);
        let {formValues={}} = this.state;
        formValues.page = current;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }

    onPaginChange = (page, pageSize) =>{
        console.log(page, pageSize);
        let {formValues={}} = this.state;
        formValues.page = page;
        formValues.max_line = pageSize;
        this.getTableData(formValues);
    }
    render() {
        const {formValues,tableData,record} = this.state;
        const pagination = {
            current:formValues && formValues.page ? formValues.page : 1,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize:20,
            total:tableData.sum || 0,
            showTotal:(total, range) => `共 ${tableData.page_num} 页 总计 ${tableData.sum} 条政策`,
            pageSizeOptions: ['10', '20', '30', '50', '100', '150'],
            onShowSizeChange: this.onShowSizeChange,
            onChange:this.onPaginChange
        }
        return (
            <div className="declarePush-template">
                <Top />
                <div className="declarePush-form-box max-weight-box">
                    <Title name="申报推送" />
                    <div className="declarePush-title-h1">根据您所填信息，您可申报以下项目</div>
                    {tableData ? <Table columns={this.columns} dataSource={tableData.result} pagination={pagination} rowKey="id" /> : null}
                    {/*<Table columns={this.columns} dataSource={this.data} pagination={this.pagination} />*/}
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
                            <span>{record!=undefined ? record.declare_net : null}</span>
                            {record!=undefined ? <a className="model-button" href={record.declare_net} target="_blank">网上申报</a> : null}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>2.纸质材料提交至</Col>
                        <Col span={16}>{record!=undefined ? record.post_material : null}
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    };
}

export default DeclarePush;