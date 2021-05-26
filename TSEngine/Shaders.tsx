import { gl } from './Globals'
import * as GLUT from './GLUtils'

import * as mat4 from 'gl-mat4';

export abstract class Shader
{
    private _name: string;
    private _program: WebGLProgram;
    private _attributes: { [name: string]: number };
    private _uniforms: { [name: string]: WebGLUniformLocation };

    public constructor(
            name: string)
    {
        this._name = name;
        this._attributes = {};
        this._uniforms ={};
    }

    public destroy(): void
    {

    }

    public get name(): string
    {
        return this._name;
    }

    public setUniformMat4(
        name: string,
        mat4: Float32Array,
        transpose = false
    ): void
    {
        if (!this._uniforms[name])
        {
            console.warn(`Shader ${this._name} does not have uniform ${name}`);
        }
        else
        {
            gl.uniformMatrix4fv(this.getULocation(name), transpose, mat4);
        }
    }

    public setUniformColor(
        name: string,
        color: Float32Array
    ): void
    {
        if (!this._uniforms[name])
        {
            console.warn(`Shader ${this._name} does not have uniform ${name}`);
        }
        else
        {
            gl.uniform4fv(this.getULocation(name), color);
        }
    }

    public setUniformInt(
        name: string,
        int: number
    ): void
    {
        if (!this._uniforms[name])
        {
            console.warn(`Shader ${this._name} does not have uniform ${name}`);
        }
        else
        {
            gl.uniform1i(this.getULocation(name), int);
        }
    }

    public getULocation(
        name: string
    ): WebGLUniformLocation
    {
        if (!this._uniforms[name])
        {
            throw new Error(`Shader ${this._name} does not have uniform ${name}`);
        }
        
        return this._uniforms[name];
    }

    public getALocation(
        name: string
    ): number
    {
        if (!this._attributes[name])
        {
            throw new Error(`Shader ${this._name} does not have attribute ${name}`);
        }

        return this._attributes[name];
    }

    public abstract applyUniforms(
        //material: Material,
        model: Float32Array,
        view: Float32Array,
        projection: Float32Array
    ): void

    public load(
        vertexSrc: string,
        fragmentSrc: string
    ): void
    {
        this._program = gl.createProgram();

        gl.attachShader(this._program, this.createShader(vertexSrc, gl.VERTEX_SHADER));
        gl.attachShader(this._program, this.createShader(fragmentSrc, gl.FRAGMENT_SHADER));

        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.COMPILE_STATUS))
        {
            throw new Error(`An error occurred linking program for ${this._name}: ${gl.getProgramInfoLog(this._program).trim()}`);
        }

        GLUT.initProgramParams<number>(
            gl, 
            this._attributes, 
            this._program, 
            gl.ACTIVE_ATTRIBUTES, 
            gl.getActiveAttrib, 
            gl.getAttribLocation);

        GLUT.initProgramParams<WebGLUniformLocation>(
            gl,
            this._uniforms,
            this._program,
            gl.ACTIVE_UNIFORMS,
            gl.getActiveUniform,
            gl.getUniformLocation);
    }

    public createShader(
        source: string,
        type: number
    ): WebGLShader
    {
        let shader: WebGLShader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            throw new Error(`An error occurred compiling the shaders for ${this._name}: ${gl.getShaderInfoLog(shader).trim()}`);
        }

        return shader;
    }
}