/*
 *  The TOAD JavaScript/TypeScript GUI Library
 *  Copyright (C) 2018 Mark-André Hopf <mhopf@mark13.org>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import VectorPath from "./VectorPath"
import {Point, Size, Rectangle} from "./geometry"
import * as dom from "toad.js/lib/dom"
import {Action, Signal, Model, Template, Window, RadioButtonBase, RadioStateModel, FatRadioButton, TextModel, HtmlModel, BooleanModel, NumberModel, TableModel, SelectionModel, TableEditMode, View, TextView, bind, action, Dialog} from "toad.js"

import { AccountPreferences } from "./AccountPreferences"

export function main() {
  window.onload = function() {
  
  new ServerConnection()
/*
class AvatarCollectionModel extends TableModel {
  data: Array<string>

  constructor() {
    super()
    this.data = [
      "img/avatars/bull.svg",
      "img/avatars/chick.svg",
      "img/avatars/crab.svg",
      "img/avatars/fox.svg",

      "img/avatars/hedgehog.svg",
      "img/avatars/hippopotamus.svg",
      "img/avatars/koala.svg",
      "img/avatars/lemur.svg",

      "img/avatars/pig.svg",
      "img/avatars/tiger.svg",
      "img/avatars/whale.svg",
      "img/avatars/zebra.svg",
    ]
    this.rows = 3
    this.cols = 4
  }
  
  getFieldModel(col: number, row: number): TextModel {
    let model = new HtmlModel(`
      <svg height="64" width="64" style="pointer-events: none;">
        <image xlink:href="${this.data[col+row*this.cols]}" x="2" y="2" width="60px" height="60px" />
      </svg>`)
    return model
  }

}
  let dataModel = new AvatarCollectionModel()
  bind("avatarCollection", dataModel)
  let selectionModel = new SelectionModel()
  selectionModel.mode = TableEditMode.SELECT_CELL
  bind("avatarCollection", selectionModel)

  document.body.innerHTML = `
    <h1>Choose an Avatar</h1>
    <toad-text name="first"></toad-text>
    <h2>no width</h2>
    <toad-table style="height: 64px;" model="avatarCollection"></toad-table>
    <h2>width="auto"</h2>
    <toad-table style="width: auto" model="avatarCollection"></toad-table>
    <h2>width=100%</h2>
    <toad-table style="width: 100%" model="avatarCollection"></toad-table>
    <toad-text name="last"></toad-text>
  `
*/

/*
class MyTableModel extends TableModel {

  data: any

  constructor() {
    super()
    this.data = [
      [ "1 The Moon Is A Harsh Mistress", "Robert A. Heinlein", 1966 ],
      [ "2 Stranger In A Strange Land", "Robert A. Heinlein", 1961 ],
      [ "3 The Fountains of Paradise", "Arthur C. Clarke", 1979],
      [ "4 Rendezvous with Rama", "Arthur C. Clarke", 1973 ],
      [ "5 2001: A Space Odyssey", "Arthur C. Clarke", 1968 ],
      [ "6 Do Androids Dream of Electric Sheep?", "Philip K. Dick", 1968],
      [ "7 A Scanner Darkly", "Philip K. Dick", 1977],
      [ "8 Second Variety", "Philip K. Dick", 1953]
    ]
    this.rows = this.data.length
    this.cols = this.data[0].length
  }

  getColumnHead(column: number): TextModel {
    switch(column) {
      case 0: return new TextModel("Title")
      case 1: return new TextModel("Author")
      case 2: return new TextModel("Year")
    }
    throw Error("fuck")
  }
  
  getFieldModel(col: number, row: number): TextModel {
    let model = new TextModel(this.data[row][col])
    model.modified.add( () => {
      this.data[row][col] = model.value
    })
    return model
  }

  getFieldView(col: number, row: number): View {
    return new TextView()
  }
}
  let dataModel = new MyTableModel()
  bind("books", dataModel)
  let selectionModel = new SelectionModel()
  selectionModel.mode = TableEditMode.SELECT_CELL
  bind("books", selectionModel)
                
  document.body.innerHTML = `
    <h1>Come to where the Table is</h1>
    Hello there.<input value="What's up?" style="font-size: inherited;"/>
    <toad-text name="first"></toad-text>
    <toad-table model="books"></toad-table>
    <toad-text name="last"></toad-text>
  `
*/

