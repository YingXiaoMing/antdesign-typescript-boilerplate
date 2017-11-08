import { TaskTypeMap } from '../../utils/constants';
import * as React from 'react';
import { ITask } from '../../typings/Task';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import { Table, Button } from 'antd';
import { formatDateString } from '../../utils';
import { RoutePath } from '../../utils/routes';
import { RouterDecorator, IRouterContext } from '../../decorators/ContextRouterDecorator';
import { ActiveTableRowDecorator } from '../../decorators/ActiveTableRowDecorator';
import { confirm } from "../../utils/antdConfirmModal";
import { TaskApi } from '../../services/sTask';
import { success } from '../../utils/antdMessage';

export class ITaskTable extends Table<ITask> { }
export class ITaskTableColumn extends Table.Column<ITask> { } 

@RouterDecorator
export class TaskTable extends React.Component<any, any> { 
  
  context: IRouterContext

  onRowEdit = (task: ITask) => {
   this.context.router.push(`${RoutePath.TASK}/${task._id}`) 
  }

  renderButtonList = (text, task: ITask) => {
    return [
      <Button type="primary" onClick={ this.onRowEdit.bind(this, task) }>编辑</Button>
    ]
  }

  render() {

    return <ITaskTable { ...this.props }
      { ...TableDefaultProps }
      className="df-table"
      rowKey={ u => u._id.toString() }
      rowClassName={ this.props.renderRowClass }>
      <ITaskTableColumn title="任务名称" dataIndex="name" />
      <ITaskTableColumn title="创建时间" render={ (t, tk) => formatDateString(tk.created_at) } />
      <ITaskTableColumn title="创建人" render={ (t, tk) => tk.creator.name }></ITaskTableColumn>
      <ITaskTableColumn title="类型" render={ (t, tk) => TaskTypeMap[tk.type] } />
      <ITaskTableColumn title="操作" render={ this.renderButtonList } />
    </ITaskTable>
  }
}