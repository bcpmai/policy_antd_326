import React from 'react';
import ReactDOM from 'react-dom';
import "core-js/es/array";
import "core-js/proposals/math-extensions";
import zhCN from 'antd/es/locale/zh_CN';
import './index.css';
import 'core-js/es';
import 'react-app-polyfill/ie9';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Index from "./page/index/index.js"; //首页
import Login from "./page/login/index.js"; //登录
import Register from "./page/register/index.js"; //注册
import ForgotYour from "./page/forgotYour/index.js"; //找回密码
import DeclarePush from "./page/declarePush/index.js"; //申报推送
import LatestPolicy from "./page/latestPolicy/index.js"; //最新政策
import PolicyText from "./page/policyText/index.js"; //政策正文
import Information from "./page/enterpriseCenter/information/index.js"; //企业信息
import AccountManagement from "./page/enterpriseCenter/accountManagement/index.js"; //账户管理
import PolicyList from "./page/governmentCenter/policyManagement/policyList/index.js"; //政策列表
import AddPolicy from "./page/governmentCenter/policyManagement/addPolicy/index.js"; //添加政策
import PolicyPreview from "./page/governmentCenter/policyManagement/policyPreview/index.js"; //政策预览
import PolicyUser from "./page/governmentCenter/systemManagement/policyUser/index.js"; //政府用户

import DeclarationItem from "./page/declarationItem/index.js"; //申报项目
import ItemText from "./page/itemText/index.js"; //项目正文
import Matching from "./page/enterpriseCenter/matching/index.js"; //精准匹配
import MySubscribe from "./page/enterpriseCenter/mySubscribe/index.js"; //我的订阅
import MyCollection from "./page/enterpriseCenter/myCollection/index.js"; //我的收藏
import CollectionList from "./page/governmentCenter/policyManagement/collectionList/index.js"; //采集列表


import ProjectList from "./page/governmentCenter/projectManagement/projectList/index.js"; //项目列表
import AddProject from "./page/governmentCenter/projectManagement/addProject/index.js"; //添加项目
import ProjectPreview from "./page/governmentCenter/projectManagement/projectPreview/index.js"; //项目预览

import RoleManagement from "./page/governmentCenter/systemManagement/roleManagement/index.js"; //角色权限
import Enterprise from "./page/governmentCenter/systemManagement/enterprise/index.js"; //企业用户
import LabelManage from "./page/governmentCenter/systemManagement/labelManage/index.js"; //标签管理
import CarouselManage from "./page/governmentCenter/systemManagement/carouselManage/index.js"; //轮播图管理



import Footer from "./component/footer";



ReactDOM.render(
    <Router>
        <ConfigProvider locale={zhCN}>
        <div className="main-box" id="main">
            <Route exact path="/" component={Index} />
            <Route exact path="/home" component={App} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgotYour" component={ForgotYour} />
            <Route exact path="/declarePush/:keyString?" component={DeclarePush} />
            <Route exact path="/latestPolicy/:keyString?" component={LatestPolicy} />
            <Route exact path="/policyText/:id" component={PolicyText} />
            <Route exact path="/information" component={Information} />
            <Route exact path="/accountManagement" component={AccountManagement} />
            <Route exact path="/policyList" component={PolicyList} />
            <Route exact path="/addPolicy/:id?" component={AddPolicy} />
            <Route exact path="/policyPreview/:id" component={PolicyPreview} />
            <Route exact path="/policyUser" component={PolicyUser} />
            <Route exact path="/declarationItem" component={DeclarationItem} />
            <Route exact path="/itemText/:id" component={ItemText} />
            <Route exact path="/matching" component={Matching} />
            <Route exact path="/mySubscribe" component={MySubscribe} />
            <Route exact path="/myCollection" component={MyCollection} />
            <Route exact path="/collectionList" component={CollectionList} />
            <Route exact path="/projectList" component={ProjectList} />
            <Route exact path="/addProject/:id?" component={AddProject} />
            <Route exact path="/projectPreview/:id" component={ProjectPreview} />
            <Route exact path="/roleManagement" component={RoleManagement} />
            <Route exact path="/enterprise" component={Enterprise} />
            <Route exact path="/labelManage" component={LabelManage} />
            <Route exact path="/carouselManage" component={CarouselManage} />


        </div>
            <Footer />
        </ConfigProvider>
    </Router>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
