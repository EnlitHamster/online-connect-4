import * as mat4 from 'gl-mat4';

import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { Buffers } from './Types';

namespace TSEngine
{

    // Rendering context used by the engine.
    var gl: WebGLRenderingContext;
    var canvas: HTMLCanvasElement;

    export function initGL(): void
    {
        // GL id
        const glId: string = 'gl-canvas';
        // Correct canvas width
        const canvasWidth: number = document.body.clientWidth;
        const canvasHeight: number = document.body.clientHeight;

        // Adding the canvas to the html page
        ReactDOM.render(React.createElement("canvas", 
            { id: `${glId}`, width: canvasWidth, height: canvasHeight }), document.body);

        // Getting the WebGL context
        canvas = document.querySelector(`#${glId}`);
        gl = canvas.getContext("webgl");

        if (gl == null) 
        {
            alert('WebGL not available');
        } 
    }

    export class Engine
    {
        // Rendering buffers for WebGL rendering.
        _buffers: Buffers;
    
        // Last rendering time.
        _then: number;
    
        constructor()
        {
            this._then = 0;
        }
    }

}