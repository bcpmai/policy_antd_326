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
    labelCol: {span: 6},
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
    }

    handleOk = async (e) => {
        e.preventDefault();
        const _this = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values, "values")
                let url = '/admin/register';
                if(this.state.record){
                    url = '/admin/update_user';
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
                                <Form.Item label="姓名">
                                    {getFieldDecorator('real_name', {
                                        initialValue:record ? record.real_name : undefined
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
                                                        console.log(rule, value, callback);
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