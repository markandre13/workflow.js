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

import * as value from "../../shared/workflow_value"
import {
    Point, Size, Rectangle, Matrix,
    pointPlusSize, pointMinusPoint, pointPlusPoint, pointMultiplyNumber,
    pointMinus, pointEqualsPoint, signedArea, isZero, distancePointToLine
} from "../../shared/geometry"
import { Path } from "../path"

import { WordWrapTestRunner } from "./testrunner"
import { WordSource } from "./wordwrap"

// FIXME: document attributes
interface SliderTest {
    only?: boolean
    title: string
    polygon?: Array<Point>
    box?: value.Rectangle
}

// draw the expected box and the result
// mark image when test failed to execute
// line breaks, headings
// middle mouse, dump test data for copy'n pasting it back?

const sliderTest: SliderTest[] = [
{
    title: "pointForBoxInCorner"
},
{
    title: "wide/edge/right",
    polygon: [
        {x:  10, y:  20},
        {x: 310, y: 180},
        {x: 100, y: 180},
    ],
    box: { origin: { x: 76.42857142857144, y: 98.09523809523812 }, size: { width: 80, height: 40 } }
}, {
    title: "wide/edge/left",
    polygon: [
        {x: 310, y:  20},
        {x: 220, y: 180},
        {x:  10, y: 180},
    ],
    box: { origin: { x: 163.57142857142858, y: 98.09523809523807 }, size: { width: 80, height: 40 } }
}, {
    title: "wide/narrow/left&right",
    polygon: [
        {x:  70, y: 180},
        {x: 150, y:  20},
        {x: 170, y:  20},
        {x: 250, y: 180},
    ],
    box: { origin: { x: 120, y: 80 }, size: { width: 80, height: 40 } }
}, { title: "" }, {
    title: "wide/open/right",
    polygon: [
        {x:  10, y:  20},
        {x: 120, y:  20},
        {x: 310, y: 180},
        {x: 100, y: 180},
    ],
    box: { origin: { x: 32.5, y: 20 }, size: { width: 80, height: 40 } }
}, {
    title: "wide/open/left",
    polygon: [
        {x: 200, y:  20},
        {x: 310, y:  20},
        {x: 220, y: 180},
        {x:  10, y: 180},
    ],
    box: { origin: { x: 200, y: 20 }, size: { width: 80, height: 40 } }
}, {
    title: "wide/open/left&right/wide",
    polygon: [
        {x:  70, y: 180},
        {x: 110, y:  20},
        {x: 210, y:  20},
        {x: 250, y: 180},
    ],
    box: { origin: { x: 110, y: 20 }, size: { width: 80, height: 40 } }
}, { title: "" }, {
    title: "narrow top&bottom/open/left&right",
    polygon: [
        {x: 150, y:  20},
        {x: 170, y:  20},
        {x: 190, y: 180},
        {x: 130, y: 180},
    ],
    box: { origin: { x: -1, y: -1 }, size: { width: 80, height: 40 } }
}, {
//    only: true,
    title: "narrow top/open/left&right",
    polygon: [
        {x: 160-10,    y:  20},
        {x: 160+10,    y:  20},
        {x: 160+10+40, y: 120},
        {x: 160-10-40, y: 120},
    ],
    box: { origin: { x: -1, y: -1 }, size: { width: 80, height: 40 } }
}, {
//    only: true,
    title: "narrow bottom/open/left&right",
    polygon: [
        {x: 160-10-40, y:  20},
        {x: 160+10+40, y:  20},
        {x: 160+10,    y: 120},
        {x: 160-10,    y: 120},
    ],
    box: { origin: { x: -1, y: -1 }, size: { width: 80, height: 40 } }
}, { 
  title: "two stripes(?)"
}, {
    title: "xxx",
    polygon: [
        {x: 160, y:  20},
        {x: 210, y: 100},
        {x: 280, y: 180},
        {x:  20, y: 180},
        {x: 110, y: 100},
    ],
    box: { origin: { x: 120, y: 84 }, size: { width: 80, height: 40 } }
}, {
    title: "xxx",
    polygon: [
        {x: 200, y: 100},
        {x:  20, y:  20},
        {x: 100, y: 100},
        {x:  80, y: 180},
        {x: 280, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "xxx",
    polygon: [
        {x: 200, y: 100},
        {x:  20, y:  20},
        {x: 100, y: 100},
        {x: 120, y: 180},
        {x: 280, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}
/*
, {
    title: "left dent",
    polygon: [
        {x: 115, y: 100},
        {x: 160, y:  20},
        {x: 205, y: 100},
        {x: 160, y: 180},
        {x: 140, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "connected",
    polygon: [
        {x: 115, y: 100},
        {x: 160, y:  20},
        {x: 205, y: 100},
        {x: 160, y: 180},
//        {x: 140, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "narrow/open/left&right/inside",
    polygon: [
        {x: 110, y: 180},
        {x: 160, y:  20},
        {x: 210, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "narrow/open/right",
    polygon: [
        {x:  10, y:  20},
        {x: 310, y: 180},
        {x: 170, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "narrow/open/left",
    polygon: [
        {x: 310, y:  20},
        {x: 150, y: 180},
        {x:  10, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "edge/open/left&right/inside",
    polygon: [
        {x:  70, y: 180},
        {x: 160, y:  20},
        {x: 250, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "median/open/right",
    polygon: [
        {x:  10, y:  20},
        {x:  30, y:  20},
        {x: 310, y: 180},
        {x: 100, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "median/open/left",
    polygon: [
        {x: 290, y:  20},
        {x: 310, y:  20},
        {x: 220, y: 180},
        {x:  10, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "wide/open/left&right/wide",
    polygon: [
        {x:  70, y: 180},
        {x: 110, y:  20},
        {x: 210, y:  20},
        {x: 250, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "wide/open/right",
    polygon: [
        {x:  10, y:  20},
        {x: 120, y:  20},
        {x: 310, y: 180},
        {x: 100, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}, {
    title: "wide/open/left",
    polygon: [
        {x: 200, y:  20},
        {x: 310, y:  20},
        {x: 220, y: 180},
        {x:  10, y: 180},
    ],
    box: { origin: { x: 0, y: 0 }, size: { width: 80, height: 40 } }
}*/]

class BoxSource implements WordSource {
    remaining: number
    style: boolean
    box?: Size
    rectangles: Array<Rectangle>
    
    constructor(remaining = 4096) {
        this.remaining = remaining
        this.style = true
        this.rectangles = new Array<Rectangle>()
    }

    pullBox(): Size|undefined {
        if (this.remaining === 0)
            return undefined
        --this.remaining
        this.box = new Size(this.style ? 40 : 20, 20)
        return this.box
    }

    placeBox(origin: Point): void {
        let rectangle = new Rectangle(origin, this.box!)
        this.rectangles.push(rectangle)
        let path = new Path()
        path.appendRect(rectangle)
        path.setAttributes({stroke: this.style ? "#f00" : "#f80", fill: "none"})
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)
        this.style = !this.style
    }
}

export function testWrap() {
    document.body.innerHTML=""

    let only = false
    for(let test of sliderTest) {
        if (test.only === true) {
            only = true
            break
        }
    }

    for(let test of sliderTest) {
        if (only && test.only !== true) {
            continue
        }
        if (test.polygon) {
            let path = new Path()
            for(let point of test.polygon) {
                if (path.empty())
                    path.move(point)
                else
                    path.line(point)
            }
            path.close()
            new WordWrapTestRunner(test.title, path, test.box!)
        } else {
            if (test.title !== "") {
                let heading = document.createElement("h1")
                heading.appendChild(document.createTextNode(test.title))
                document.body.appendChild(heading)
            } else {
                document.body.appendChild(document.createElement("br"))
            }
        }
    }
    
    let debug = document.createElement("pre")
    debug.id = "debug"
    document.body.appendChild(debug)
}