/*
  action("file|new", () => {
    console.log("CREATE A NEW FILE")
  })
  
  let model = new HtmlModel(`
    <svg height="32" width="32">
      <defs>
        <clipPath id="mask">
          <rect x="0" y="0" width="32" height="32" rx="4" ry="4" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="4" ry="4" stroke="none" fill="#08f" />
      <image clip-path="url(#mask)" xlink:href="img/avatars/koala.svg" x="2" y="2" width="28px" height="28px" />
    </svg>`)
  bind("avatar", model)

  document.body.innerHTML = `
  <toad-menu>
    <toad-menuentry name="file" label="File">
      <toad-menuentry name="new" label="New"></toad-menuentry>
      <toad-menuentry name="open" label="Open"></toad-menuentry>
      <toad-menuentry name="close" label="Close"></toad-menuentry>
      <toad-menuentry name="quit" label="Quit"></toad-menuentry>
    </toad-menuentry>
    <toad-menuentry name="edit" label="Edit">
      <toad-menuentry name="undo" label="Undo" shortcut="Ctrl+Z"></toad-menuentry>
      <toad-menuentry name="redo" label="Redo" shortcut="Ctrl+Y"></toad-menuentry>
      <toad-menuentry name="cut" label="Cut" shortcut="Ctrl+X"></toad-menuentry>
      <toad-menuentry name="copy" label="Copy" shortcut="Ctrl+C"></toad-menuentry>
      <toad-menuentry name="paste" label="Paste" shortcut="Ctrl+V"></toad-menuentry>
      <toad-menuentry name="delete" label="Delete" shortcut="Del"></toad-menuentry>
      <toad-menuentry name="search" label="Search">
        <toad-menuentry name="searchDialog" label="Search..."></toad-menuentry>
        <toad-menuentry name="forward" label="Forward"></toad-menuentry>
        <toad-menuentry name="backward" label="Backward"></toad-menuentry>
      </toad-menuentry>
    </toad-menuentry>
    <toad-menuentry name="edit" label="Cards">
    </toad-menuentry>
    <toad-menuentry name="new" label="New"></toad-menuentry>
    <toad-menuspacer></toad-menuspacer>
    <!-- search -->
    <toad-menuentry name="edit" label="Help">
    </toad-menuentry>
    <toad-menuentry name="edit" label="Settings">
    </toad-menuentry>
    <toad-menuentry name="account" label="Account" model="avatar">
      <toad-menuentry name="preferences" label="Preferences"></toad-menuentry>
      <toad-menuentry name="logout" label="Logout"></toad-menuentry>
    </toad-menuentry>
  </toad-menu>`

/*  
  let a = new Action(undefined, "file|new")
  a.signal.add( ()=> {
    console.log("CREATE A NEW FILE")
  })
*/  
  }
}

/*
  FigureEditor
    |
    v
  Tool
     .mousedown
     .mouseup
     .mousemove

  Handler
     .mousedown

*/

/*
                      -> Element -> HTMLElement
                                 -> SVGElement
  EventTarget -> Node -> DocumentFragment

*/

/*
  msg
    board
      id
      name
      layers[]
        id
        name
        locked
        data[]
*/

export class EditorEvent extends Point {
  editor: FigureEditor
  shiftKey: boolean
  constructor(editor: FigureEditor, opt:any) {
    super()
    this.editor = editor
    this.shiftKey = (opt||opt.shiftKey)?true:false
  }
}

export abstract class Figure {
  id?: number
  type?: string

  public static readonly FIGURE_RANGE = 5.0
  public static readonly HANDLE_RANGE = 5.0
  
  public static fromJson(json: string): Figure {
    let data = JSON.parse(json)
    switch(data.type) {
      case "rect":
        return FRectangle.fromJson(data)
    }
    throw Error("unknown figure type")
  }
  
  distance(pt: Point): Number {
    return Number.POSITIVE_INFINITY
  }
  abstract createSVG(): SVGElement
  abstract createHandler(editor: FigureEditor): FigureHandler

  abstract bounds(): Rectangle
  editBounds(): Rectangle { return this.bounds() }

  abstract move(delta: Point): void
  abstract setHandlePosition(handle: number, delta: Point): void
  abstract update(): void
  abstract normalize(): void
}

export abstract class Shape extends Figure {
}

class FigureHandler { // FIXME: merge FigureHandler class into Tool
  clear() { }
  mousedown(pt: Point) { }
  mousemove(pt: Point) { }
  mouseup(pt: Point) { }
  move(pt: Point) { }

  createSVGHandleRect(x: number, y: number): SVGElement {
    let handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    handle.setAttributeNS("", "x", String(Math.round(x-2.5)+0.5)); // FIXME: just a hunch for nice rendering
    handle.setAttributeNS("", "y", String(Math.round(y-2.5)+0.5));
    handle.setAttributeNS("", "width", "5");
    handle.setAttributeNS("", "height", "5");
    handle.setAttributeNS("", "stroke", "rgb(79,128,255)");
    handle.setAttributeNS("", "fill", "#fff");
    // handle.setAttributeNS(null, 'cursor', 'crosshair');
    handle.setAttributeNS("", "style", "cursor:move");
    // handle.setAttributeNS(null, 'style', "cursor: url('cursor.svg'), auto");
    return handle;
  }
}

class ShapeHandler extends FigureHandler {
  editor: FigureEditor
  rect: FRectangle
  handle: number
  handles: SVGElement[]
  outline: FRectangle
  svg: SVGElement
  
  constructor(editor: FigureEditor, rect: FRectangle) {
    super();
    this.editor = editor;
    this.rect = rect;
    this.handle = -1;
    this.handles = [];

    this.outline = Object.assign(new FRectangle(), this.rect) // FIXME: Figure.clone
    this.outline.svg = undefined
    this.outline.stroke = "rgb(79,128,255)"
    this.outline.fill   = "none"
    this.outline.move({x:-1, y:1})

    this.svg = this.outline.createSVG()

    dom.add(editor.decoLayer, this.svg);
    
    for(let i=0; i<4; ++i) {
      let h = rect.getHandlePosition(i);
      let svgHandle = this.createSVGHandleRect(h.x-1, h.y+1);
      this.handles.push(svgHandle);
      dom.add(editor.decoLayer, svgHandle);
    }
  }
  
