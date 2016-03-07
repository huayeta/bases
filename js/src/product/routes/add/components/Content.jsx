import React from 'react';
import {Tab,Tabs,TabList,TabPanel} from 'react-tabs';
import Ckeditor from 'common/Ckeditor.jsx';

export default class Content extends React.Component {
    constructor() {
        super();
    }
    render(){
        const {content,content1,content2,content3}=this.props;
        return(
            <Tabs className="m-tabs" forceRenderTabPanel={true}>
                <TabList className="opt f-cb">
                    <Tab>商品详情</Tab>
                    <Tab>规格参数</Tab>
                    <Tab>包装清单</Tab>
                    <Tab>售后承诺</Tab>
                </TabList>
                <TabPanel className="editor"><Ckeditor name="arg[content]" defaultValue={content} /></TabPanel>
                <TabPanel className="editor"><Ckeditor name="arg[content1]" defaultValue={content1} /></TabPanel>
                <TabPanel className="editor"><Ckeditor name="arg[content2]" defaultValue={content2} /></TabPanel>
                <TabPanel className="editor"><Ckeditor name="arg[content3]" defaultValue={content3} /></TabPanel>
            </Tabs>
        )
    }
}

Content.propTypes={
    content:React.PropTypes.string.isRequired,
    content1:React.PropTypes.string.isRequired,
    content2:React.PropTypes.string.isRequired,
    content3:React.PropTypes.string.isRequired,
}
