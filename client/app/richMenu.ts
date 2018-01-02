export class richMenu {
    richMenuId: string;
    size: size;
    selected: boolean = true;
    name: string;
    chatBarText: string;
    areas: area[];
    image: string;
    /**
     *
     */
    constructor() {
        this.size = new size();
        this.areas = new Array<area>();        
    }
}

export class size {
    width: number = 2500;
    height: number;
}

export class area {
    bounds: bounds;
    action: action;
}

export class bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export abstract class action {
    type: string;
    label: string;
}

export class postbackAction extends action{
    data: string;
    text: string;
}

export class messageAction extends action{
    text: string;
}

export class uriAction extends action{
    uri: string;
}