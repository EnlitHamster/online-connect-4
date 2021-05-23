export function isPowerOf2(
        value: number)
    : boolean
{
    return (value & (value - 1)) == 0;
}