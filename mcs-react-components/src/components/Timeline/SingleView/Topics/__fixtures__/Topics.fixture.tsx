import * as React from 'react';
import Topics, { TopicsProps } from '../Topics';

const props: TopicsProps = {
  topics: {},
};

const component = (_props: TopicsProps) => <Topics {..._props} />;

component.displayName = "Topics";

export default {
  component,
  props,
};
