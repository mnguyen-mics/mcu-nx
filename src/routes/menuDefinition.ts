import { homeDefinition } from './homeRoutes';
import {  generateMissingdefinitionItemFromRoute, NavigatorMenuDefinition } from './domain';


const homeMenuDefinition: NavigatorMenuDefinition = {
  iconType: 'library',
  displayName: 'home',
  type: 'simple',
  ...generateMissingdefinitionItemFromRoute(homeDefinition.home)
}

export const menuDefinitions: NavigatorMenuDefinition[] = [
  homeMenuDefinition
];