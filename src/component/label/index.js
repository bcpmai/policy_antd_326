import React, {Component} from 'react';
import {render} from 'react-dom';
import { Row, Col, Button, Tag} from 'antd';

import './index.css';

const { CheckableTag } = Tag;
class Label extends Component {
    constructor(props){
        super(props);
        this.state = {
            isRadio:props.isRadio || false,
            selectList:props.defalutValue
        }
        props.callback && props.callback(props.defalutValue);
    }

    handleChange = (checked) => {
        console.log(checked);
        this.setState({ checked });
    };

    onSelect = (selectId) =>{
        let selectList = selectId;
        if(!this.state.isRadio){
            selectList = this.state.selectList || [];
            const isSelectId = selectList.filter((id) => id == selectId);
            if(isSelectId.length){
                selectList = selectList.filter((id) => id !== selectId);
            }else{
                selectList.push(selectId);
            }
        }
        this.setState({
            selectList
        });
        this.props.callback && this.props.callback(selectList);
    }

    render() {
        const {title,item,className,span,defalutValue} = this.props;
        const {selectList,isRadio} = this.state;
        console.log(selectList);
        return (
            <div className="Label-component-template">
                <Row>
                    <Col span={span ? span.title : 2}>{title}</Col>
                    <Col span={span ? span.label : 22} className={`label-item-${className}`}>
                        {item.map((titem,tidx)=>{
                            let id;
                            if(selectList && !isRadio){
                                id = selectList.filter((sitem,sidx)=>sitem == titem.id).length;
                            }else if(isRadio && selectList && selectList == titem.id){
                                id = true;
                            }
                            if(defalutValue === null){
                                id=null;
                            }
                            return <Button shape="round" size="small" key={titem.id} onClick={()=>this.onSelect(titem.id)} className={id ? "select-button":""}>{titem.name}</Button>
                        })}

                    </Col>
                </Row>
            </div>
        );
    };
}

export default Label;