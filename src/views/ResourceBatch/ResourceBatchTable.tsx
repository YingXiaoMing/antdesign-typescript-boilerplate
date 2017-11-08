import * as React from 'react';
import { IResourceBatch } from '../../typings/ResourceBatch';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import { Table, Button } from 'antd';
import { formatDateString } from '../../utils';
import { RoutePath } from '../../utils/routes';
import { RouterDecorator, IRouterContext } from '../../decorators/ContextRouterDecorator';
import { ActiveTableRowDecorator } from '../../decorators/ActiveTableRowDecorator';
import { confirm } from "../../utils/antdConfirmModal";
import { success } from '../../utils/antdMessage';

export class IResourceBatchTable extends Table<IResourceBatch> { }
export class IResourceBatchTableColumn extends Table.Column<IResourceBatch> { } 

@RouterDecorator
export class ResourceBatchTable extends React.Component<any, any> { 
  
  context: IRouterContext

  onRowEdit = (resourceBatch: IResourceBatch) => {
   this.context.router.push(`${RoutePath.TASK}/${resourceBatch._id}`) 
  }

  renderButtonList = (text, resourceBatch: IResourceBatch) => {
    return [
      <Button type="primary" onClick={ this.onRowEdit.bind(this, resourceBatch) }>编辑</Button>
    ]
  }

  render() {

    return <IResourceBatchTable { ...this.props }
      { ...TableDefaultProps }
      className="df-table"
      rowKey={ rb => rb._id.toString() }
      rowClassName={ this.props.renderRowClass }>
      <IResourceBatchTableColumn title="批次名称" dataIndex="name" />
      <IResourceBatchTableColumn title="服务器路径" dataIndex="root" />
      <IResourceBatchTableColumn title="关联任务" dataIndex="task.name" />
      <IResourceBatchTableColumn title="创建时间" render={ (t, rb) => formatDateString(rb.created_at) } />
      <IResourceBatchTableColumn title="创建人" render={ (t, rb) => rb.creator.name }></IResourceBatchTableColumn>
      <IResourceBatchTableColumn title="数量" dataIndex="total" />
    </IResourceBatchTable>
  }
}