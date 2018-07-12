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

import {
    Point, Rectangle, Matrix,
    pointPlusPoint, pointMinusPoint, pointMultiplyNumber, pointMinus
} from "../../shared/geometry"
import { Path } from "../Path"
import { Figure } from "../figure"
import { FigureEditor, FigureSelectionModel, EditorEvent } from "../editor.ts"

export class Tool {
    static selection: FigureSelectionModel // = new FigureSelection()

    handles: Map<Figure, Array<Path>>
    outlines: Map<Figure, Path>

    activate(e: EditorEvent) {}
    deactivate(e: EditorEvent) {}
    mousedown(e: EditorEvent) {}
    mousemove(e: EditorEvent) {}
    mouseup(e: EditorEvent) {}
    
    constructor() {
        if (Tool.selection === undefined) Tool.selection = new FigureSelectionModel() // FIXME: initialization via static doesn't work
        this.handles = new Map<Figure, Array<Path>>()
        this.outlines = new Map<Figure, Path>()
    }

    static createOutlineCopy(aPath: Path): Path {
        let path = new Path(aPath)
        path.update()
        path.svg.setAttributeNS("", "stroke", "rgb(79,128,255)")
        path.svg.setAttributeNS("", "fill", "none")
        // FIXME: if it's a group, iterate over all elements
        // FIXME: translate outline by (-1, +1)
        return path
    }
    
    createOutlines(editor: FigureEditor): void { // FIXME: rename into createOutlinesForSelection()
        for(let figure of Tool.selection.selection) {
            if (this.outlines.has(figure))
                continue
            let outline = Tool.createOutlineCopy(figure.getPath() as Path)
            editor.decorationOverlay.appendChild(outline.svg)
            this.outlines.set(figure, outline)
        }
    }
    
    removeOutlines(editor: FigureEditor): void {
        for(let pair of this.outlines) {
            editor.decorationOverlay.removeChild(pair[1].svg)
        }
        this.outlines.clear()
    }
}