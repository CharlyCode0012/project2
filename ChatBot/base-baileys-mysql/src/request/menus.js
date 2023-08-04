const instance = require("./instance");
const MenuData = require("../models/MenuData");

async function fetchMenus() {
  try {
    const { data: responseMenus } = await instance.get("/menus");
    const menus = [];

    responseMenus?.map((menu) => {
      menus.push(new MenuData(menu));
    });

    return menus;
  } catch (error) {
    console.log(error);
    return {};
  }
}

async function fetchMenuWithOptions(menuID) {
  try {
    const { data: responseMenu } = await instance.get("/menus/withID", {
      params: { menuID },
    });

    const menu = new MenuData(responseMenu);

    const { data: responseOptions } = await instance.get("/menu_options", {
      params: { menuID },
    });

    menu.setMenuOptions = responseOptions;
    return menu;
  } catch (error) {
    console.log(error);
    return {};
  }
}

async function fetchMenusWithOptions(){
  try{
    const {data: responseMenus} = await instance.get("/menus");

    const menus = responseMenus.map(responseMenu => new MenuData(responseMenu));

    const menusWithOptions = Promise.all(menus.map(async (menu) => {

      const { data: responseOptions } = await instance.get("/menu_options", {
        params: { menuID: menu.id },
      });
      menu.setMenuOptions = responseOptions;
      return menu;
    }));

    return menusWithOptions; 
  }catch (error){
    console.log(error);
    return {};
  }
}

module.exports = {
  fetchMenus,
  fetchMenuWithOptions,
  fetchMenusWithOptions,
};
