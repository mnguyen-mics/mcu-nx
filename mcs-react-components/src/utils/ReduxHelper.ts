
export interface RequestTypes {
  REQUEST:string,
  SUCCESS:string,
  FAILURE:string
}

export const createRequestTypes = (base : string) : RequestTypes => {
  return {
    REQUEST: `${base}_REQUEST`,
    SUCCESS: `${base}_SUCCESS`,
    FAILURE: `${base}_FAILURE`,

  }
};
