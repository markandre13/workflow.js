/*
 *  workflow - A collaborative real-time white- and kanban board
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

import * as value     from "../shared/workflow_value"
import * as valuetype from "../shared/workflow_valuetype"
import * as valueimpl from "../shared/workflow_valueimpl"

import * as geometry from "../shared/geometry"
import {
    Point, Size, Matrix,
    pointPlusSize, pointMinusPoint, pointPlusPoint, pointMultiplyNumber, pointMinus
} from "../shared/geometry"

import { Path } from "./path"
import * as ext from "./path"

export abstract class Figure extends valueimpl.Figure
{
    public static readonly FIGURE_RANGE = 5.0
    public static readonly HANDLE_RANGE = 5.0
    
    constructor(init?: Partial<Figure>) {
        super(init)
//        console.log("workflow.Figure.constructor()")
    }
}

export abstract class AttributedFigure extends Figure implements valuetype.figure.AttributedFigure
{
    stroke!: string
    strokeWidth!: number
    fill!: string

    constructor(init?: Partial<AttributedFigure>) {
        super(init)
        this.stroke = "#000"
        this.strokeWidth = 1.0
        this.fill = "#fff"
//        console.log("workflow.AttributedFigure.constructor()")
    }
}

export abstract class Shape extends AttributedFigure implements valuetype.figure.Shape
{
    origin!: Point
    size!: Size

    constructor(init?: Partial<Shape>) {
        super(init)
        value.figure.initShape(this, init)
    }

    transform(transform: Matrix): boolean {
        if (!transform.isOnlyTranslateAndScale())
            return false
        this.origin = transform.transformPoint(this.origin)
        this.size   = transform.transformSize(this.size)
        this.updateGraphic()
        return true
    }
    
    bounds(): geometry.Rectangle {
        return new geometry.Rectangle(this)
    }
    
    getHandlePosition(i: number): Point | undefined {
        switch(i) {
            case 0: return { x:this.origin.x,                 y:this.origin.y }
            case 1: return { x:this.origin.x+this.size.width, y:this.origin.y }
            case 2: return { x:this.origin.x+this.size.width, y:this.origin.y+this.size.height }
            case 3: return { x:this.origin.x,                 y:this.origin.y+this.size.height }
        }
        return undefined
    }

    setHandlePosition(handle: number, pt: Point): void {
        if (handle<0 || handle>3)
            throw Error("fuck")

        if (handle==0 || handle==3) {
            this.size.width  += this.origin.x - pt.x;
            this.origin.x=pt.x;
        } else {
            this.size.width  += pt.x - (this.origin.x+this.size.width)
        }
        if (handle==0 || handle==1) {
            this.size.height += this.origin.y - pt.y
            this.origin.y = pt.y
        } else {
            this.size.height += pt.y - (this.origin.y+this.size.height)
        }
    }
}

export class Rectangle extends Shape implements valuetype.figure.Rectangle
{
    path?: Path
    
    constructor(init?: Partial<Rectangle>) {
        super(init)
        value.figure.initRectangle(this, init)
    }
    
    distance(pt: Point): number {
        // FIXME: not final: RANGE and fill="none" need to be considered
        if (this.origin.x <= pt.x && pt.x < this.origin.x+this.size.width &&
            this.origin.y <= pt.y && pt.y < this.origin.y+this.size.height )
        {
            return -1.0; // even closer than 0
        }
        return Number.MAX_VALUE;
    }
    
    getGraphic(): Graphic {
       if (this.path === undefined) {
           this.path = new Path()
           this.updateGraphic()
       }
       return this.path
    }

    updateGraphic(): void {
        if (!this.path)
          return
        
        this.path.clear()
        this.path.appendRect(this)
        this.path.updateSVG()

        this.path.svg.setAttributeNS("", "stroke", this.stroke)
        this.path.svg.setAttributeNS("", "fill", this.fill)
    }
}

export class Circle extends Shape implements valuetype.figure.Circle
{
    path?: Path
    
    constructor(init?: Partial<Circle>) {
        super(init)
        value.figure.initCircle(this, init)
    }
    
    distance(pt: Point): number {
        let rx = 0.5 * this.size.width,
            ry = 0.5 * this.size.height,
            cx = this.origin.x + rx,
            cy = this.origin.y + ry,
            dx = pt.x - cx,
            dy = pt.y - cy,
            phi = Math.atan( (dy*rx) / (dx*ry) )

        if (dx<0.0)
          phi=phi+Math.PI
        let ex = rx*Math.cos(phi),
            ey = ry*Math.sin(phi)

        if (this.fill !== "none") {
            let d = Math.sqrt(dx*dx+dy*dy)-Math.sqrt(ex*ex+ey*ey)
            if (d<0.0)
                return -1.0
            return d
        }
        dx -= ex
        dy -= ey
        return Math.sqrt(dx*dx+dy*dy)
    }
    
    getGraphic(): Graphic {
       if (this.path === undefined) {
           this.path = new Path()
           this.updateGraphic()
       }
       return this.path
    }

    updateGraphic(): void {
        if (!this.path)
          return
        
        this.path.clear()
        this.path.appendCircle(this)
        this.path.updateSVG()

        this.path.svg.setAttributeNS("", "stroke", this.stroke)
        this.path.svg.setAttributeNS("", "fill", this.fill)
    }
}

export class Group extends Figure implements valuetype.figure.Group
{
    group?: ext.Group // FIXME: private?
    children!: Array<Figure> // FIXME: private

    constructor(init?: Partial<Group>) {
        super(init)
        value.figure.initGroup(this, init)
    }
    
    add(figure: Figure) {
        this.children.push(figure)
        if (this.group)
            this.group.add(figure.getGraphic() as ext.Graphic)
    }

    transform(transform: Matrix): boolean {
        return false
    }
    
    distance(pt: Point): number {
        throw Error("not yet implemented")
    }

    bounds(): geometry.Rectangle {
        throw Error("not yet implemented")
    }
    
    getHandlePosition(i: number): Point | undefined {
        return undefined
    }

    setHandlePosition(handle: number, pt: Point): void {
    }
    
    getGraphic(): Graphic {
       if (this.group === undefined) {
           this.group = new ext.Group()
           for(let child of this.children) {
               let graphic = child.getGraphic() as ext.Graphic
               this.group.add(graphic)
           }
       }
       return this.group
    }

    updateGraphic(): void {
    }
}

export class Transform extends Group implements valuetype.figure.Transform {
    matrix!: Matrix // FIXME?: why store a matrix here when there's also one in ext.Group?

    constructor(init?: Partial<Transform>) {
        super(init)
        value.figure.initTransform(this, init)
    }
    
    add(figure: Figure) {
        this.children.push(figure)
        if (this.group !== undefined) {
            let graphic = figure.getGraphic() as ext.Graphic
            this.group.add(graphic)
        }
    }

    transform(matrix: Matrix): boolean {
        this.matrix.append(matrix)
        if (this.group !== undefined) {
            this.group.transform(matrix)
            this.group.updateSVG()
        }
        return true
    }
    
    distance(pt: Point): number {
        let m = new Matrix(this.matrix)
        m.invert()
        pt = m.transformPoint(pt)
        return this.children[0].distance(pt)
    }

    bounds(): geometry.Rectangle {
        let path = new Path()
        path.appendRect(this.children[0].bounds())
        path.transform(this.matrix)
        return path.bounds()
    }
    
    getHandlePosition(i: number): Point | undefined {
        return undefined
    }

    setHandlePosition(handle: number, pt: Point): void {
    }
    
    getGraphic(): Graphic {
       if (this.group === undefined) {
           this.group = new ext.Group()
           for(let child of this.children) {
               this.group.add(child.getGraphic() as ext.Graphic)
           }
           this.group.transform(this.matrix)
       }
       return this.group
    }

    updateGraphic(): void {
    }
}
