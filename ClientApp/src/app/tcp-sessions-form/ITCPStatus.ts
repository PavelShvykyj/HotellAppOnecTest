export enum TCPTaskType {
    read,
    wright,
    ping,
    reconnect,
    pause
}

export interface ITCPTask {
    taskType : TCPTaskType,
    parametr : string
}

export interface ITCPStatus {
    connected : boolean,
    workon : ITCPTask,
    bufersize : number
}
