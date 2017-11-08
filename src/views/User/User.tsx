import * as React from 'react';
import { connect } from 'dva';
import * as _ from "lodash";
import { NameSpaces } from '../../models/nameSpaces';
import { ConnectedComponent } from '../../typings/index';
import { IUser } from '../../typings/User';
import { PAGE_SIZE } from '../../utils/constants';
import { UserActionTypes } from '../../models/mUser';
import { Row, Pagination, Button, Select } from 'antd';
import { UserTable } from './UserTable';
import { RoutePath } from '../../utils/routes';
import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import { wrapChildrenProps } from '../../utils/reactUtils';
import { PaginationDecorator, PaginationDecoratorProps } from '../../decorators/PaginationDecorator';
import { setComponent } from '../../utils/refs';

interface UserProps extends ConnectedComponent, PaginationDecoratorProps {
  users: IUser[],
  usersLoading: boolean,
  usersTotal: number
}

@PaginationDecorator('fetchDataSource')
@RouterDecorator
export class UserView extends React.Component<UserProps, any> {

  componentWillReceiveProps(nextProps: UserProps) {
    if (location.pathname !== nextProps.location.pathname && nextProps.location.pathname === RoutePath.USER) {
      this.table.resetActiveRow();
    }
  }

  componentWillMount() {
    this.fetchDataSource();
  }

  context: IRouterContext
  
  table: any

  fetchDataSource = (payload?: any) => {
    const { dispatch, pageNumber } = this.props;
    dispatch({ 
      type: `${NameSpaces.USER}/${UserActionTypes.FETCH_REMOTE}`, 
      page_number: pageNumber, 
      page_size: PAGE_SIZE,
      ...payload
    });
  }
  
  addNewUser = () => {
    this.context.router.push(`${RoutePath.USER}/${RoutePath.PARAMS.CREATE}`);
  }

  render() {
    const { users, usersLoading, usersTotal, children, pageNumber, onPageChange } = this.props;
    return <span><div className="page-header no-border">
        用户管理<span className="button-list"><Button type="primary" onClick={ this.addNewUser }>添加用户</Button></span>
      </div>
      <div className="page-container">
        <UserTable ref={ C => { this.table = setComponent(C) } } dataSource={ users } loading={ usersLoading } refresh={ this.fetchDataSource.bind(this) } />
        <Pagination className="mt15 df-pagination" size="small" total={ usersTotal } pageSize={ PAGE_SIZE } current={ pageNumber } onChange={ onPageChange } />
        { wrapChildrenProps(children, { refresh: this.fetchDataSource.bind(this) }) }
      </div></span>;
  }
}

export const ConnectUserView = connect(state => {
  return {
    users: state[NameSpaces.USER].list,
    usersLoading: state[NameSpaces.USER].listLoading,
    usersTotal: state[NameSpaces.USER].total
  }
})(UserView);