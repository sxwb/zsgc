import groupdata from '../groupdata'
import service from '@/services/odooService';
import dvaOdoo from '../../../../odoo/dva-odoo';
import dvaOdooCrm from '../../../../odoo/dva-odoo-crm';
import { delay } from 'dva/saga'
import { log } from 'util';
const dvaModel = ({ namespace, model, api }) => {
    return {
        namespace,
        state: {
            dataSource: groupdata,       //数据源
            selectedRowKeys: [],    //删除选中的key
            visible: false,         //弹出表单
            edit: {},               //新建或编辑
            searchData: [],
        },
        effects: {
            *queryBySmallId({ payload }, { call, put, select }) {
                const { id, fields } = payload;
                const domain = [['id', '>=', id]];
                yield put({
                    type: 'search',
                    payload: {
                        model,
                        namespace,
                        domain,
                        fields,
                        context: { mock: 'queryBySmallId' }
                    }
                });
            },
            *rename({ payload }, { call, put, select }) {
                const { id, vals } = payload;
                yield put({
                    type: 'write',
                    payload: { id, vals: vals, context: { mock: 'write' } }
                });
            },
            *init({ payload }, { call, put, select }) {
                const v2 = 'admin,123';
                const [user, password] = v2.split(',');
                yield put({
                    type: 'login/login',
                    payload: { login: user, password, type: 'account' },
                    callback: (data) => { },
                    error: (data) => { //this.setState({ data })
                    },
                    success: (data) => { //this.setState({ data }) 
                    },
                })
                yield delay(0)

                yield put({
                    type: 'queryBySmallId',
                    payload: { id: 0 }
                });

            },
        },
        reducers: {
            /*delOne(state, { key }) {
                const dataSource = state.dataSource;
                const newDataSource = dataSource.filter(item => item.key !== key)
                return { ...state, ...{ dataSource: newDataSource } }
            },*/
            saveSelectedRowKeys(state, { selectedRowKeys }) {
                return { ...state, ...{ selectedRowKeys } }
            },
            /*delSome(state) {
                const { selectedRowKeys, dataSource } = state;
                const newDataSource = dataSource.filter(item => !selectedRowKeys.some(key => key === item.key))
                return { ...state, ...{ dataSource: newDataSource } }
            },*/
            changeVisible(state, { record = {} }) {
                return { ...state, ...{ visible: !state.visible, edit: record } }
            },
            clearEdit(state, { dataSource }) {
                return { ...state, ...{ dataSource, visible: !state.visible, edit: {} } }
            },
            searchData(state, { searchData }) {
                return { ...state, searchData }
            },
            saveDataSource(state, { dataSource }) {
                return { ...state, dataSource }
            }
        }
    }
}
const fields = {
    default: [
        'name', 'comment',
        'color', 'credit_limit',
        'date', 'image',
        'customer',
        'type',
        'title',
        'child_ids',
        'category_id',
    ],
    many2one: {
        title: {
            model: 'res.partner.title',
            namespace: 'res.partner.title',
            fields: { default: ['name'] },
            domain: []
        },

    },

    one2many: {
        child_ids: {
            model: 'res.partner',
            namespace: 'contact',
            fields: { default: ['name'] },
            domain: [],
        },

        category_id: {
            model: 'res.partner.category',
            namespace: 'res.partner.category',
            fields: { default: ['name'] },
            domain: [],
        }
    },

}

const contact = {
    model: 'res_partner',//数据保存在odoodata的模型分之
    namespace: 'groupgames',//命名空间。state分支
    inherit: 'res_partner.groupgames',//继承分支选择，odooData,login,
    service,//服务请求方法
    fields,//域
    dvaModel,//自有模型
};
export default dvaOdoo(contact);
