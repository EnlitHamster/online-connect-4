export function initProgramParams<T>(
    gl: WebGLRenderingContext,
    initVector: { [name: string]: T },
    program: WebGLProgram,
    pname: number,
    getActive: (p: WebGLProgram, i: number) => WebGLActiveInfo,
    getLoc: (p: WebGLProgram, n: string) => T
): void
{
    let count: number = gl.getProgramParameter(program, pname);
    for (let i: number = 0; i < count; ++i)
    {
        let info: WebGLActiveInfo = getActive(program, i);
        if (!info)
        {
            break;
        }
        initVector[info.name] = getLoc(program, info.name);
    }
}