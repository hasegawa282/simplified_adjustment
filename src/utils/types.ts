export interface SizeWH {
    width: number;
    height: number;
}

export interface VectorXY {
    x: number;
    y: number;
}

export interface ObjectType<T> {
    [key: string]: T;
}