import React from 'react';
import {render} from 'react-dom';
import Picture from '../add/components/Picture.jsx';
import Content from '../add/components/Content.jsx';
import {dialogEditor} from 'common/artDialog.es6';

class  EditorApp extends React.Component {
    constructor() {
        super();
        this.config={
            'picture':['','','',''],
            video:'',
            content:'',
            content1:'',
            content2:'',
            content3:'',
        }
    }
    componentDidMount(){
        dialogEditor({
            width:750,
            height:630,
        })
    }
    render(){
        const config=this.config;
        return(
            <div className="f-pd20">
                <div className="m-tabform f-mb10">
                    <table>
                        <thead><tr><th width="88"></th><td></td></tr></thead>
                        <tbody>
                            <tr>
                                <th>
                                    商品名称：
                                </th>
                                <td>
                                    <input type="text" className="u-txt" size="60" />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    商品广告词：
                                </th>
                                <td>
                                    <input type="text" className="u-txt" size="60" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Picture picture={config.picture} video={config.video} />
                <Content content={config.content} content1={config.content1} content2={config.content2} content3={config.content3} />
            </div>
        )
    }
}

render(<EditorApp />,document.getElementById('app'));
