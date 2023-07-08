const instance = require("./instance");

//TODO filter with keyWord

async function fetchCatalogs() {
  try {
    const { data: catalogs } = await instance.get("/catalogs");

    const data = catalogs.map((catalog, index) => ({
      body: `${index + 1} *${catalog.name}:* ${catalog.description} `,
      id: catalog.id,
    }));

    /* const data = catalogs.map((catalog, index) => {
        return `${index + 1} *${ catalog.name }:* ${ catalog.description } `;
    })
 */
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
}

module.exports = { fetchCatalogs };
