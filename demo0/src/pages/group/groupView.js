import React from 'react'
import router from 'umi/router';
// import Grouplist from '@/components/Grouplist'
import { connect } from 'dva';

class groupView extends React.Component{
    componentWillMount(){
        const search = location.search.split('=')[1]
        this.setState({
            key: search
        })
    }
    state={
        key: ''
    }
    render(){
        const dataSource = this.props.groupgames.dataSource
        let detailData = {}
        dataSource.map(item=>{
            item['key']===this.state.key ? detailData = item : null
        })

        return(
            <div>
                hahahha
            </div>
        )
    }
}

export default  connect(({groupgames})=>({groupgames}))(groupView)