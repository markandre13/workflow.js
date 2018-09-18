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

/*

the tests here were written switching from HeadlessChrome to regular Chrome,
perform a visual check and then translate that visual check to the tests
you'll see below.

diff --git a/karma.conf.js b/karma.conf.js
index 70658e7..90a6a7b 100644
--- a/karma.conf.js
+++ b/karma.conf.js
@@ -18,9 +18,10 @@ module.exports = (config) => {
     },
     port: 9876,
     colors: true,
-    browsers: ['ChromeHeadless'],
-    autoWatch: false,
-    singleRun: true
+//    browsers: ['ChromeHeadless'],
+    browsers: ['Chrome'],
+    autoWatch: true,
+    singleRun: false
     // browserNoActivityTimeout: 0
   })
 }

*/

import { expect } from "chai"
import { Point, Size, Rectangle, pointEqualsPoint, rectangleEqualsRectangle } from "shared/geometry"
import { Path } from "client/path"
import { WordWrap, WordSource, Slice, SweepEvent } from "client/wordwrap"

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

describe("wordwrap", function() {
    beforeEach(function() {
        document.body.innerHTML=`<svg id="svg" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #ddd" width="640" height="480" viewBox="0 0 640 480">`
    })
    
    describe("pointForBoxInCorner" , function() {
        it("cornerOpensLeftAndRight", function() {
            let path = new Path()
            path.setAttributes({stroke: "#000", fill: "none"})
            path.move( 20, 100)
            path.line(200,  40)
            path.line(380, 100)
            path.close()
            path.updateSVG()
            document.getElementById("svg")!.appendChild(path.svg)
        
            let wordwrap = new WordWrap(path)
        
            let e0 = wordwrap.eventQueue.shift()
            let e1 = wordwrap.eventQueue.shift()
        
            let box = new Size(80, 20)
            let pt = wordwrap.pointForBoxInCorner(box, e0, e1)
            
            expect(pt).not.to.be.undefined
            expect(pointEqualsPoint(pt!, new Point(160, 53.33333333333333))).to.be.true
            
            path = new Path()
            let rectangle = new Rectangle(pt!, box)
            path.appendRect(rectangle)
            path.setAttributes({stroke: "#f80", fill: "none"})
            path.updateSVG()
            document.getElementById("svg")!.appendChild(path.svg)
        })
    })

    it("rectangle", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.appendRect(new Rectangle(20,20,200,200))
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
        expect(boxsource.rectangles.length).to.equal(52)

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[0],
          new Rectangle(172.90322580645162, 49.03225806451613, 40, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[1],
          new Rectangle(112.90322580645162, 69.03225806451613, 20, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[51],
          new Rectangle(171.8279569892473, 209.03225806451613, 20, 20)
        )).to.be.true
    })


    it("rhomb", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.move(200,  40)
        path.line(400, 180)
        path.line(150, 250)
        path.line( 20, 100)
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
        expect(boxsource.rectangles.length).to.equal(52)

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[0],
          new Rectangle(172.90322580645162, 49.03225806451613, 40, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[1],
          new Rectangle(112.90322580645162, 69.03225806451613, 20, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[51],
          new Rectangle(171.8279569892473, 209.03225806451613, 20, 20)
        )).to.be.true
    })

