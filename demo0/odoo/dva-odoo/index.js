import modelExtend from 'dva-model-extend';

import odooDataCreate from './odooData';
import loginCreate from './login';

import odooApi from './odooApi';
import ServiceCreator from './odooService';

import metaModelCreate from './metaModel';
import modelCreators from './addons';
console.log('====================================');
console.log(ServiceCreator);
console.log('====================================');
const create_normal = ({ options, odooCall }) => {
  const getNewOptions = child => {
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

  if (inherit === 'odooData') {
    return odooDataCreate();
  }

  const { service } = options;
  const odooService = ServiceCreator(service);

  if (inherit === 'login') {
    const dvamodel = loginCreate(odooService);
    const { namespace } = dvamodel;
    const { extend = {} } = options;
    return modelExtend(dvamodel, { ...extend, namespace });
  }
  return create_normal({ options, odooCall: odooService.call });
};
