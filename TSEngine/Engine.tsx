import { Buffers } from './Types';

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