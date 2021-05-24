/// <reference path="./Engine.tsx" />

namespace TSEngine
{

    class Shader
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

        public load(
            vertexSrc: string,
            fragmentSrc: string
        ): void
        {
            let shader: WebGLShader = gl.createShaders();
        }
    }
}