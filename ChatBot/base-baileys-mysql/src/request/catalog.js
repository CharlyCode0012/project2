const instance = require("./instance");

//TODO filter with keyWord

async function fetchCatalogs() {
  try {
    const { data: catalogs } = await instance.get("/catalogs");
    return catalogs;
  } catch (error) {
    console.log(error);
    return {};
  }
}

function messsageCatalogs(catalogs){
  const data = catalogs.map((catalog, index) => (`${index + 1} *${catalog.name}:* ${catalog.description} `));

  return data;
}

module.exports = { fetchCatalogs, messsageCatalogs };