  mousedown(e: Point) {
    this.handle = -1;
    for(let i=0; i<4; ++i) {
      let h = this.rect.getHandlePosition(i);
      if (h.x-Figure.HANDLE_RANGE/2 <= e.x && e.x<=h.x+Figure.HANDLE_RANGE/2 &&
          h.y-Figure.HANDLE_RANGE/2 <= e.y && e.y<=h.y+Figure.HANDLE_RANGE/2)
      {
        this.handle = i
        return true
      }
    }
    return false
  }

  mousemove(e: Point) {
    if (this.handle==-1)
      return false;
    this.outline.setHandlePosition(this.handle, {x:e.x-1, y:e.y+1})
    this.outline.update()
    for(let i=0; i<4; ++i) {
      let h = this.outline.getHandlePosition(i)
      this.handles[i].setAttributeNS("", "x", String(Math.round(h.x-2.5)+0.5));
      this.handles[i].setAttributeNS("", "y", String(Math.round(h.y-2.5)+0.5));
    }
    return true;
  }

  mouseup(e: Point) {
    if (this.handle==-1)
      return
    this.editor.activeLayer.sendMoveHandleMessage(this.rect, this.handle, e.x, e.y)
    this.handle = -1
    this.outline.normalize()
    this.outline.update()
  }

  move(delta: Point): void {
    for(let i=0; i<4; ++i) {
      let h = this.handles[i]
      let x = parseFloat(h.getAttributeNS("", "x"))
      let y = parseFloat(h.getAttributeNS("", "y"))
      h.setAttributeNS("", "x", String(x+delta.x))
      h.setAttributeNS("", "y", String(y+delta.y))
    }
    this.outline.move(delta)
  }

  clear() {
    if (!this.handles)
      return;
    for(let i=0; i<4; ++i) {
      dom.remove(this.handles[i]);
    }
    dom.remove(this.svg);
    this.handles = [];
  }

  startCreate(event: EditorEvent): void {
    this.outline.setHandlePosition(0, event)
    this.outline.setHandlePosition(2, event)
    this.update()
  }

  dragCreate(event: EditorEvent): void {
    this.outline.setHandlePosition(2, event)
    this.update()
  }
  
  endCreate(event: EditorEvent): void {
    this.outline.setHandlePosition(2, event)
    this.update()

    for(let i=0; i<4; ++i) {
      dom.remove(this.handles[i]);
    }
    dom.remove(this.svg);
    this.handles = [];
  }

  update(): void {
    for(let i=0; i<4; ++i) {
      let h = this.outline.getHandlePosition(i)
      this.handles[i].setAttributeNS("", "x", String(Math.round(h.x-2.5)+0.5));
      this.handles[i].setAttributeNS("", "y", String(Math.round(h.y-2.5)+0.5));
    }
    this.outline.update()
  }
}

export class FRectangle extends Shape {
  x: number
  y: number
  width: number
  height: number
  stroke: string
  fill: string
  svg?: SVGElement
  
  constructor() {
    super()
    this.x = this.y = this.width = this.height = 0
    this.stroke = "#000"
    this.fill = "none"
    this.type = "rect"
  }
  
  toJson(): string {
    return JSON.stringify({
      type:"rect", id:this.id, x:this.x, y:this.y, width:this.width, height:this.height, stroke:this.stroke, fill:this.fill
    })
  }
  
  public static fromJson(data: any): FRectangle {
    let out = new FRectangle()
    out.id = data.id
    out.x = data.x
    out.y = data.y
    out.width = data.width
    out.height = data.height
    out.stroke = data.stroke
    out.fill = data.fill
    return out
  }

  distance(pt: Point) {
    // FIXME: not final
    if (this.x <= pt.x && pt.x < this.x+this.width &&
        this.y <= pt.y && pt.y < this.y+this.height )
    {
        return -1.0; // even closer than 0
    }
    return Number.MAX_VALUE;
  }
  
  bounds(): Rectangle {
    return { origin: {x: this.x, y: this.y }, size: { width: this.width, height: this.height } } as Rectangle
    // return new Rectangle(this.x, this.y, this.width, this.height)
  }
  
  move(delta: Point): void {
    this.x += delta.x
    this.y += delta.y
    this.update()
  }
  
  getHandlePosition(i: number): Point {
    switch(i) {
      case 0: return { x:this.x, y:this.y };
      case 1: return { x:this.x+this.width, y:this.y };
      case 2: return { x:this.x+this.width, y:this.y+this.height };
      case 3: return { x:this.x, y:this.y+this.height };
    }
    throw Error("fuck")
  }

  setHandlePosition(handle: number, pt: Point): void {
    if (handle<0 || handle>3)
      throw Error("fuck")

    if (handle==0 || handle==3) {
      this.width  += this.x - pt.x; this.x=pt.x;
    } else {
      this.width  += pt.x - (this.x+this.width)
    }
    if (handle==0 || handle==1) {
      this.height += this.y - pt.y; this.y=pt.y;
    } else {
      this.height += pt.y - (this.y+this.height)
    }
  }
  
