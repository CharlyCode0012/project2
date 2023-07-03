const instance = require('instance');

class catalog {
    constructor(id, name, description, state){
        this.id = id; 
        this.name = name;
        this.description = description;
        this.state = state;   
    }

}
//TODO filter with keyWord

async function fetchCatalogs(){
    const {data: catalogs } = await instance.get('/catalogs');

    const data = catalogs.map( catalog, index => ( {
        body: [ 
            `${index + 1} *${ catalog.name }:* ${ catalog.description } `, 
        ] }
    ));

    return data;
}

module.exports = { fetchCatalogs };