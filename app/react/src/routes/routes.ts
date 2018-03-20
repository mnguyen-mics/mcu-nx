import React from 'react';
import campaignRoutes from './campaignRoutes';
import automationRoutes from './automationRoutes';
import audienceRoutes from './audienceRoutes';
import creativeRoutes from './creativeRoutes';
import libraryRoutes from './libraryRoutes';
import settingsRoutes from './settingsRoutes';
import datastudioRoutes from './datastudioRoutes';
import analyticsRoutes from './analyticsRoutes';
/**
 * Route object definition
 * {
 *   {String} path exact url where components will render
 *   {String} layout define layout applied, available: main/edit
 *   {Component} contentComponent react component used in Component/MainLayout
 *   {Component} actionBarComponent react component used in Component/MainLayout
 *   {Component} editComponent react component used in Component/EditLayout
 * }
 *
 * Usage: Navigator -> AuthenticatedRoute(path) -> LayoutManager(layout, components) -> Main/EditLayout(components)
 */

export type LayoutTypes = 'main' | 'edit';

export interface RouteDef {
  path: string;
  layout: LayoutTypes;
}

export interface RouteEdit extends RouteDef {
  layout: 'edit';
  editComponent: React.ComponentClass;
}

export interface RouteStandard extends RouteDef {
  layout: 'main';
  contentComponent: React.ComponentClass;
  actionBarComponent?: React.ComponentClass; 
}

const routes: Array<RouteEdit | RouteStandard> = [
  ...campaignRoutes,
  ...automationRoutes,
  ...audienceRoutes,
  ...creativeRoutes,
  ...libraryRoutes,
  ...settingsRoutes,
  ...datastudioRoutes,
  ...analyticsRoutes,
];

export default routes;
