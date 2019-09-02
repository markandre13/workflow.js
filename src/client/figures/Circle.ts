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

 import { Point } from "../../shared/geometry"
import { Path } from "../paths/Path"
import { Shape } from "./Shape"

import * as valuetype from "../../shared/workflow_valuetype"
import * as value     from "../../shared/workflow_value"

export class Circle extends Shape implements valuetype.figure.Circle {
    path?: Path
    constructor(init?: Partial<Circle>) {
        super(init)
        value.figure.initCircle(this, init)
    }
    distance(pt: Point): number {
        let rx = 0.5 * this.size.width, ry = 0.5 * this.size.height, cx = this.origin.x + rx, cy = this.origin.y + ry, dx = pt.x - cx, dy = pt.y - cy, phi = Math.atan((dy * rx) / (dx * ry))
        if (dx < 0.0)
            phi = phi + Math.PI
        let ex = rx * Math.cos(phi), ey = ry * Math.sin(phi)
        if (this.fill !== "none") {
            let d = Math.sqrt(dx * dx + dy * dy) - Math.sqrt(ex * ex + ey * ey)
            if (d < 0.0)
                return -1.0
            return d
        }
        dx -= ex
        dy -= ey
        return Math.sqrt(dx * dx + dy * dy)
    }
    getPath(): Path {
        if (this.path === undefined) {
            this.path = new Path()
            this.updatePath()
        }
        return this.path
    }
    updatePath(): void {
        if (!this.path)
            return
        this.path.clear()
        this.path.appendCircle(this)
        this.path.updateSVG()
        this.path.svg.setAttributeNS("", "stroke", this.stroke)
        this.path.svg.setAttributeNS("", "fill", this.fill)
    }
}