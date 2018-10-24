import React from 'react'
import { lookup } from '@/utils/tools';
import { log } from 'util';
export default (WrapTableForm) => {
    return class newTable extends React.Component {
        componentDidMount() {
            const { dispatch } = this.props;
            const model = this.props.model;
            dispatch({
                type: this.props.model + '/init'
            })
        }
        getdata(){
            const { ids } = this.props[this.props.model];
            const dataTree = 'res_' + this.props.model;
            const data = this.props.odooData[dataTree];
            const dataSource = lookup(ids, data);
            return dataSource
        }
        handleDelete = (id) => {
            this.props.dispatch({
                type: this.props.model + '/unlink',
                payload: { id: id }
            })
        }
        onSelectChange = (selectedRowKeys, selectedRows) => {
            this.props.dispatch({
                type: this.props.model + '/saveSelectedRowKeys',
                selectedRowKeys
            })
        }
        handleRemove() {
            const { selectedRowKeys: ids } = this.props[this.props.model]
            const { dispatch } = this.props;
            dispatch({
                type: this.props.model + '/moreDelete',
                payload: { ids: ids }
            })
        }
        changeVisible() {
            this.props.dispatch({
                type: this.props.model + '/changeVisible'
            })
        }
        edit = (record) => {
            this.props.dispatch({
                type: this.props.model + '/changeVisible',
                record
            })
        }
        editChange(newEdit) {
            const { ids } = this.props[this.props.model];
            const dataTree = 'res_' + this.props.model;
            const data = this.props.odooData[dataTree];
            const dataSource = lookup(ids, data);
            const index = dataSource.findIndex(item => newEdit.id === item.id);
            if (index > -1) {
                alert(1)
                this.props.dispatch({
                    type: this.props.model + '/rename',
                    payload: { id: newEdit.id, vals: newEdit }
                })
                this.props.dispatch({
                    type: this.props.model + '/clearEdit',
                    dataSource
                })
            } else {
                this.props.dispatch({
                    type: this.props.model + '/create',
                    payload: { vals: newEdit }
                })
                this.props.dispatch({
                    type: this.props.model + '/clearEdit',
                    dataSource
                })
            }
        }
        searchValueChange(value) {
            const model = this.props.model
            const searchData = this.props[model].dataSource.map((item) => item.gameid).filter((item) => item.indexOf(value) >= 0)
            this.props.dispatch({
                type: this.props.model + '/searchData',
                searchData
            })
        }
        search(value) {//.ant-select-dropdown-hidden控制是否显示
            const model = this.props.model
            const searchData = this.props.model.searchData
            var dataSource = this.props.model.dataSource.concat()
            if (searchData.length > 0) {
                dataSource = dataSource.filter((item) => searchData.find(ele => (item.gameid === ele) ? true : false))
            }
            //逻辑错误，缺少数据缓存。
            if (!value) {
                dataSource = this.data
            }
            this.props.dispatch({
                type: this.props.model + '/saveDataSource',
                dataSource
            })
        }
        render() {
            const methods = {
                handleDelete: this.handleDelete,
                onSelectChange: this.onSelectChange,
                handleRemove: this.handleRemove,
                changeVisible: this.changeVisible,
                edit: this.edit,
                editChange: this.editChange,
                searchValueChange: this.searchValueChange,
                search: this.search,
            }
            return (
                <WrapTableForm {...this.props} {...methods} />
            )
        }
    }
}