  normalize(): void {
    let x0=this.x, x1=this.x+this.width, y0=this.y, y1=this.y+this.height
    if (x1<x0) [x0,x1] = [x1,x0];
    if (y1<y0) [y0,y1] = [y1,y0];
    this.x = x0
    this.y = y0
    this.width = x1-x0
    this.height = y1-y0
  }
  
  update(): void {
    if (!this.svg)
      return

    let x0=this.x, x1=this.x+this.width, y0=this.y, y1=this.y+this.height
    if (x1<x0) [x0,x1] = [x1,x0];
    if (y1<y0) [y0,y1] = [y1,y0];

    this.svg.setAttributeNS("", "x", String(x0))
    this.svg.setAttributeNS("", "y", String(y0))
    this.svg.setAttributeNS("", "width", String(x1-x0))
    this.svg.setAttributeNS("", "height", String(y1-y0))
    this.svg.setAttributeNS("", "stroke", this.stroke)
    this.svg.setAttributeNS("", "fill", this.fill)
  }
  
  createSVG(): SVGElement {
    if (this.svg)
      return this.svg
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    this.update()
    return this.svg
  }

  createHandler(editor: FigureEditor): FigureHandler {
    return new ShapeHandler(editor, this);
  }

  path() {
    let p = new VectorPath();
    p.move(this.x,this.y);
    p.line(this.x+this.width,this.y);
    p.line(this.x+this.width,this.y+this.height);
    p.line(this.x,this.y+this.height);
    p.close();
    return p;
  }
  
}

class Toolbar extends Window {
  state: RadioStateModel<Tool>

  constructor(p: any, t: string) {
    super(p, t)

    this.state = new RadioStateModel
    new FatRadioButton<Tool>(this, "select",     this.state, new SelectTool())
    new FatRadioButton<Tool>(this, "line",       this.state, new SelectTool())
    new FatRadioButton<Tool>(this, "freehand",   this.state, new SelectTool())
    new FatRadioButton<Tool>(this, "rectangle",  this.state, new ShapeTool())
    new FatRadioButton<Tool>(this, "oval",       this.state, new SelectTool())
    new FatRadioButton<Tool>(this, "text",       this.state, new SelectTool())
    new FatRadioButton<Tool>(this, "state",      this.state, new SelectTool())
    new FatRadioButton<Tool>(this, "transition", this.state, new SelectTool())
  }
}

function json2figure(msg: any): Figure {
  switch(msg.type) {
    case "rect": {
      let rectangle = new FRectangle()
      rectangle.x      = msg.x // FIXME: marshalling code for figure belongs into figure
      rectangle.y      = msg.y
      rectangle.width  = msg.width
      rectangle.height = msg.height
      rectangle.stroke = msg.stroke
      rectangle.fill   = msg.fill
      return rectangle
    }
  }
  throw Error("unknown figure type '"+msg.type+"'")
}

export class Layer extends Model {
  id?: number
  data: Figure[]
  board?: Board
  svg?: SVGElement

  constructor() {
    super()
    this.data = new Array()
  }
  
  set value(data: Figure[]) {
    this.data = data
  }
  
  get value(): Figure[] {
    return this.data
  }

  // FIXME: move the io stuff out of the model
  callback?: (id: number) => void

  // name
  // locked
  // elements
  sendCreateFigureMessage(figure: Figure, point: Point, callback: (id: number) => void) {
    if (this.callback != undefined)
      throw Error("internal error")
    this.callback = callback
    if (!this.board || !this.board.socket)
      throw Error("fuck")
    this.board.socket.send(JSON.stringify({
      cmd:'create',
      board:this.board.id,
      layer:this.id,
      type: figure.type,
      x:point.x,
      y:point.y,
      width: 0,
      height: 0,
      stroke: "#000",
      fill: "#08f"}));
  }
  
  handleCreateFigureMessage(msg: any): void {

    let figure = json2figure(msg)
    this.data.push(figure)
    if (!this.svg)
      throw Error("fuck")
    dom.add(this.svg, figure.createSVG())
    
    msg.idx = this.data.length-1

    if (msg.creator == true) {
      if (!this.callback)
        throw Error("internal error")
      this.callback(msg.idx)
      this.callback = undefined
    }
  }
  
  sendMoveFigureMessage(figure: Figure, x: number, y: number): void {
    if (!this.board || !this.board.socket)
      throw Error("fuck")
    this.board.socket.send(JSON.stringify({
      cmd:'move',
      board:this.board.id,
      layer:this.id,
      idx:[this.data.indexOf(figure)],
      x:x,
      y:y}));
  }

  handleMoveFigureMessage(msg: any): void {
    this.data[msg.idx].move({x: msg.x, y: msg.y})
    this.modified.trigger()
  }
  
  sendMoveHandleMessage(figure: Figure, handle: number, x: number, y: number): void {
    if (!this.board || !this.board.socket)
      throw Error("fuck")
    this.board.socket.send(JSON.stringify({
      cmd:'hndl',
      board:this.board.id,
      layer:this.id,
      idx:[this.data.indexOf(figure)],
      hnd:handle,
      x:x,
      y:y}));
  }
  
  handleMoveHandleMessage(msg: any) {
    this.data[msg.idx].setHandlePosition(msg.hnd, {x: msg.x, y: msg.y})
    this.data[msg.idx].normalize()
    this.data[msg.idx].update()
    this.modified.trigger()
  }
}

export class Board {
  id?: number
  socket?: WebSocketWrapper
  layers: Layer[]
  
