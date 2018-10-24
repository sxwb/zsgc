export  function lookup(ids = [], data = {}) {
  const list = [];
  if (Array.isArray(ids)) {
      ids.map(id => {
          id=Number(id);
          data[id] ? list.push({...data[id],key:id}) : null
          return void 0
      })
  } else {
      data[ids] ? list.push({...data[ids],key:ids}) : null
  }
  console.log('====================================');
  console.log(list);
  console.log('====================================');
  return [...list]
}

export function toArray(field, operator, value) {
  /*
     domain = [['field_name','operator', value], [..., ..., ... ], ... ]
     domain = [toArray('field_name','operator', value), toArray(..., ..., ... ), ... ]
     domain = [['name','like', 'simth'], ['age', '>', 20] ]
     domain = [toArray('name','like', 'simth'), toArray('age', '>', 20) ]
  */
  return [field, operator, value];
}

export function get_ids(id, partners) {
  const ids = [];
  for (var index in partners) {
    /* user-defined */
    if (index > id) {
      ids.push(parseInt(index));
    }
  }
  return ids;
}

export function get_newId(partners) {
  const ids = Object.keys(partners);
  const newids = [0, ...ids];
  const id = Math.max(...newids) + 1;
  return id;
}
