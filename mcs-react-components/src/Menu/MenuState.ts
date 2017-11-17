
import {Action, createAction} from 'redux-actions';
import {LayoutMode} from '../Layout/View';

export const MENU_OPEN_CLOSE = 'MENU_OPEN_CLOSE';
export const openCloseMenu = createAction<MenuState>(MENU_OPEN_CLOSE);

import { Tree } from '../utils/Tree';
import { FormattedMessage } from 'react-intl';
import {RouteDesc} from '../Route';
import {McsIconType} from '../McsIcons';

//extends Partial<RouteDesc> needed so that the following is legal:
// const menuItem = {...routeDesc, key: 'K', }
export interface MenuItem extends Tree<MenuItem>, Partial<RouteDesc> {
    key: string,
    iconType?: McsIconType,
    name: FormattedMessage.MessageDescriptor,
    path: string,
    children?: Array<MenuItem>
}


export interface MenuState {
  collapsed: boolean,
  mode: LayoutMode
}

const openMenuDefaultState : MenuState = {
  collapsed: false,
  mode: 'inline',
};

const menu = (state = openMenuDefaultState, action: Action<MenuState>) => {

  switch (action.type) {
    case MENU_OPEN_CLOSE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }

};


export const MenuReducers = {
  menu,
};
