import { withRouter } from 'react-router-dom';
import { compose, withProps, ComponentEnhancer } from 'recompose';

export default function<TInner, TOutter> (): ComponentEnhancer<TInner, TOutter>{ 
  return compose(
    withRouter,
    withProps(({ match }) => ({
      organisationId: match.params.organisationId,
    })),
  )
};
