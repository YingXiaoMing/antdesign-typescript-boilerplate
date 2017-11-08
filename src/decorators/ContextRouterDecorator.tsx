import * as React from 'react';
import * as ReactRouter from 'react-router';

export interface IRouterContext {
    router: ReactRouter.Router.InjectedRouter;
}

export function RouterDecorator(target: any): any {
    target.contextTypes = target.contextTypes || {};
    target.contextTypes.router = React.PropTypes.object;
}