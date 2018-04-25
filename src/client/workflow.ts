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
//import {Point, Size, Rectangle} from "./geometry"
import * as dom from "toad.js/lib/dom"
import {
    Action, Signal, Model, Template, Window,
    RadioButtonBase, RadioStateModel, FatRadioButton,
    TextModel, HtmlModel, BooleanModel, NumberModel, TableModel, SelectionModel,
    TableEditMode,
    View, GenericView, TextView,
    bind, action,
    Dialog} from "toad.js"

import { AccountPreferences } from "./AccountPreferences"

import { ORB } from "corba.js"
import { Client_skel } from "../shared/workflow_skel"
import { Server } from "../shared/workflow_stub"
import { Origin, Size, FigureModel, Layer } from "../shared/workflow_valuetype"
import * as valuetype from "../shared/workflow_valuetype"

export async function main(url: string) {

    let orb = new ORB()

    orb.register("Client", Client_impl)
    orb.registerValueType("Origin", Origin)
    orb.registerValueType("Size", Size)
    orb.registerValueType("Figure", Figure)
    orb.registerValueType("Rectangle", Rectangle)
    orb.registerValueType("FigureModel", FigureModel)
    orb.registerValueType("Layer", Layer)
    orb.registerValueType("Board", Board)

    try {
        await orb.connect(url) // FIXME: provide callbacks on ORB like onerror, etc. via getters/setters to WebSocket
    }
    catch(error) {
        document.body.innerHTML = "could not connect to workflow server '"+url+"'. please try again later."
        return
    }
    Client_impl.server = new Server(orb)

    let session=""
    if (document.cookie) {
        let cookies = document.cookie.split(";")
        for(let i=0; i<cookies.length; ++i) {
            let str = cookies[i].trim()
            if (str.indexOf("session=") == 0) {
                session = str.substring(8, str.length)
                break
            }
        }
    }
    Client_impl.server.init(session)
}

class Client_impl extends Client_skel {
    static server?: Server
    server: Server

    constructor(orb: ORB) {
        super(orb)
        console.log("Client_impl.constructor()")
        if (Client_impl.server === undefined)
            throw Error("Client_impl.constructor(): no server")
        this.server = Client_impl.server
    }

    logonScreen(lifetime: number, disclaimer: string, inRemember: boolean, errorMessage: string): void {
        console.log("Client_impl.logonScreen()")

        let template = new Template("logonScreen")

        let logon = template.text("logon", "")
        let password = template.text("password", "")
        let remember = template.boolean("remember", inRemember)
        template.html("disclaimer", disclaimer)
        template.number("lifetime", lifetime, {})
        template.text("message", errorMessage)

        let logonAction = template.action("logon", () => {
            template.clear()
            this.server.logon(logon.value, password.value, remember.value)
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

    homeScreen(cookie: string, avatar: string, email: string, fullname: string, board: Board): void {
        console.log("homeScreen()")

        let homeScreen = dom.instantiateTemplate('homeScreen');
        // msg.board.socket = msg.socket

        if (cookie.length !== 0) {
            document.cookie = cookie
        }
    
        let model = new HtmlModel(`
            <svg height="32" width="32">
                <defs>
                    <clipPath id="mask">
                        <rect x="0" y="0" width="32" height="32" rx="4" ry="4" />
                    </clipPath>
                </defs>
                <rect x="0" y="0" width="32" height="32" rx="4" ry="4" stroke="none" fill="#08f" />
                <image clip-path="url(#mask)" xlink:href="${avatar}" x="2" y="2" width="28px" height="28px" />
            </svg>`)
        bind("avatar", model)
    
        let user = {
            fullname: new TextModel(fullname),
            email: new TextModel(email)
        }
    
        action("account|preferences", () => {
            new AccountPreferences(user)
        })
        action("account|logout", () => {
        })
  
/*
        let toolbar = new Toolbar(dom.find(homeScreen, "#toolbar"), "toolbar");
        let editor = new FigureEditor(dom.find(homeScreen, "#board"), "board", msg.socket, this.classifyBoard(msg.board));

        editor.setTool(toolbar.state.getValue())
        toolbar.state.modified.add(function() {
            editor.setTool(toolbar.state.getValue())
        })

        this.editor = editor
*/
        bind("board", board)

        dom.erase(document.body);
        dom.add(document.body, homeScreen);
    }
}

class Board extends valuetype.Board
{
    modified: Signal
    constructor() {
        super()
        console.log("workflow.Board.constructor()")
        this.modified = new Signal()
    }
}

class Figure extends valuetype.Figure
{
    constructor() {
        super()
        console.log("workflow.Figure.constructor()")
    }
    
    createSVG(): SVGElement {
        throw Error("Figure.createSVG() is not implemented")
    }
}

class Rectangle extends valuetype.Rectangle
{
    svg?: SVGElement
    stroke: string
    fill: string
    
    constructor() {
        super()
        this.stroke = "#000"
        this.fill = "#f80"
        console.log("workflow.Board.constructor()")
    }

    createSVG(): SVGElement {
       if (this.svg)
         return this.svg
       this.svg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
       this.update()
       return this.svg
    }

    update(): void {
        if (!this.svg)
          return

        let x0=this.origin.x,
            y0=this.origin.y,
            x1=this.origin.x+this.size.width,
            y1=this.origin.y+this.size.height
        if (x1<x0) [x0,x1] = [x1,x0];
        if (y1<y0) [y0,y1] = [y1,y0];
        
        this.svg.setAttributeNS("", "x", String(x0))
        this.svg.setAttributeNS("", "y", String(y0))
        this.svg.setAttributeNS("", "width", String(x1-x0))
        this.svg.setAttributeNS("", "height", String(y1-y0))
        this.svg.setAttributeNS("", "stroke", this.stroke)
        this.svg.setAttributeNS("", "fill", this.fill)
    }
}

class BoardView extends GenericView<Board> {
    svg: SVGElement

    constructor() {
        super()
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        this.attachShadow({mode: 'open'})
        this.shadowRoot!.appendChild(this.svg)
    }
    updateModel() {
        console.log("BoardView.updateModel()")
    }
    updateView() {
        console.log("BoardView.updateView()")
        if (this.model === undefined) {
            return
        }

        let layer = document.createElementNS("http://www.w3.org/2000/svg", "g")
        for(let figure of this.model!.layers[0].data) {
            let f = figure as Figure // FIXME: can we get rid of this?
            layer.appendChild(f.createSVG())
        }
        this.svg.appendChild(layer)
    }
}
window.customElements.define("workflow-board", BoardView)
