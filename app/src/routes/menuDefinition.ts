
import {  generateMissingdefinitionItemFromRoute, NavigatorMenuDefinition } from './domain';
import { HomePage } from '../containers/home';


const homeMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'library',
  displayName: 'home',
  type: 'simple',
  ...generateMissingdefinitionItemFromRoute({
    path: '/home',
    layout: 'main',
    contentComponent: HomePage
  })
}

export const menuDefinitions: NavigatorMenuDefinition[] = [
  homeMenuDefinition
];