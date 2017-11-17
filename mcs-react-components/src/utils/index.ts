
import * as React from 'react';

export type Index<T>= { [key:string]: T}

export type ReactCtor<P> = new(props: P) => React.Component<P, any>