class MenuData {
    id = "";
    title = "";
    answer = "";
    options = [{}];

    constructor(menuData){
        this.id = menuData.id;
        this.title = menuData.name;
        this.answer = menuData.answer;
        this.options = menuData?.options ?? [{}];
    }
    
    set setMenuOptions(options){
        this.options = options;
    }
}

module.exports = MenuData;