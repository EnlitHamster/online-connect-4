import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { Engine } from './TSEngine/Engine';

window.onload = function () 
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
    const canvas: HTMLCanvasElement = document.querySelector(`#${glId}`);
    const gl: WebGLRenderingContext = canvas.getContext("webgl");

    if (gl == null) 
    {
        alert('WebGL not available');
    } 
    else 
    {
        const engine: Engine = new Engine(gl);
        engine.testGL();
    }
}