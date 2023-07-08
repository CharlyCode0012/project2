class MenuOption {
    id = "";
    answer = "";
    option = "";
    keywords = "";
    action_type = "";
    reference = "";
    catalogId = "";
    submenuId = "";

    constructor(optionData){
        this.id = optionData.id;
        this.answer = optionData.answer;
        this.option = optionData.option;
        this.keywords = optionData.keywords;
        this.action_type = optionData.action_type;
        this.reference = optionData.reference;
        this.catalogId = optionData.catalogId;
        this.submenuId = optionData.submenuId;
    }

}

module.exports = MenuOption;