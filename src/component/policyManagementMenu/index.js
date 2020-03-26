import React, {Component} from 'react';
import {render} from 'react-dom';
import {Menu,Affix} from 'antd';
// import {
//     MailOutlined,
//     AppstoreOutlined,
//     SettingOutlined,
//     DesktopOutlined,
//     ProfileOutlined
//
// } from '@ant-design/icons';
import './index.css';


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


    render() {
        const { isLogin,current,menu} = this.state;
        return (
            <div className="policy-menu-component-template">
                <Affix>
                <Menu
                    style={{ width: 200 }}
                    defaultSelectedKeys={[current]}
                    defaultOpenKeys={[menu]}
                    mode="inline"
                >
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                          {/*<MailOutlined />*/}
                                          <span>政策管理</span>
                                        </span>
                        }
                    >
                        <Menu.Item key="policyList"><a href="/policyList" >政策列表</a></Menu.Item>
                        <Menu.Item key="collectionList"><a href="/collectionList">采集列表</a></Menu.Item>
                    </SubMenu>
                    <Menu.Item
                        key="projectList"
                        className="project-management">
                            <a href="/projectList">
                                {/*<ProfileOutlined />*/}
                                项目管理</a>
                    </Menu.Item>
                    <SubMenu
                        key="systemManagement"
                        title={
                            <span>
                                          {/*<DesktopOutlined />*/}
                                          <span>系统管理</span>
                                        </span>
                        }
                    >
                        <Menu.Item key="roleManagement"><a href="/roleManagement">角色权限</a></Menu.Item>
                        <Menu.Item key="enterprise"><a href="/enterprise">企业用户</a></Menu.Item>
                        <Menu.Item key="policyUser"><a href="/policyUser">政府用户</a></Menu.Item>
                        <Menu.Item key="labelManage"><a href="/labelManage">标签管理</a></Menu.Item>
                        <Menu.Item key="carouselManage"><a href="/carouselManage">轮播图管理</a></Menu.Item>
                        <Menu.Item key="accountManagement"><a href="/accountManagement">账户管理</a></Menu.Item>
                    </SubMenu>
                </Menu>
                </Affix>
            </div>
        );
    };
}

export default PolicyMenu;