import { Component, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Entity, TrainData, DisplayModel, SelectionCordinates } from './Models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  Tags: Array<Entity> = new Array<Entity>();
  textToParse: string = "";
  trainData: TrainData;
  displayModels: Array<DisplayModel> = new Array<DisplayModel>();
  currentSelection: SelectionCordinates = null;

  constructor() {
    this.currentSelection = new SelectionCordinates();
  }

  ngOnInit() {
    this.Tags = [
      new Entity("CANCERSTAGE", "entity CANCERSTAGE", "Cancer Stage"),
      new Entity("BIOMARKER", "entity BIOMARKER", "Bio Marker"),
      new Entity("TREATMENTSETTING", "entity TREATMENTSETTING", "Treatment Setting")
    ];
    this.trainData = new TrainData();
    //this.trainData.trainText = "I am a disco dancer";
    //this.trainData.AddAnnotation(0, 1, "CANCERSTAGE");
    //this.trainData.AddAnnotation(7, 12, "BIOMARKER");
    //this.trainData.AddAnnotation(13, 19, "TREATMENTSETTING");

    this.textToParse = this.trainData.trainText;
    this.RebindAnnotations();
  }

  timeoutHandler = null;

  UpdateTrainingText() {
    console.log("UpdateTrainingText");
    if (this.timeoutHandler != null)
      clearTimeout(this.timeoutHandler);

    this.timeoutHandler = setTimeout(() => {
      this.trainData.trainText = this.textToParse;
      this.RebindAnnotations();
    }, 1000)
  }


  ToggleHover(displayModel) {
    displayModel.hover = !displayModel.hover;
  }

  RebindAnnotations() {
    this.displayModels = this.GetDisplayComponents();
  }

  RemoveAnnotation(displayModel: DisplayModel) {
    this.trainData.RemoveAnnotation(displayModel.annotation);
    this.RebindAnnotations();
  }

  SaveSelectionCordinates(event) {
    let k = window.getSelection();
    this.currentSelection.anchortype = k.anchorNode.nodeName.toString();
    this.currentSelection.focustype = k.focusNode.nodeName.toString();
    this.currentSelection.anchorOffset = k.anchorOffset;
    this.currentSelection.focusOffset = k.focusOffset;
    if (event != null) {
      if (event.srcElement != null) {
        this.currentSelection.offsetFromStartOfString = +(event.srcElement.getAttribute("startingIndexOffset"));
      }
    }

    //console.log("SaveSelectionCordinates", event, this.currentSelection);
  }

  TryAnnotating(entityName: string) {
    //console.log(entityName, this.currentSelection);
    let startIndex: number = this.currentSelection.offsetFromStartOfString + this.currentSelection.anchorOffset;
    let endIndex: number = this.currentSelection.offsetFromStartOfString + this.currentSelection.focusOffset;
    this.trainData.AddAnnotation(startIndex, endIndex, entityName);
    this.RebindAnnotations();

  }

  public GetDisplayComponents(): Array<DisplayModel> {
    let retVal = new Array<DisplayModel>();
    
    if (this.trainData == null)
      return retVal;

    if (this.trainData.trainText == null || this.trainData.trainText == "")
      return retVal;
    let i = 0;
    let tString: string = "";
    let previousNodeLength = 0;
    while (i < this.trainData.trainText.length) {
      let annottationStartingAtThisIndex = this.trainData.annotations.find(c => c.start == i);
      let isThereAnAnnottationStartingAtThisIndex = (annottationStartingAtThisIndex != null);
      if (isThereAnAnnottationStartingAtThisIndex) {
        if (tString != "") {
          let oldDisplayModel = new DisplayModel();
          oldDisplayModel.tokenType = "Text";
          oldDisplayModel.token = tString;
          oldDisplayModel.startingIndexOffset = i - tString.length;
          previousNodeLength = tString.length;
          retVal.push(oldDisplayModel);
          tString = "";
        }
        let displayModel = new DisplayModel();
        displayModel.tokenType = annottationStartingAtThisIndex.entityName;
        displayModel.token = this.trainData.trainText.substr(annottationStartingAtThisIndex.start, annottationStartingAtThisIndex.end - annottationStartingAtThisIndex.start);
        displayModel.annotation = annottationStartingAtThisIndex;
        displayModel.startingIndexOffset = i;
        previousNodeLength = annottationStartingAtThisIndex.end - annottationStartingAtThisIndex.start;
        retVal.push(displayModel);
        i = annottationStartingAtThisIndex.end - 1;
      } else {
        tString += this.trainData.trainText.charAt(i);
      }
      i++;
    }
    if (tString != "") {
      let lastDisplayModel = new DisplayModel();
      lastDisplayModel.tokenType = "Text";
      lastDisplayModel.token = tString;
      lastDisplayModel.startingIndexOffset = this.trainData.trainText.length - tString.length;
      previousNodeLength = tString.length;
      retVal.push(lastDisplayModel);
      tString = "";
    }
    return retVal;
  }
}

