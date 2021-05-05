import { generateRoutesFromDefinition, NavigatorDefinition, NavigatorRoute } from './domain';
import HomePage from '../containers/home/HomePage'

export const homeDefinition: NavigatorDefinition = {
  home: {
    path: '/',
    layout: 'main',
    contentComponent: HomePage
  }
}

export const homeRoutes: NavigatorRoute[] = generateRoutesFromDefinition(
  homeDefinition,
);