  constructor() {
    this.layers = new Array()
  }
}

export class Tool {
  mousedown(e: EditorEvent) { }
  mousemove(e: EditorEvent) { }
  mouseup(e: EditorEvent) { }
}

export class SelectTool extends Tool {
  selector?: SVGElement	        // transparent selection rectangle
  down: boolean	                // status of the mouse button
  figure: Figure[]
  handler: FigureHandler[]
  x: number
  y: number

  constructor() {
    super()
    this.figure = []		// figures in selection
    this.handler = []		// handler for the selected figures handles
    this.x = this.y = 0
    this.down = false		// status of the mouse button
  }

  clearSelection() {
    for(let h of this.handler)
      h.clear();
    this.handler = []
    this.figure = []
  }

  mousedown(event: EditorEvent) {
    this.down = true
  
    this.x = event.x
    this.y = event.y

    // mouse down on handle
    for(let h of this.handler)
      if (h.mousedown(event))
        return
    
    // find a figure
    let mindist=Number.POSITIVE_INFINITY
    let nearestFigure: Figure | undefined
    if (!event.editor)
      throw Error("fuck")
    for(let i=event.editor.activeLayer.data.length-1; i>=0; --i) {
      let figure=event.editor.activeLayer.data[i]
      let d = Number(figure.distance(event))
      if (d<mindist) {
        mindist = d;
        nearestFigure = figure;
      }
    }
    
    // no figure found
    if (mindist>=Figure.FIGURE_RANGE) {
      if (!event.shiftKey)
        this.clearSelection();
      return;
    }
    
    // the figure is already selected, do nothing
    if (!nearestFigure)
      throw Error("fuck")
    if (this.figure.indexOf(nearestFigure)!=-1)
      return;

    // without [shift], select only one figure
    if (!event.shiftKey)
      this.clearSelection();

    // add figure to selection
    this.figure.push(nearestFigure);
    
    // create a handler for the figure
    this.handler.push(nearestFigure.createHandler(event.editor));
  }
  
  mousemove(event: EditorEvent) {
    if (!this.down)
      return;

    // create selector (transparent rectangle which indicates the selection process)
    if (this.figure.length==0 && !this.selector) {
      this.selector = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      this.selector.setAttributeNS("", 'stroke', 'rgb(79,128,255)');
      this.selector.setAttributeNS("", 'fill', 'rgba(79,128,255,0.2)');
      dom.add(event.editor.decoLayer, this.selector);
    }
    
    // adjust selector to mouse movement
    if (this.selector) {
      let x0=this.x, y0=this.y, x1=event.x, y1=event.y;
      if (x1<x0) [x0,x1] = [x1,x0];
      if (y1<y0) [y0,y1] = [y1,y0];
      this.selector.setAttributeNS("", "x", String(Math.round(x0)+0.5)); // FIXME: just a hunch for nice rendering
      this.selector.setAttributeNS("", "y", String(Math.round(y0)+0.5));
      this.selector.setAttributeNS("", "width", String(Math.round(x1-x0)));
      this.selector.setAttributeNS("", "height", String(Math.round(y1-y0)));
      return;
    }

    // handle handle with handle handler
    for(let h of this.handler)
      if (h.mousemove(event))
        return;
      
    // translate selection (figures, handles, outline)
    let dx = event.x-this.x;
    let dy = event.y-this.y;
    
    // translate selected figures
    for(let f of this.figure)
      event.editor.activeLayer.sendMoveFigureMessage(f, dx, dy);
    
    // translate the handles (& outline)
    for(let h of this.handler) {
      h.move({x: dx, y: dy});
    }
    
    this.x = event.x;
    this.y = event.y;
  }

  mouseup(e: EditorEvent) {
    this.down = false;
    for(let h of this.handler)
      h.mouseup(e);
    if (this.selector) {
      dom.remove(this.selector);
      this.selector = undefined;
    }
  }
}

export class ShapeTool extends Tool
{
  outline?: Figure
  figure?: Figure
  handler?: ShapeHandler
  origin?: Point

  constructor() {
    super()
  }

  mousedown(event: EditorEvent) {
    let tool = this
    
    tool.origin = event
    
    // create a new shape
    let figure = new FRectangle
    figure.x = 0
    figure.y = 0
    figure.width = 0
    figure.height = 0
    figure.stroke = "rgb(79,128,255)"
    figure.fill = ""
    this.outline = figure
    this.outline.setHandlePosition(0, event)
    this.outline.setHandlePosition(2, event)

    this.handler = this.outline.createHandler(event.editor) as ShapeHandler
    this.handler.startCreate(event)

    event.editor.activeLayer.sendCreateFigureMessage(this.outline, event, function(id: number) {
      tool.figure = event.editor.activeLayer.data[id]
    })
    
  }

  private adjustFigure(event: EditorEvent) {
    if (!this.figure)
      return
    if (!this.origin)
      throw Error("fuck")
    let x0=this.origin.x, y0=this.origin.y, x1=event.x, y1=event.y
    if (x1<x0) [x0,x1] = [x1,x0];
    if (y1<y0) [y0,y1] = [y1,y0];
    event.editor.activeLayer.sendMoveHandleMessage(this.figure, 2, x0, y0)
    event.editor.activeLayer.sendMoveHandleMessage(this.figure, 2, x1, y1)
  }
  
