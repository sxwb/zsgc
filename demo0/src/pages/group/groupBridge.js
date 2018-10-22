import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import TableForm from '@/component/tableForm';
import { Button, Input, Table, AutoComplete, Popconfirm, } from 'antd';
import { log } from 'util';
class a extends Component {
    view = (record) => {
        router.push(`/group/groupView?id=${record.key}`)
    }
    render() {
        const view = this.view
        const columns = [
            {
                title: '小组名称',
                dataIndex: 'gameid',
            }, {
                title: '操作',
                dataIndex: 'action',
                edit: true,
                render: (text, record, context) => {
                    return (
                        <>
                            <a href="javascript:;" onClick={()=>this.view(record)} style={{ marginRight: '10px' }}>查看</a>
                        </>
                    )
                },
            }
        ]
        const list = [{
            label: '小组名称',
            input: {
                type: 'input'
            },
            attribute: 'gameid'
        }, {
            label: '名称',
            input: {
                type: 'date'
            },
            attribute: 'dates'
        }]
        return (
            <TableForm
                list={list}
                columns={columns}
                model={"groupgames"}
                formAddTitle={'添加小组'}
                addTitle={'添加组'}
                formEditTitle={'编辑组'}
                {...this.props} />
        )
    }
}
export default connect(({ login, odooData, groupgames }) => ({ login, odooData, groupgames }))(a)
// export default connect(({contactsList})=>({contactsList}))(Contacts)
