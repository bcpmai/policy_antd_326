import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link } from "react-router-dom";
import {Input, Button, Row, Col, Menu,Icon,Badge,Tooltip,Modal,message} from 'antd';
import cookie from 'react-cookies';
// import {
//     MailOutlined,
//     AppstoreOutlined,
//     SettingOutlined,
//     UserOutlined,
//     ExportOutlined
// } from '@ant-design/icons';
import './index.css';
import Logo from './img/logo.jpg';
import lingdang from './img/lingdang.png';
import Logo1 from './img/logo1.jpg';
import {request} from "../../utils/request";


const { SubMenu } = Menu;
const { Search } = Input;

class Top extends Component {
    constructor(props){
        super(props);
        const pathName = window.location.pathname;
        let current = "home";
        if(pathName) {
            switch (pathName.replace("/","")) {
                case "policyList":
                case "addPolicy":
                case "collectionList":
                case "login":
                case "register":
                case "forgotYour":
                case "projectList":
                case "roleManagement":
                case "enterprise":
                case "policyUser":
                case "labelManage":
                case "carouselManage":
                case "accountManagement":
                case "myCollection":
                case "information":
                case "matching":
                case "mySubscribe":
                    current = "login";
                        break;
                case "policyText":
                case "latestPolicy":
                    current = "latestPolicy";
                    break;
                case "itemText":
                case "declarationItem":
                    current = "declarationItem";
                    break;

            }
            if(pathName.indexOf("addPolicy") != -1 || pathName.indexOf("addProject") != -1 || pathName.indexOf("policyPreview") != -1 || pathName.indexOf("projectPreview") != -1 || pathName.indexOf("businessInformation") != -1){
                current = "login";
            }
            if(pathName.indexOf("policyText") != -1 || pathName.indexOf("latestPolicy") != -1){
                current = "latestPolicy";
            }
            if(pathName.indexOf("itemText") != -1 || pathName.indexOf("declarationItem") != -1){
                current = "declarationItem";
            }
        }
        this.state = {
            isLogin:cookie.load('userId'),
            userType:cookie.load('userType'),
            visible:false,
            loading:false,
            num:0,
            current
        }

        // PolicyList
        // AddPolicy
        // CollectionList
        // {
        //     latestPolicy
        //     information
        // }
        console.log(window.location.pathname ? window.location.pathname.replace("/","") : "home")
    }
    async componentWillMount() {
        const {current,isLogin} = this.state;
        const cHref = window.location.pathname.replace("/","");
        if(current == "login" && !isLogin && cHref!= "login" && cHref!= "register" && cHref!= "forgotYour"){
            window.location.href = '/login'
            // this.props.history.push('/login');
        }
        const res = await request('/common/get-message', 'POST',{member_id: cookie.load('userId')}); //是否收茂
        //console.log(res);
        if (res.status == 200 && res.data.num > 0){
            this.setState({
                num: res.data.num
            });
        }

    }

    handleClick = () => {

    }
    handleCancel = () => {
        this.setState({ visible: false });
    };
    removeCookie = (e) =>{
        e && e.preventDefault();
        cookie.remove('userId',{ path: '/' });
        cookie.remove('userName',{ path: '/' });
        cookie.remove('userType',{ path: '/' });
        window.location.href='/login';
    }
    showVisible = (e) =>{
        this.setState({ visible: true });
    }
    deleteCookie = async (e) =>{
        this.setState({ loading: true });
        const res = await request('/common/company-delete', 'POST',{member_id: cookie.load('userId')}); //是否收茂
        if (res.status == 200 && res.data.success){
            message.success(res.data.msg);
            setTimeout(()=>{
                this.setState({ loading: false, visible:false});
                this.removeCookie();
            },2000)
        }
    }
    serachLatestPolicy = (keyString) =>{
        window.location.href=`/latestPolicy/${keyString}`
    }

