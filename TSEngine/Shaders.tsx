export const aVertPos = 'aVertexPosition';
export const aVertCol = 'aVertexColor';
export const aVertNorm = 'aVertexNormal';
export const aTextCoord = 'aTextureCoord';

export const uNormMx = 'uNormalMatrix';
export const uModelViewMx = 'uModelViewMatrix';
export const uProjMx = 'uProjectionMatrix';
export const uSampler = 'uSampler';

export const vColor = 'vColor';
export const vTexCoord = 'vTextureCoord';
export const vLight = 'vLighting';

export const vertexColor = 
`
    attribute vec4 ${aVertPos};
    attribute vec4 ${aVertCol};

    uniform mat4 ${uModelViewMx};
    uniform mat4 ${uProjMx};

    varying lowp vec4 ${vColor};

    void main() 
    {
        gl_Position = ${uProjMx} * ${uModelViewMx} * ${aVertPos};
        ${vColor} = ${aVertCol};
    }
`;

export const vertexTexture = `
    attribute vec4 ${aVertPos};
    attribute vec3 ${aVertNorm};
    attribute vec2 ${aTextCoord};

    uniform mat4 ${uNormMx};
    uniform mat4 ${uModelViewMx};
    uniform mat4 ${uProjMx};

    varying highp vec2 ${vTexCoord};
    varying highp vec3 ${vLight};

    void main() 
    {
        gl_Position = ${uProjMx} * ${uModelViewMx} * ${aVertPos};
        ${vTexCoord} = ${aTextCoord};

        // Lighting

        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(${aVertNorm}, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        ${vLight} = ambientLight + (directionalLightColor * directional);
    }
`;

export const fragmentColor = 
`
    varying lowp vec4 ${vColor};

    void main() 
    {
        gl_FragColor = ${vColor};
    }
`;

export const fragmentTexture = 
`
    varying highp vec2 ${vTexCoord};
    varying highp vec3 ${vLight};

    uniform sampler2D ${uSampler};

    void main() 
    {
        highp vec4 texelColor = texture2D(${uSampler}, ${vTexCoord});

        gl_FragColor = vec4(texelColor.rgb * ${vLight}, texelColor.a);
    }
`;

export function loadShader(
        gl: WebGLRenderingContext, 
        type: number, 
        source: string) 
    : WebGLShader
{
    const shader: WebGLShader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
    {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export interface ProgramInfo 
{
    program: WebGLProgram;
    attributeLocations: 
    { 
        vertexPosition: number, 
        vertexData: number,
        vertexNormal: number,
    };
    uniformLocations: 
    { 
        projectionMatrix: WebGLUniformLocation, 
        modelViewMatrix: WebGLUniformLocation,
        normalMatrix: WebGLUniformLocation,
        sampler: WebGLUniformLocation,
    }; 
}