  mousemove(event: EditorEvent) {
    if (!this.handler)
      return
    this.handler.dragCreate(event)
    this.adjustFigure(event)
  }

  mouseup(event: EditorEvent) {
    if (!this.handler)
      return
    this.handler.endCreate(event)
    delete this.handler
    this.adjustFigure(event)
  }
}

class FigureSelection {
}

export class FigureEditor extends Window {
  socket: WebSocketWrapper
  board: Board
  activeLayer: Layer
  svg: SVGElement
  layer: SVGElement
  decoLayer: SVGElement
  tool?: Tool
  zoom: number
  
  bounds: Rectangle
  
  scrolled: boolean
  reduceScrollbarTimer: number

  constructor(p: any, t: string, socket: WebSocketWrapper, board: Board) {
    super(p, t);
    
    this.zoom = 1.0
    
    this.scrolled = false
    this.reduceScrollbarTimer = -1
    
    this.socket = socket;
    this.board = board;

    let editor = this; // for creating the closures
    if (!editor.window)
      throw Error("fuck")

    // let svg = createSVGfromData(board.layers[0].data):

    // turn board.layer[0] into SVG objects
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg = svg
    let layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.layer = layer

    board.layers[0].svg = layer

    this.bounds = new Rectangle()

    for(let figure of board.layers[0].data) {
      dom.add(layer, figure.createSVG());
      this.bounds.expandByRectangle(figure.bounds())
    }
    dom.add(svg, layer);

    this.activeLayer = board.layers[0];
    
    // add an additional pointer and decoration layer for the editor itself
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    this.decoLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    dom.add(svg, this.decoLayer);

    this.activeLayer.modified = new Signal() // FIXME!!!! should be created by Layer()
    this.activeLayer.modified.add(function() {
      editor.adjustBounds()
    })
    editor.window.addEventListener("scroll", function(e: UIEvent) {
      editor.scrolled = true
    })
  
    svg.style.position = "relative"
    svg.style.backgroundColor = "rgb(255,128,0)"
    
    dom.add(p, svg)

    setTimeout(function() {
      if (!editor.window)
        return
      editor.bounds.expandByPoint({x: editor.window.offsetWidth, y: editor.window.offsetHeight})
      svg.style.width  = editor.bounds.size.width+"px"
      svg.style.height = editor.bounds.size.height+"px"
      
      editor.adjustBounds()
      editor.window.scrollLeft = -editor.bounds.origin.x
      editor.window.scrollTop  = -editor.bounds.origin.y
      
    }, 0)

    // 1st: move rectangle
    // 2nd: move rectangle via server in both browsers
    
/*
    window.addEventListener("resize", function() {
      console.log("window.resize")
    });
*/
    if (!this.window)
      throw Error("fuck")

    this.window.onmousedown = function(mouseEvent: MouseEvent): boolean {
      if (!editor.window)
        throw Error("fuck")
      // editor.window.requestPointerLock()
      if (editor.reduceScrollbarTimer!=-1) {
        window.clearTimeout(editor.reduceScrollbarTimer)
        editor.reduceScrollbarTimer = -1
      }
      if (editor.tool)
        editor.tool.mousedown(editor.createEditorEvent(mouseEvent))
      return false;
    }

    this.window.onmouseup = function(mouseEvent: MouseEvent): boolean {
      // document.exitPointerLock()
// FIXME: idea for reducing the scrollbars: on mouse up and scroll, set timer, abort timer at mousedown, timer will reduce scrollbars
      if (editor.reduceScrollbarTimer!=-1) {
        window.clearTimeout(editor.reduceScrollbarTimer)
      }
      editor.reduceScrollbarTimer = window.setTimeout(function() {
        if (editor.scrolled) {
          editor.adjustBounds()
          editor.scrolled = false
        }
        editor.reduceScrollbarTimer = -1
      }, 500)

      if (editor.tool)
        editor.tool.mouseup(editor.createEditorEvent(mouseEvent));
      return false;
    } 

    this.window.onmouseenter = function(mouseEvent: MouseEvent): boolean {
      let editorEvent = editor.createEditorEvent(mouseEvent)
      
      socket.send(JSON.stringify({
        cmd:'enter',
        x:editorEvent.x,
        y:editorEvent.y
      }))
      return false
    }

    this.window.onmouseleave = function(mouseEvent: MouseEvent): boolean {
      let editorEvent = editor.createEditorEvent(mouseEvent)
      socket.send(JSON.stringify({
        cmd:'leave',
        x:editorEvent.x,
        y:editorEvent.y
      }));
      return false
    }
    
    this.window.onmousemove = function(mouseEvent: MouseEvent): boolean {
      let editorEvent = editor.createEditorEvent(mouseEvent)
      socket.send(JSON.stringify({
        cmd:'pointer',
        x:editorEvent.x,
        y:editorEvent.y
      }));
      if (editor.tool)
        editor.tool.mousemove(editorEvent)
      return false
    }
    
    document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => {
      keyboardEvent.preventDefault()
      if (keyboardEvent.code == "Backspace" ||
          keyboardEvent.code == "Delete" )
      {
        console.log("delete")
      }
    })
  }
  
  setTool(tool: Tool): void {
    this.tool = tool
  }

  adjustBounds() {
    let editor = this;
    let board  = this.board
    let svg    = this.svg
    let layer  = this.layer
    
    if (!editor.window)
      throw Error("fuck")

    let bounds = new Rectangle()
    
    // include the viewing ports center
    bounds.expandByPoint({x: editor.window.offsetWidth/editor.zoom, y: editor.window.offsetHeight/editor.zoom})

    // include all figures
    for(let item of board.layers[0].data)
      bounds.expandByRectangle(item.bounds())

    // include visible areas top, left corner
    bounds.expandByPoint({x: editor.bounds.origin.x + editor.window.scrollLeft, y: editor.bounds.origin.y + editor.window.scrollTop})

    // include visible areas bottom, right corner
    bounds.expandByPoint({x: editor.bounds.origin.x + editor.window.scrollLeft + editor.window.clientWidth/editor.zoom,
                          y: editor.bounds.origin.y + editor.window.scrollTop  + editor.window.clientHeight/editor.zoom})
    
    let x = editor.bounds.origin.x + editor.window.scrollLeft - bounds.origin.x
    let y = editor.bounds.origin.y + editor.window.scrollTop  - bounds.origin.y
/*
console.log("adjustBounds after scrolling")
console.log("  old bounds   =("+editor.bounds.origin.x+","+editor.bounds.origin.y+","+editor.bounds.size.width+","+editor.bounds.size.height+")")
console.log("  new bounds   =("+bounds.origin.x+","+bounds.origin.y+","+bounds.size.width+","+bounds.size.height+")")
console.log("  scroll       =("+editor.window.scrollLeft+","+editor.window.scrollTop+")")
console.log("  scroll mapped=("+(editor.bounds.origin.x+editor.window.scrollLeft)+","+(editor.bounds.origin.y+editor.window.scrollTop)+")")
console.log("  new scroll   =("+x+","+y+")")
*/
    let zoom=String(editor.zoom)
    let scale="scale("+zoom+" "+zoom+")"
    layer.setAttributeNS("", "transform", "translate("+(-bounds.origin.x)+" "+(-bounds.origin.y)+") "+scale)
    editor.decoLayer.setAttributeNS("", "transform", "translate("+(-bounds.origin.x)+" "+(-bounds.origin.y)+") "+scale)
    svg.style.width  = (bounds.size.width*editor.zoom)+"px"
    svg.style.height = (bounds.size.height*editor.zoom)+"px"

    editor.window.scrollLeft = x
    editor.window.scrollTop  = y

    editor.bounds = bounds
  }
  
  createEditorEvent(e: MouseEvent): EditorEvent {
    if (!this.window)
      throw Error("fuck")
    
    // (e.clientX-r.left, e.clientY-r.top) begins at the upper left corner of the editor window
    //                                     scrolling and origin are ignored
    
    let r = this.window.getBoundingClientRect()

    let x = (e.clientX+0.5 - r.left + this.window.scrollLeft + this.bounds.origin.x)/this.zoom
    let y = (e.clientY+0.5 - r.top  + this.window.scrollTop  + this.bounds.origin.y)/this.zoom

    return {editor: this, x: x, y: y, shiftKey: e.shiftKey}
  }
}

