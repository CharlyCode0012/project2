const instance = require("./instance");
const MenuOption = require("../models/MenuOption");

async function fecthOptions(menuID) {
  try {
    const resMenuOptions = await instance.get("menu_options", {
      paramas: { menuID },
    });
    const menuOptions = [new MenuData()];

    resMenuOptions?.map((option) => {
      menuOptions.push(new MenuOption(option));
    });

    return menuOptions;
  } catch (error) {
    console.log(error);
    return {};
  }
}

module.export = {
  fecthOptions,
};
