export interface IMenuActions {
    name : string[],
    iconeName : string
}

export interface IMenuLinks {
    name : string[],
    iconeName : string,
    link : string
}

export interface IMenuMessage {
    message_content : string,
    isError : boolean
}

export interface IMenuButton {
    className : string,
    iconeName : string
}

export interface IPanelContent {
    actions : IMenuActions[],
    links : IMenuLinks[],
    print : IMenuActions[],
    messages? : IMenuMessage[] 
}

export interface IMenuContent {
    menubutton : IMenuButton,
    actions : IMenuActions[],
    links : IMenuLinks[],
    messages? : IMenuMessage[] 
}