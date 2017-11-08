import * as React from 'react';
import { browserHistory } from 'dva/router';

export const wrapChildrenProps = function wrapChildrenProps(children, props) {
  return React.Children.map(children, (child: React.ReactElement<any>) => React.cloneElement(child, props));
}