export class WebSocketWrapper
{
  send(data: string): void {
    throw Error("pure virtual function called")
  }
}

class WebSocketInet extends WebSocketWrapper {
  socket: WebSocket
  
  constructor(url: string, protocols: any) {
    super()
    this.socket = new WebSocket(url, protocols)
  }
  
  send(data: string): void {
    this.socket.send(data)
  }
}

class ServerConnection {
  editor?: FigureEditor
  gp?: SVGElement // gadget pointer

  constructor() {
    let This = this;
    let socket = new WebSocketInet('ws://192.168.1.105:8000/', ['json']);
  
    socket.socket.onopen = function(e) {
      console.log("websocket is opened");

      // session=vangelis
      // session=vangelis; test1=A

      let session=""
      if (document.cookie) {
        console.log("cookie: "+document.cookie)
        let cookies = document.cookie.split(";")
        for(let i=0; i<cookies.length; ++i) {
          let str = cookies[i].trim()
          if (str.indexOf("session=") == 0) {
            session = str.substring(8, str.length)
            break
          }
        }
      }
      
      if (session.length == 0) {
        socket.send(JSON.stringify({
          cmd:"init"
        }))
      } else {
        socket.send(JSON.stringify({
          cmd:"init",
          session:session
        }))
      }
    }
  
    socket.socket.onclose = function(e) {
      console.log("websocket closed");
      document.body.innerHTML = "lost connection to workflow server. please reload.";
    }
  
    socket.socket.onerror = function(e) {
      console.log("websocket error", e);
    }
  
    socket.socket.onmessage = function(e) {
      let msg = JSON.parse(e.data);
//      console.log("got ", msg, This);
      msg.socket = socket;
      switch(msg.cmd) {
        case "logon-request": This.initializeLogonScreen(msg); break;
        case "home":          This.initializeHomeScreen(msg); break;
        case "create":        This.handleCreateFigureMessage(msg); break;
        case "move":          This.handleMoveFigureMessage(msg); break;
        case "hndl":          This.handleMoveHandleMessage(msg); break;
        case "enter":         This.enter(msg); break;
        case "pointer":       This.pointer(msg); break;
        case "leave":         This.leave(msg); break;
        default:
          delete msg.socket;
          console.log("unknown message", msg);
      }
    }
  }

