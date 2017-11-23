import { Action, ActionMeta } from "redux-actions";


export interface RequestTypes {
  REQUEST:string;
  SUCCESS:string;
  FAILURE:string;
}

export interface RequestActions<R,S,F> {
  request: R;
  success: S;
  failure: F;
}

export type ActionFunction<X> = (x: X) => Action<X>
export type ActionFunctionMeta<X, M> = (x: X, m: M) => ActionMeta<X,M>


export const createRequestTypes = (base : string) : RequestTypes => {
  return {
    REQUEST: `${base}_REQUEST`,
    SUCCESS: `${base}_SUCCESS`,
    FAILURE: `${base}_FAILURE`,
  }
};
