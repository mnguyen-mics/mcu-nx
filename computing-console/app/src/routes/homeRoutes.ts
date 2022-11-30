import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import HomePage from '../containers/Home/HomePage';

export const homeDefinition: NavigatorDefinition = {
  home: {
    path: '/home',
    layout: 'main',
    contentComponent: HomePage,
  },
};

export const homeRoutes: NavigatorRoute[] = generateRoutesFromDefinition(homeDefinition);
