
import { compose, withProps } from 'recompose';

function normalizeFloat(value:string , prevValue:string ) {
  return (!value || (value && value.length < 16 && /^[0-9]+(\.([0-9]{1,2})?)?$/i.test(value))
      ? value
      : prevValue
  );
}

function normalizeInteger(value:string , prevValue:string ) {
  return (!value || (value && value.length < 16 && /^\d+$/.test(value))
      ? value
      : prevValue
  );
}

export default compose(
  withProps(() => ({
    fieldNormalizer: {
      normalizeFloat,
      normalizeInteger,
    },
  })),
);

