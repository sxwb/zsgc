/*
  This is a template for mock data.
  The file name is dva model name.
  The method name is same to a param named of mock,
    the mock param be set when a odoo api method called by a dva effect method
*/

const records = {
    1: {
        id: '1',
        name: '胡彦斌',
        gameid: 'A组',
        role: '队员',

    },
    2: {
        id: '2',
        gameid: 'B组',
        name: '周伦',
        role: '队长',
    },
    3: {
        id: '3',
        gameid: 'C组',
        name: '张杰',
        role: '教练',

    },
    4: {
        id: '4',
        gameid: 'D组',
        name: '李白',
        role: '队员',
    },
};


const str2int = (ids) => {
    const res = [];
    for (var id of ids) {
        res.push(parseInt(id));
    }
    return res
}

const extend = ({ records }) => {
    return {

        searchAll: (domain, kwargs) => {
            const ids = Object.keys(records);
            return str2int(ids);
        },

        queryBySmallId: (domain, kwargs) => {
            const ids0 = Object.keys(records);
            const ids = str2int(ids0);
            const id0 = domain[0][2];
            const res = [];
            for (var id of ids) {
                if (id >= id0) {
                    res.push(records[id]);
                }
            }
            return res
        },

        rename: (id, vals) => {
            const { gameid = '' } = vals;
            if (id) {
                records[id].gameid = gameid
                return 1;
            }
            else {
                return 0;
            }
        },
        write: (id, vals) => {
            const oldRecords = { ...records[id] };
            records[id] = { ...oldRecords, ...vals }
            return 1;
        },
        create: (vals) => {
            const ids1 = Object.keys(records).map(i => parseInt(i))
            const ids = ids1.length ? ids1 : [0]
            
            const id = Math.max(...ids) + 1;
            if(ids.indexOf(id)>-1){
                return
            }
            records[id] = { id, ...vals }
            return id
        },
        moreDelete:(ids)=>{
            ids.forEach(element => {
               this.unlink(element); 
            });           
        }
    }
}
export default () => {
    return {
        records: records,
        inherit: 'res.partner.groupgames',
        extend: [extend],
    };
};
