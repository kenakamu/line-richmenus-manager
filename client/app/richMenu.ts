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
    constructor(label: string) {
        this.label = label;
    }
}

export class postbackAction extends action {
    data: string;
    text: string;
    constructor(label: string, data: string, text: string) {
        super(label);
        this.type = "postback";
        this.data = data;
        this.text = text;
    }
}

export class messageAction extends action {
    text: string;
    constructor(label: string, text: string) {
        super(label);
        this.type = "message";
        this.text = text;
    }
}

export class uriAction extends action {
    uri: string;
    constructor(label: string, uri: string) {
        super(label);
        this.type = "uri";
        this.uri = uri;
    }
}