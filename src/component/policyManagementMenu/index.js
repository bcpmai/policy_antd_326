import React, {Component} from 'react';
import {render} from 'react-dom';
import {Menu,Affix,Icon} from 'antd';
import './index.css';
import Icon1 from "./img/1_03.png";
import Icon2 from "./img/1_06.png";
import Icon3 from "./img/1_08.png";
import Icon4 from "./img/1_10.png";
import Icon5 from "./img/1_12.png";
import Icon6 from "./img/1_14.png";
import Icon7 from "./img/1_16.png";
import Icon8 from "./img/1_19.png";


const { SubMenu } = Menu;

class PolicyMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin:false,
            current:props.current || "policyList",
            menu:props.menu || 'sub1'
        }
    }

    handleClick = () => {

    }

    render() {
        const { isLogin,current,menu} = this.state;
        return (
            <div className="policy-menu-component-template">
                <Menu
                    defaultSelectedKeys={[current]}
                    defaultOpenKeys={["sub1","systemManagement"]}
                    mode="inline"
                >
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                          {/*<MailOutlined />*/}
                                          {/*<img src={Icon1} />*/}
                                            <Icon type="mail" />
                                          <span>政策管理</span>
                                        </span>
                        }
                    >
                        <Menu.Item key="policyList"><a href="/policyList" ><img src={Icon2} />政策列表</a></Menu.Item>
                        <Menu.Item key="collectionList"><a href="/collectionList"><img src={Icon3} />采集列表</a></Menu.Item>
                    </SubMenu>
                    <Menu.Item
                        key="projectList"
                        className="project-management">
                            <a href="/projectList" style={{fontSize:"15px",fontWeight:"bold"}}>
                                {/*<ProfileOutlined />*/}
                                <img src={Icon4} />
                                项目管理</a>
                    </Menu.Item>
                    <SubMenu
                        key="systemManagement"
                        title={
                            <span>
                                          {/*<DesktopOutlined />*/}
                                            <Icon type="desktop" />
                                          <span>系统管理</span>
                                        </span>
                        }
                    >
                        {/*<Menu.Item key="roleManagement"><a href="/roleManagement">角色权限</a></Menu.Item>*/}
                        <Menu.Item key="enterprise"><a href="/enterprise"><img src={Icon5} />企业用户</a></Menu.Item>
                        <Menu.Item key="policyUser"><a href="/policyUser"><img src={Icon6} />运营用户</a></Menu.Item>
                        <Menu.Item key="labelManage"><a href="/labelManage"><img src={Icon7} />标签管理</a></Menu.Item>
                        {/*<Menu.Item key="carouselManage"><a href="/carouselManage">轮播图管理</a></Menu.Item>*/}
                        <Menu.Item key="accountManagement"><a href="/accountManagement"><img src={Icon8} />账户管理</a></Menu.Item>
                        <Menu.Item key="carouselManage"><a href="/carouselManage"><img src={Icon8} />轮播图管理</a></Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        );
    };
}

export default PolicyMenu;