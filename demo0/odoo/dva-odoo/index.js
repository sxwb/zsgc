import modelExtend from 'dva-model-extend';

import odooDataCreate from './odooData';
import loginCreate from './login';

import odooApi from './odooApi';
import ServiceCreator from './odooService';

import metaModelCreate from './metaModel';
import modelCreators from './addons';
const create_normal = ({ options, odooCall }) => {//创建新的组合model，参数为自定义的modek和服务器方法
	const getNewOptions = child => {//child自定义的model
		const { inherit } = child;
		const creator = modelCreators[inherit];
		if (creator) {
			const parent = creator(child);
			return getNewOptions(parent);
		} else {
			return metaModelCreate(child);
		}
	};

	const {
		inherit,
		model: odooModel,
		namespace,
		fields,  // default fields and fields defination
		odooApi,
		dvaModel, // out model is a leaf model
		apis: outApis,
		extend: outExtend, // out model is with a parent
	} = options;
	const { model, apis = [], extend = [] } = getNewOptions({
		inherit,
		model: odooModel,
		apis: [...(outApis ? outApis : []), ...(odooApi ? [odooApi] : [])],
		extend: [...(outExtend ? outExtend : []), ...(dvaModel ? [dvaModel] : [])],
	});

	let api = {};
	for (const apiCreators of apis) {
		const ppp = apiCreators({ model, namespace, fields, odooCall, api });
		api = { ...api, ...ppp };
	}
console.log('====================================');
console.log(api);
console.log('====================================');
	let outModel = {};
	for (const dvaModelCreators of extend) {
		outModel = modelExtend(
			outModel,
			dvaModelCreators({ model, namespace, fields, odooCall, api })
		);
	}
	return outModel;
};

export default options => {
	const { inherit } = options;
	if (inherit === 'odooData') {//如果期望继承自odooData
		return odooDataCreate();
	}

	const { service } = options;
	const odooService = ServiceCreator(service);//创建服务器请求
	
	if (inherit === 'login') {//如果期望继承自login
		const dvamodel = loginCreate(odooService);
		const { namespace } = dvamodel;
		const { extend = {} } = options;
		return modelExtend(dvamodel, { ...extend, namespace });
	}
	return create_normal({ options, odooCall: odooService.call });
};
