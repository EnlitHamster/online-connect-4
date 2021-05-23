import * as mat4 from 'gl-mat4';

import * as Shaders from './Shaders';
import { isPowerOf2 } from './Math';

import cubeTexture1 from './../public/assets/texture_1.png';
import cubeTexture2 from './../public/assets/texture_2.png';

type Buffers = 
{ 
    position: WebGLBuffer, 
    normal: WebGLBuffer,
    texture: WebGLBuffer, 
    indeces: WebGLBuffer 
};

const textureTick: number = 0.25;

export class Engine 
{

    gl: WebGLRenderingContext;

    cubeRotation: number = 0.0;

    programInfo: Shaders.ProgramInfo;

    buffers: Buffers;

    texture: WebGLTexture[] = [];
    textureIndex: number;

    then: number = 0;
    nextTexture: number = textureTick;

    constructor(
            gl: WebGLRenderingContext)
    {
        this.gl = gl;
    }

    public testGL(): void
    {
        // Loading the shaders
        const shaderProgram: WebGLProgram = 
        //    this.initShaders(Shaders.vertexColor, Shaders.fragmentColor);
            this.initShaders(Shaders.vertexTexture, Shaders.fragmentTexture);
        this.programInfo = 
        {
            program: shaderProgram,
            attributeLocations: 
            {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, Shaders.aVertPos),
        //        vertexData: this.gl.getAttribLocation(shaderProgram, Shaders.aVertCol),
                vertexData: this.gl.getAttribLocation(shaderProgram, Shaders.aTextCoord),
        //        vertexNormal: null,
                vertexNormal: this.gl.getAttribLocation(shaderProgram, Shaders.aVertNorm),
            },
            uniformLocations:
            {
        //        normalMatrix: null,
                normalMatrix: this.gl.getUniformLocation(shaderProgram, Shaders.uNormMx),
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, Shaders.uProjMx),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, Shaders.uModelViewMx),
        //        sampler: null,
                sampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
            },
        };

        this.initBuffersTexture();

        this.texture[0] = this.loadTexture(cubeTexture1);
        this.texture[1] = this.loadTexture(cubeTexture2);

        this.textureIndex = 0;

        requestAnimationFrame(this.render.bind(this));
    }

    initShaders(
            vertexSource: string,
            fragmentSource: string)
        : WebGLProgram
    {
        const vertexShader: WebGLShader = 
            Shaders.loadShader(this.gl, this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader: WebGLShader =
            Shaders.loadShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentSource);

        const shaderProgram: WebGLProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
        {
            alert('Unable to initialize the shader program ' + this.gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    initBuffer(
            content: any, 
            target: number, 
            usage: number)
        : WebGLBuffer
    {
        const buffer: WebGLBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(target, buffer);
        this.gl.bufferData(target, content, usage);
        return buffer;
    }

    initBuffersTexture(): void
    {
        const positions: number[] = 
        [
            -1.0, +1.0, +1.0,
            +1.0, +1.0, +1.0,
            +1.0, -1.0, +1.0,
            -1.0, -1.0, +1.0,

            -1.0, +1.0, -1.0,
            +1.0, +1.0, -1.0,
            +1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,

            -1.0, +1.0, -1.0,
            -1.0, +1.0, +1.0,
            +1.0, +1.0, +1.0,
            +1.0, +1.0, -1.0,

            -1.0, -1.0, -1.0,
            -1.0, -1.0, +1.0,
            +1.0, -1.0, +1.0,
            +1.0, -1.0, -1.0,

            +1.0, -1.0, -1.0,
            +1.0, +1.0, -1.0,
            +1.0, +1.0, +1.0,
            +1.0, -1.0, +1.0,

            -1.0, -1.0, -1.0,
            -1.0, +1.0, -1.0,
            -1.0, +1.0, +1.0,
            -1.0, -1.0, +1.0,
        ];

        const positionBuffer: WebGLBuffer = 
            this.initBuffer(
                new Float32Array(positions), 
                this.gl.ARRAY_BUFFER, 
                this.gl.STATIC_DRAW);

        const vertexNormals: number[] =
        [
             0.0,  0.0, +1.0,
             0.0,  0.0, +1.0,
             0.0,  0.0, +1.0,
             0.0,  0.0, +1.0,

             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,

             0.0, +1.0,  0.0,
             0.0, +1.0,  0.0,
             0.0, +1.0,  0.0,
             0.0, +1.0,  0.0,

             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,

            +1.0,  0.0,  0.0,
            +1.0,  0.0,  0.0,
            +1.0,  0.0,  0.0,
            +1.0,  0.0,  0.0,

            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
        ];

        const normalBuffer: WebGLBuffer =
            this.initBuffer(
                new Float32Array(vertexNormals),
                this.gl.ARRAY_BUFFER,
                this.gl.STATIC_DRAW);

        const textureCoordinates: number[] =
        [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];

        const textureCoordBuffer: WebGLBuffer =
            this.initBuffer(
                new Float32Array(textureCoordinates), 
                this.gl.ARRAY_BUFFER, 
                this.gl.STATIC_DRAW);

        const indeces: number[] =
        [
            0,  1,  2,    0,  2,  3,
            4,  5,  6,    4,  6,  7,
            8,  9,  10,   8,  10, 11,
            12, 13, 14,   12, 14, 15,
            16, 17, 18,   16, 18, 19,
            20, 21, 22,   20, 22, 23,
        ]

        const indexBuffer: WebGLBuffer =
            this.initBuffer(
                new Uint16Array(indeces), 
                this.gl.ELEMENT_ARRAY_BUFFER, 
                this.gl.STATIC_DRAW);

        this.buffers = 
        { 
            position: positionBuffer, 
            normal: normalBuffer,
            texture: textureCoordBuffer, 
            indeces: indexBuffer,
        };
    }

    initBuffersColor(): void
    {
        const positions: number[] = 
        [
            -1.0, +1.0, +1.0,
            +1.0, +1.0, +1.0,
            +1.0, -1.0, +1.0,
            -1.0, -1.0, +1.0,

            -1.0, +1.0, -1.0,
            +1.0, +1.0, -1.0,
            +1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,

            -1.0, +1.0, -1.0,
            -1.0, +1.0, +1.0,
            +1.0, +1.0, +1.0,
            +1.0, +1.0, -1.0,

            -1.0, -1.0, -1.0,
            -1.0, -1.0, +1.0,
            +1.0, -1.0, +1.0,
            +1.0, -1.0, -1.0,

            +1.0, -1.0, -1.0,
            +1.0, +1.0, -1.0,
            +1.0, +1.0, +1.0,
            +1.0, -1.0, +1.0,

            -1.0, -1.0, -1.0,
            -1.0, +1.0, -1.0,
            -1.0, +1.0, +1.0,
            -1.0, -1.0, +1.0,
        ];
        const positionBuffer: WebGLBuffer = 
            this.initBuffer(
                new Float32Array(positions), 
                this.gl.ARRAY_BUFFER, 
                this.gl.STATIC_DRAW);

        const faceColors: number[][] =
        [
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 0.0, 0.0, 1.0],
            [0.0, 1.0, 0.0, 1.0],
            [0.0, 0.0, 1.0, 1.0],
            [1.0, 1.0, 0.0, 1.0],
            [1.0, 0.0, 1.0, 1.0],
        ];

        var colors = [];

        for (var j = 0; j < faceColors.length; ++j)
        {
            const c = faceColors[j];
            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer: WebGLBuffer =
            this.initBuffer(
                new Float32Array(colors), 
                this.gl.ARRAY_BUFFER, 
                this.gl.STATIC_DRAW);

        const indeces: number[] =
        [
            0,  1,  2,    0,  2,  3,
            4,  5,  6,    4,  6,  7,
            8,  9,  10,   8,  10, 11,
            12, 13, 14,   12, 14, 15,
            16, 17, 18,   16, 18, 19,
            20, 21, 22,   20, 22, 23,
        ]

        const indexBuffer: WebGLBuffer =
            this.initBuffer(
                new Uint16Array(indeces), 
                this.gl.ELEMENT_ARRAY_BUFFER, 
                this.gl.STATIC_DRAW);

        this.buffers = 
        { 
            position: positionBuffer, 
            normal: null,
            texture: colorBuffer, 
            indeces: indexBuffer ,
        };
    }

    drawScene(
            deltaTime: number)
        : void
    {
        // Setting the background
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const fieldOfView: number = 45 * Math.PI / 180;
        const aspect: number = this.gl.canvas.width / this.gl.canvas.height;
        const zNear: number = 0.1;
        const zFar: number = 100.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        const modelViewMatrix = mat4.create();

        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            [-0.0, 0.0, -6.0]);

        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            this.cubeRotation,
            [0, 0, 1]);

        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            this.cubeRotation * .5,
            [0, 1, 0]);

        const normalMatrix = mat4.create();

        if (this.buffers.normal)
        {
            mat4.invert(
                normalMatrix,
                modelViewMatrix);

            mat4.transpose(
                normalMatrix,
                normalMatrix);
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indeces);

        {
            const numComponents: number = 3;
            const type: number = this.gl.FLOAT;
            const normalize: boolean = false;
            const stride: number = 0;
            const offset: number = 0;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.vertexAttribPointer(
                this.programInfo.attributeLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(this.programInfo.attributeLocations.vertexPosition);
        }

        if (this.buffers.normal)
        {
            const numComponents: number = 3;
            const type: number = this.gl.FLOAT;
            const normalize: boolean = false;
            const stride: number = 0;
            const offset: number = 0;
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normal);
            this.gl.vertexAttribPointer(
                this.programInfo.attributeLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(this.programInfo.attributeLocations.vertexNormal);
        }

        {
            const numComponents: number = 
                this.programInfo.uniformLocations.sampler ? 2 : 4;
            const type: number = this.gl.FLOAT;
            const normalize: boolean = false;
            const stride: number = 0;
            const offset: number = 0;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texture);
            this.gl.vertexAttribPointer(
                this.programInfo.attributeLocations.vertexData,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(this.programInfo.attributeLocations.vertexData);
        }

        this.gl.useProgram(this.programInfo.program);
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        if (this.buffers.normal)
        {
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.normalMatrix,
                false,
                normalMatrix);
        }

        if (this.programInfo.uniformLocations.sampler)
        {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture[this.textureIndex]);
            this.gl.uniform1i(this.programInfo.uniformLocations.sampler, 0);
        }

        {
            const vertexCount = 36;
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
        }

        this.cubeRotation += deltaTime;
        this.nextTexture -= deltaTime;

        console.log(this.nextTexture);

        if (this.nextTexture <= 0)
        {
            this.textureIndex = (this.textureIndex + 1) % this.texture.length;
            this.nextTexture = textureTick;
        }
    }

    render(
            now: number)
        : void
    {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;

        this.drawScene(deltaTime);

        requestAnimationFrame(this.render.bind(this));
    }

    loadTexture(
            url)
        : WebGLTexture
    {
        const texture: WebGLTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        const level: number = 0;
        const internalFormat: number = this.gl.RGBA;
        const width: number = 1;
        const height: number = 1;
        const border: number = 0;
        const srcFormat: number = this.gl.RGBA;
        const srcType: number = this.gl.UNSIGNED_BYTE;
        const pixel: Uint8Array = new Uint8Array([0, 0, 255, 255]);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel);

        const image: HTMLImageElement = new Image();
        var gl: WebGLRenderingContext = this.gl;
        image.onload = function()
        {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D,
                level,
                internalFormat,
                srcFormat,
                srcType,
                image);

            if (isPowerOf2(image.width) && 
                isPowerOf2(image.height))
            {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else
            {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        image.src = url;

        return texture;
    }

}