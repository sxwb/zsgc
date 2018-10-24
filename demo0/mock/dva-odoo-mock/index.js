//import loginMock from './login';

import modelCreators from './models';
import baseModel from './baseModel';

const mockServicesCreator = mockData => {//mock数据：数据与处理函数和一个继承参数。
	const { inherits = {} } = mockData;//其他继承参数，可不写。
	//递归调用，获得完全的，深层的继承mock参数
	const getBaseOptions = (options = {}) => {
		const { inherit = 'base' } = options;
		if (inherit === 'base') {
			return options;//基础的mock
		}
		const creator = { ...modelCreators, ...inherits }[inherit];//合并内置继承的mock以及其他继承的mock{inherit：mock，inhert1：mock1}
		//获取内置继承的mock，如果存在
		if (creator) {
			const new_options = creator(options);//获得新的mock参数
			return getBaseOptions(new_options);
		}

		return options;
	};

	const call2 = req => {
		
		const params = unpack(req);//获取请求参数的body参数
		const { args, kwargs } = params;//获取参数中的真正参数和mock参数
		const { context = {} } = kwargs;//获取mock文件参数
		const { mock_react_api } = context;//获取mock文件目录
		const [model, method] = mock_react_api.split('/');

		const new_options = getBaseOptions(mockData[model]);
		const { records, extend = [] } = new_options;//获取mock数据和mock处理函数

		let outModel = baseModel(new_options);

		for (var ext of extend) {
			outModel = { ...outModel, ...ext(new_options) };
		}

		const fn = outModel[method];
		const jsonrpc = { jsonrpc: 2.0, id: 1 };
		return { ...jsonrpc, result: fn(...args, kwargs) };
	};

	const login2 = req => {
		//      console.log('login mock,', mockData)
		const { password, login, type } = unpack(req);

		const {
			login: loginUsers = {
				admin: {
					login: 'admin',
					password: '123',
					sid: 'sid1',
					name: 'ss1',
					uid: 1,
				},
			},
		} = mockData;

		//      console.log('login mock,', loginUsers)

		const user = loginUsers[login];
		if (user) {
			const { password: psw, sid = '', uid = 0, name = '' } = user;
			if (password === psw) {
				return {
					jsonrpc: 2.0,
					id: 1,
					result: { sid, name, uid, status: 'ok' },
				};
			}
		}

		return {
			jsonrpc: 2.0,
			id: 1,
			result: { status: 'error' },
		};
	};

	const unpack = payload => {
		const { body } = payload;
		const { params } = body;
		return params;
	};

	const call = (req, res) => {
		const result = call2(req);
		res.send(result);
	};

	const login = (req, res) => {
		const result = login2(req);
		res.send(result);
	};

	return { login, call };
};

export default mockServicesCreator;