// FIXME: the cornerOpens* tests do not fail because of what they tests but because to many elements are added at the bottom

    it("cornerOpensLeftAndRight", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.move(250,  20)
        path.line(400, 240)
        path.line(100, 240)
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
//        console.log(boxsource.rectangles.length)
        
        expect(boxsource.rectangles.length).to.equal(41)
        
        // FIXME: check some rectangles
    })

    it("cornerOpensToTheRight", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.move(20,  20)
        path.line(400, 250)
        path.line(100, 250)
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
//        console.log(boxsource.rectangles.length)
        
        expect(boxsource.rectangles.length).to.equal(40)
        
        // FIXME: check some rectangles
    })

    it("cornerOpensToTheLeft", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.move(480,  20)
        path.line(400, 250)
        path.line(100, 250)
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
//        console.log(boxsource.rectangles.length)
        
        expect(boxsource.rectangles.length).to.equal(40)
        
        // FIXME: check some rectangles
    })

    it("splitAndMergeSplicesOnce", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.move( 20,  40)
        path.line(310,  40)
        path.line(320, 130)
        path.line(330,  40)
        path.line(620,  40)
        path.line(330, 450)
        path.line(320, 310)
        path.line(310, 450)
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
        expect(boxsource.rectangles.length).to.equal(180)

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[0],
          new Rectangle(34.146341463414636, 40, 40, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[7],
          new Rectangle(254.14634146341464, 40, 20, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[8],
          new Rectangle(330, 40, 40, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[178],
          new Rectangle(260.4878048780488, 360, 40, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[179],
          new Rectangle(325, 360, 20, 20)
        )).to.be.true
    })

    it("cornerFitsOnlyAtBottom", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.move( 20,  40)
        path.line(300,  40)
        path.line(320,  10)
        path.line(340,  40)
        path.line(620,  40)
        path.line(330, 450)
        path.line(320, 310)
        path.line(310, 450)
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
        expect(boxsource.rectangles.length).to.equal(168)
        
        expect(rectangleEqualsRectangle(
          boxsource.rectangles[0],
          new Rectangle(300, 40, 40, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[1],
          new Rectangle(48.29268292682927, 60, 20, 20)
        )).to.be.true

        expect(rectangleEqualsRectangle(
          boxsource.rectangles[167],
          new Rectangle(325, 360, 20, 20)
        )).to.be.true
    })

    it("cornerDoesNotFit", function() {
        let path = new Path()
        path.setAttributes({stroke: "#000", fill: "none"})
        path.move( 20,  40)
        path.line(310,  40)
        path.line(320,  10)
        path.line(330,  40)
        path.line(620,  40)
        path.line(330, 450)
        path.line(320, 310)
        path.line(310, 450)
        path.close()
        path.updateSVG()
        document.getElementById("svg")!.appendChild(path.svg)

        let boxsource = new BoxSource()
        let wordwrap = new WordWrap(path, boxsource)
        
        expect(boxsource.rectangles.length).to.not.equal(0)
    })
    
    it("levelSlicesHorizontally", function() {
        let path = new Path()
        path.move(160+20, 10)
        path.line(310, 100+20)
        path.line(160-20, 190)
        path.line(10, 100-20)
        path.close()
        
        let wordwrap = new WordWrap(path)
        expect(wordwrap.eventQueue.length).to.equal(4)
        
        let slices = new Array<Slice>()
        wordwrap.extendSlices(new Point(0,0), new Size(320,200), slices)
        
        expect(wordwrap.eventQueue.length).to.equal(0)
        expect(slices.length).to.equal(1)
        expect(slices[0].left.length).to.equal(2)
        expect(slices[0].right.length).to.equal(2)
        
        wordwrap.levelSlicesHorizontally(slices)
        
        expect(slices[0].left.length).to.equal(3)
        expect(slices[0].right.length).to.equal(3)
        
        expect(pointEqualsPoint(slices[0].left[0].p[0], new Point(180,  10))).to.be.true
        expect(pointEqualsPoint(slices[0].left[0].p[1], new Point( 10,  80))).to.be.true

        expect(pointEqualsPoint(slices[0].left[1].p[0], new Point( 10,  80))).to.be.true
        expect(pointEqualsPoint(slices[0].left[1].p[1], new Point(57.27272727272727, 120))).to.be.true

        expect(pointEqualsPoint(slices[0].left[2].p[0], new Point(57.27272727272727, 120))).to.be.true
        expect(pointEqualsPoint(slices[0].left[2].p[1], new Point(140, 190))).to.be.true

        expect(pointEqualsPoint(slices[0].right[0].p[0], new Point(180,  10))).to.be.true
        expect(pointEqualsPoint(slices[0].right[0].p[1], new Point(262.72727272727275, 80))).to.be.true

        expect(pointEqualsPoint(slices[0].right[1].p[0], new Point(262.72727272727275, 80))).to.be.true
        expect(pointEqualsPoint(slices[0].right[1].p[1], new Point(310,  120))).to.be.true

        expect(pointEqualsPoint(slices[0].right[2].p[0], new Point(310,  120))).to.be.true
        expect(pointEqualsPoint(slices[0].right[2].p[1], new Point(140, 190))).to.be.true
    })
})