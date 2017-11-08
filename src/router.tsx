import * as React from 'react';

import { Router, Route, IndexRoute, Redirect, RouterState, RedirectFunction } from 'dva/router';
import { RoutePath } from './utils/routes';
import * as _ from 'lodash';

const wrapRouteParam = (pathname) => {
  return (nextState: RouterState, replace: RedirectFunction) => {
    nextState.params.basePathName = pathname;
  }
}

const stateMap = {};
const createRouteStateHook = (pathname) => {
  return (nextState: RouterState, replace: RedirectFunction) => {
    const { location } = nextState;
    if (!_.isEmpty(location.state)) {
      stateMap[pathname] = location.state;
      replace({ pathname, search: null, query: null, state: null });
    }
  }
}

export const getRouteState = (pathname) => {
  return stateMap[pathname]
}

export const clearRouteState = (pathname) => {
  stateMap[pathname] = null;
}

export default function ({ history }) {
  return <Router history={ history }>
      <Redirect from={ RoutePath.ROOT } to={ RoutePath.PAGE } />
    </Router>
}