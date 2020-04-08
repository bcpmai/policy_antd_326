import React, {Component} from 'react';
import {render} from 'react-dom';
import { Menu,Icon} from 'antd';
import './index.css';
import Icon1 from './img/icon1.png';
import Icon2 from './img/icon2.png';
import Icon3 from './img/icon3.png';
import Icon4 from './img/icon4.png';
import Icon5 from './img/icon5.png';
import Icon6 from './img/icon6.png';


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
                        <Menu.Item key="information"><a href="/information" ><img src={Icon1} />企业信息</a></Menu.Item>
                        <Menu.Item key="businessInformation"><a href="/businessInformation" ><img src={Icon2} />工商信息</a></Menu.Item>
                        <Menu.Item key="matching"><a href="/matching" ><img src={Icon3} />精准匹配</a></Menu.Item>
                        <Menu.Item key="mySubscribe"><a href="/mySubscribe" ><img src={Icon4} />我的订阅</a></Menu.Item>
                        <Menu.Item key="myCollection"><a href="/myCollection" ><img src={Icon5} />我的收藏</a></Menu.Item>
                        <Menu.Item key="accountManagement"><a href="/accountManagement" ><img src={Icon6} />账户管理</a></Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        );
    };
}

export default EnterpriseMenu;