    render() {
        const { isLogin, current, userType,num,visible,loading} = this.state;
        return (
            <div className="top-component-template">
                <div className="welcome-box">
                <Row className="max-weight-box">
                    <Col span={6}><div className="top-name">
                        <img src={Logo} style={{width:"35px",marginRight:"10px",borderRadius: "5px"}} />
                        政策与企业匹配服务平台
                        {/*<img src={Logo1} style={{width:"50px",marginLeft:"5px",marginRight:"0px"}} />*/}
                        </div>
                    </Col>
                    <Col span={10}>
                        <Menu onClick={this.handleClick} selectedKeys={[current || "home"]} mode="horizontal" theme="dark">
                            <Menu.Item key="home">
                                <a href="/">首页</a>
                            </Menu.Item>
                            <Menu.Item key="latestPolicy">
                                <a href="/latestPolicy">最新政策</a>
                            </Menu.Item>
                            <Menu.Item key="declarationItem">
                                <a href="/declarationItem">申报政策</a>
                            </Menu.Item>
                            <Menu.Item key="login">
                                <a href={isLogin ? (userType == 1 ? "/matching" : "/policyList") : "/login"}>个人中心</a>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    {/*<Col span={3}>*/}
                        {/*/!*<div className="serach"><Search placeholder="请输入关键词" onSearch={this.serachLatestPolicy} enterButton /></div>*!/*/}
                    {/*</Col>*/}
                    <Col span={8} className="right-button">
                    {!isLogin ? <span>
                        <Link to="/login"><Button icon="user">登录</Button></Link>
                        {/*<u className="line-u">|</u>*/}
                        <Link to="/register"><Button icon="export" className="ml15">注册</Button></Link>
                    </span> : <span>
                        {num >0 && cookie.load("userType") == 1 ?<Tooltip placement="bottom" title={`即将到期的申报项目有${num}个，请完善信息进行并进行匹配`}><a href="/matching/true" style={{display:"inline-block",width:"50px",textAlign:"left",lineHeight:0}}><Badge count={num}><img src={lingdang} style={{width:18,marginRight:"10px"}} /></Badge></a></Tooltip>:null}<span title={cookie.load('userName')}><Icon type="user" style={{marginRight:"5px"}} />{cookie.load('userName').length > 10 ? cookie.load('userName').substr(0,10)+"..." : cookie.load('userName')}</span><Button icon="logout" className="ml15" onClick={this.removeCookie}>退出</Button><Button icon="logout" className="ml15" onClick={this.showVisible}>注销</Button></span>}
                    </Col>
                </Row>
                </div>
                {/*<div className={`logo-box ${current!="home" ? 'min-logo-box' : ''}`}>*/}
                {/*<div className='logo-box min-logo-box'>*/}
                    {/*<div className="max-weight-box">*/}
                        {/*<div className="logo">政策与企业匹配服务平台</div>*/}
                        {/*<div className="serach"><Search placeholder="请输入关键字查找申报政策" onSearch={this.serachLatestPolicy} enterButton /></div>*/}
                    {/*</div>*/}
                    {/*<div className='menu-box min-menu-box'>*/}
                        {/*<div className="menu-bg"></div>*/}
                        {/*<Menu onClick={this.handleClick} selectedKeys={[current || "home"]} mode="horizontal" theme="dark">*/}
                            {/*<Menu.Item key="home">*/}
                                {/*<a href="/">首页</a>*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item key="latestPolicy">*/}
                                {/*<a href="/latestPolicy">最新政策</a>*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item key="#">*/}
                                {/*<a href="#">申报政策</a>*/}
                            {/*</Menu.Item>*/}
                            {/*<Menu.Item key="login">*/}
                                {/*<a href={isLogin ? "/policyList" : "/login"}>个人中心</a>*/}
                            {/*</Menu.Item>*/}
                        {/*</Menu>*/}
                    {/*</div>*/}
                {/*</div>*/}
                <Modal
                    visible={visible}
                    title="Title"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.deleteCookie}>
                            确定
                        </Button>,
                    ]}
                >
                    <p>是否确定注销？注销后不可撤回！并无法登录</p>
                </Modal>
            </div>
        );
    };
}

export default Top;