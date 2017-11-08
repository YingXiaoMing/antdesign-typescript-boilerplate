import { UserRoleMap } from '../../utils/constants';
import * as React from 'react';
import { IUser } from '../../typings/User';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import { Table, Button } from 'antd';
import { formatDateString } from '../../utils';
import { RoutePath } from '../../utils/routes';
import { RouterDecorator, IRouterContext } from '../../decorators/ContextRouterDecorator';
import { ActiveTableRowDecorator } from '../../decorators/ActiveTableRowDecorator';
import { confirm } from "../../utils/antdConfirmModal";
import { UserApi } from '../../services/sUser';
import { success } from '../../utils/antdMessage';

export class IUserTable extends Table<IUser> { }
export class IUserTableColumn extends Table.Column<IUser> { } 

@ActiveTableRowDecorator
@RouterDecorator
export class UserTable extends React.Component<any, any> { 
  
  context: IRouterContext

  onRowEdit = (user: IUser) => {
    this.props.activeRow(String(user._id));
    this.context.router.push(`${RoutePath.USER}/${user._id}`);
  }

  renderButtonList = (text, user: IUser) => {
    return [
      <Button type="primary" onClick={ this.onRowEdit.bind(this, user) }>编辑</Button>
    ]
  }

  render() {

    return <IUserTable { ...this.props }
      { ...TableDefaultProps }
      className="df-table"
      rowKey={ u => u._id.toString() }
      rowClassName={ this.props.renderRowClass }>
      <IUserTableColumn title="用户名" dataIndex="username" />
      <IUserTableColumn title="姓名" dataIndex="name" />
      <IUserTableColumn title="角色" render={(t, u) => UserRoleMap[u.type]} />
      <IUserTableColumn title="操作" render={ this.renderButtonList } />
    </IUserTable>
  }
}