  initializeLogonScreen(msg: any) {
    let template = new Template("logonScreen")

    let logon = template.text("logon", "")
    let password = template.text("password", "")
    let remember = template.boolean("remember", msg.remember)
    template.html("disclaimer", msg.disclaimer)
    template.number("lifetime", msg.lifetime, {})
    template.text("msg", msg.msg)

    let logonAction = template.action("logon", () => {
      template.clear()
      msg.socket.send(JSON.stringify({
        cmd: 'logon',
        logon: logon.value,
        password: password.value,
        remember: remember.value
      }));
    })
 
    let checkLogonCondition = function() {
      logonAction.enabled = logon.value.trim().length!=0 && password.value.trim().length!=0
    }
    checkLogonCondition()
    logon.modified.add(checkLogonCondition)
    password.modified.add(checkLogonCondition)
    
    dom.erase(document.body)
    dom.add(document.body, template.root)
  }
  
  initializeHomeScreen(msg: any) {
    let homeScreen = dom.instantiateTemplate('homeScreen');
    msg.board.socket = msg.socket

    if (msg.cookie) {
      document.cookie = msg.cookie
    }
    
    let model = new HtmlModel(`
      <svg height="32" width="32">
        <defs>
          <clipPath id="mask">
            <rect x="0" y="0" width="32" height="32" rx="4" ry="4" />
          </clipPath>
        </defs>
        <rect x="0" y="0" width="32" height="32" rx="4" ry="4" stroke="none" fill="#08f" />
        <image clip-path="url(#mask)" xlink:href="${msg.avatar}" x="2" y="2" width="28px" height="28px" />
      </svg>`)
    bind("avatar", model)
    
    let user = {
      fullname: new TextModel(msg["fullname"]),
      email: new TextModel(msg["email"])
    }
    
    action("account|preferences", () => {
      new AccountPreferences(user)
    })
    action("account|logout", () => {
    })
  
    let toolbar = new Toolbar(dom.find(homeScreen, "#toolbar"), "toolbar");
    let editor = new FigureEditor(dom.find(homeScreen, "#board"), "board", msg.socket, this.classifyBoard(msg.board));

    editor.setTool(toolbar.state.getValue())
    toolbar.state.modified.add(function() {
      editor.setTool(toolbar.state.getValue())
    })

    this.editor = editor

    dom.erase(document.body);
    dom.add(document.body, homeScreen);
  }

  handleCreateFigureMessage(msg: any) {
    if (!this.editor || !this.editor.board || !this.editor.board.layers)
      throw Error("fuck")
    this.editor.board.layers[0].handleCreateFigureMessage(msg);
  }

  handleMoveFigureMessage(msg: any) {
    if (!this.editor || !this.editor.board || !this.editor.board.layers)
      throw Error("fuck")
    this.editor.board.layers[0].handleMoveFigureMessage(msg);
  }

  handleMoveHandleMessage(msg: any) {
    if (!this.editor || !this.editor.board || !this.editor.board.layers)
      throw Error("fuck")
    this.editor.board.layers[0].handleMoveHandleMessage(msg);
  }

  enter(msg: any) {
    if (!this.editor || !this.editor.decoLayer)
      throw Error("fuck")
    if (this.gp!=null) {
      this.gp.setAttributeNS("", "cx", String(msg.x));
      this.gp.setAttributeNS("", "cy", String(msg.y));
      return;
    }
    let pointer = this.gp = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pointer.setAttributeNS("", "cx", String(msg.x));
    pointer.setAttributeNS("", "cy", String(msg.y));
    pointer.setAttributeNS("", "r", "5");
    pointer.setAttributeNS("", "stroke", "rgba(0,0,128,0.5)");
    pointer.setAttributeNS("", "fill", "rgba(0,128,255,0.5)");
  
    dom.add(this.editor.decoLayer, pointer);
  }

  pointer(msg: any) {
    if (!this.gp)
      throw Error("fuck")
    this.gp.setAttributeNS("", "cx", String(msg.x));
    this.gp.setAttributeNS("", "cy", String(msg.y));
  }

  leave(msg: any) {
    if (!this.editor || !this.editor.decoLayer)
      throw Error("fuck")
    if (this.gp)
      this.editor.decoLayer.removeChild(this.gp);
    this.gp = undefined;
  }

  /**
   * assign classes to the JSON data received from the server
   *
   * (this is not a good idea performance wise)
   */
  classifyBoard(data: any): Board {
    Object.setPrototypeOf(data, Board.prototype);
    let board = data as Board
    // setPrototypeOf gives a performance penalty, creating a copy with the
    // right prototype will be faster.
    // could also use my ATV format... or Google Protocol Buffers
    Object.setPrototypeOf(board, Board.prototype);
    for(let layer of board.layers) {
      layer.board = board;
      Object.setPrototypeOf(layer, Layer.prototype);
      for (let figure of layer.data) {
        switch(figure.type) {
          case 'rect': Object.setPrototypeOf(figure, FRectangle.prototype); break;
          default:
            console.log("classifyBoard: unhandled figure type '"+figure.type+"'");
        }
      }
    }
    return board;
  }

}
