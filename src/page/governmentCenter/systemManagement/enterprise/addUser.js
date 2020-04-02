/**
 *  添加用户
 * */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Input, Row, Col, Button, Form, Modal, Select, message} from 'antd';
import './index.css';
import {request} from "../../../../utils/request";

const {Option} = Select;
const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record:props.record
        }
    }

    async componentDidMount() {
        const selectIndustryData = await request('/common/get-all-industry-label', 'POST'); //所属行业
        const industryData = selectIndustryData.data;
        if (industryData && industryData.success) {
            this.setState({
                industryData: industryData.data
            })
        }
    }

    handleOk = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values, "values")
                let url = '/company/register';
                if (this.state.record) {
                    url = '/company/update_info';
                    values.username = this.state.record.username;
                    values.member_id = this.state.record.id;
                }
                const deleteData = await request(url, 'POST', values); //添加用户
                if (deleteData.data && deleteData.data.success) {
                    message.success(deleteData.data.msg);
                    this.props.callback();
                    // this.setState({
                    //     addVisible: false,
                    //     record: null
                    // });
                    // setTimeout(() => {
                    //     this.getTableData(this.state.formValues);
                    // }, 1000);
                } else {
                    message.error(deleteData.data.msg);
                }
            }
        });
    };

    render() {
        const {industryData, record} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Modal
                    title={record ? "修改角色" : "添加角色"}
                    visible
                    onOk={this.handleOk}
                    width={550}
                    onCancel={(type) => this.props.handleCancel("addVisible")}
                    footer={[
                        <Button key="back" onClick={this.handleOk}>
                            确认
                        </Button>,
                        <Button key="submit" type="primary" onClick={(type) => this.props.handleCancel("addVisible")}>
                            取消
                        </Button>
                    ]}
                >
                    <Form ref="form" {...layout} name="dynamic_rule">
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="用户名">
                                    {record && record.username ?
                                        <span>{record.username}</span> : getFieldDecorator('username', {
                                            rules: [{
                                                required: true,
                                                message: '请输入用户名'
                                            },{
                                                validator:
                                                    async (rule, value, callback) => {
                                                        console.log(rule, value, callback);
                                                        const responest = await request('/common/check-user', 'POST', {username: value});
                                                        console.log(responest)
                                                        if (responest.status == 200 && responest.data.success) {
                                                            return Promise.reject(responest.data.msg);
                                                        }
                                                        return Promise.resolve();
                                                    }
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="手机号">
                                    {getFieldDecorator('mobile', {
                                        initialValue:record ? record.mobile : undefined,
                                        rules: [{
                                            required: true,
                                            message: '请输入手机号'
                                        }, {
                                            validator:
                                                async (rule, value, callback) => {
                                                    if (value != record.mobile) {
                                                        const responest = await request('/common/check-mobile', 'POST', {mobile: value});
                                                        if (responest.status == 200 && responest.data.success) {
                                                            return Promise.reject(responest.data.msg);
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.resolve();
                                                }
                                        }]
                                    })(
                                        <Input/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="企业名称" name="company_name">
                                    {getFieldDecorator('company_name', {
                                        initialValue:record ? record.company_name : undefined,
                                        rules: [{
                                            required: true,
                                            message: '请输入企业名称'
                                        }]
                                    })(
                                        <Input/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="统一社会信用代码">
                                    {getFieldDecorator('code', {
                                        initialValue:record ? record.code : undefined,
                                        rules: [{
                                            required: true,
                                            message: '请输入统一社会信用代码'
                                        }]
                                    })(
                                        <Input/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="所属行业">
                                    {getFieldDecorator('industry_label_id', {
                                        initialValue:record ? record.industry_label_id : undefined,
                                        rules: [{
                                            required: true,
                                            message: '请选择所属行业'
                                        }]
                                    })(
                                        <Select
                                            style={{width: '100%'}}
                                            onChange={this.handleChange}
                                        >
                                            {industryData ? industryData.map((item, idx) => <Option value={item.id}
                                                                                                    key={item.id}>{item.name}</Option>) : ''}

                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className="mt10">
                            <Col span={23}>
                                <Form.Item label="初始密码" name="password">
                                    {getFieldDecorator('password', {
                                        rules: [{
                                            required: true,
                                            message: '请输入初始密码'
                                        }]
                                    })(
                                        <Input.Password/>
                                    )}

                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    };
}

export default Form.create()(AddUser);