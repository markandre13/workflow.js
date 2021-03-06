import { expect } from "chai"

import { LocalDrawingModel } from "client/figureeditor/LocalDrawingModel"
import { Rectangle } from "client/figures"
import { FigureEditor, Layer } from "client/figureeditor"

describe("FigureEditor", function () {
    describe("arrange", function () {
        it("bring to front", function() {
            const { drawing, editor } = setup()
            drawing.bringToFront(1, [10, 30])
            expect(svgsToNumbers(editor)).to.deep.equal([1, 3, 0, 2])
        })

        it("bring to back", function() {
            const { drawing, editor } = setup()
            drawing.bringToBack(1, [20, 40])
            expect(svgsToNumbers(editor)).to.deep.equal([1, 3, 0, 2])
        })

        it("bring forward", function() {
            const { drawing, editor } = setup()
            drawing.bringForward(1, [10, 30])
            expect(svgsToNumbers(editor)).to.deep.equal([1, 0, 3, 2])
        })

        it("bring backward", function() {
            const { drawing, editor } = setup()
            drawing.bringBackward(1, [20, 40])
            expect(svgsToNumbers(editor)).to.deep.equal([1, 0, 3, 2])
        })

        function svgsToNumbers(editor: FigureEditor) {
            const display: number[] = []
            for(let i=0; i<editor.layer!.children.length; ++i)
                display.push(Number.parseInt(editor.layer!.children[i].getAttributeNS("", "d")!.substr(2, 1)))
            return display
        }

        function setup() {
            const drawing = new LocalDrawingModel()
            const layer = new Layer({ id: 1, name: "Layer 1" })
            drawing.layers.push(layer)

            drawing.add(1, new Rectangle({ id: 10, origin: { x: 0, y: 0 }, size: { width: 10, height: 10 } }))
            drawing.add(1, new Rectangle({ id: 20, origin: { x: 1, y: 1 }, size: { width: 10, height: 10 } }))
            drawing.add(1, new Rectangle({ id: 30, origin: { x: 2, y: 2 }, size: { width: 10, height: 10 } }))
            drawing.add(1, new Rectangle({ id: 40, origin: { x: 3, y: 3 }, size: { width: 10, height: 10 } }))

            const editor = new FigureEditor({model: drawing})
            document.body.innerHTML = ""
            document.body.appendChild(editor)
            return { drawing, editor }
        }
    })
})
