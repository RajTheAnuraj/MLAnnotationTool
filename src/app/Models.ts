import { filter } from "minimatch";

export class Entity {
    public EntityName: string;
    public CssClassName: string;
    public DisplayText: string;

    constructor(entityName: string, cssClassName: string, displayText: string) {
        this.EntityName = entityName;
        this.CssClassName = cssClassName;
        this.DisplayText = displayText;
    }
}

export class Annotation {
    public start: number;
    public end: number;
    public entityName: string;

    constructor(start: number, end: number, entityName: string) {
        this.start = start;
        this.end = end;
        this.entityName = entityName;
    }
}


export class DisplayModel {
    public tokenType: string;
    public token: string;
    public hover : boolean;
    public startingIndexOffset:number;
    public annotation: Annotation;

    constructor(){
        this.hover = false;
    }
}

export class TrainData {
    public trainText: string;
    public annotations: Array<Annotation>;

    constructor() {
        this.annotations = new Array<Annotation>();
    }

    public AddAnnotation(start: number, end: number, entityName: string) {
        let annotation: Annotation = new Annotation(start, end, entityName);
        this.annotations.push(annotation);
    }

    public RemoveAnnotation(annotation: Annotation) {
        this.annotations = this.annotations.filter(c =>
            !(c.start == annotation.start &&
                c.end == annotation.end &&
                c.entityName == annotation.entityName)
        );
    }

    public ClearAnnotations(){
        this.annotations = null;
        this.annotations = new Array<Annotation>();
    }

    
}

export class SelectionCordinates{
    public anchortype:string;
    public focustype:string;
    public anchorOffset:number;
    public focusOffset:number;
    public offsetFromStartOfString:number;
}