import React, {Component} from 'react';
import {render} from 'react-dom';
import { Menu,Icon} from 'antd';
// import {
//     MailOutlined,
//     AppstoreOutlined,
//     SettingOutlined,
//     BankOutlined
// } from '@ant-design/icons';
import './index.css';
import BusinessInformation from "../../page/enterpriseCenter/businessInformation";


const { SubMenu } = Menu;

class EnterpriseMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin:false,
            current:props.menuKey || "information"
        }
    }

    handleClick = () => {

    }

    render() {
        const { isLogin,current } = this.state;
        console.log(current)
        return (
            <div className="enterpriseMenu-component-template">
                <Menu
                    style={{ width: 180 }}
                    defaultSelectedKeys={[current]}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                >
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                          {/*<BankOutlined />*/}
                                         <Icon type="bank" />
                                          <span>个人中心</span>
                                        </span>
                        }
                    >
                        <Menu.Item key="information"><a href="/information" >企业信息</a></Menu.Item>
                        <Menu.Item key="businessInformation"><a href="/businessInformation" >工商信息</a></Menu.Item>
                        <Menu.Item key="matching"><a href="/matching" >精准匹配</a></Menu.Item>
                        <Menu.Item key="mySubscribe"><a href="/mySubscribe" >我的订阅</a></Menu.Item>
                        <Menu.Item key="myCollection"><a href="/myCollection" >我的收藏</a></Menu.Item>
                        <Menu.Item key="accountManagement"><a href="/accountManagement" >账户管理</a></Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        );
    };
}

export default EnterpriseMenu;