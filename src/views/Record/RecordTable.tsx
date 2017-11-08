import * as React from 'react';
import { IRecord } from '../../typings/Record';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import { Table, Button } from 'antd';
import { formatDateString } from '../../utils';
import { RoutePath } from '../../utils/routes';
import { RouterDecorator, IRouterContext } from '../../decorators/ContextRouterDecorator';
import { confirm } from "../../utils/antdConfirmModal";
import { success } from '../../utils/antdMessage';

export class IRecordTable extends Table<IRecord> { }
export class IRecordTableColumn extends Table.Column<IRecord> { } 

@RouterDecorator
export class RecordTable extends React.Component<any, any> { 
  
  context: IRouterContext

  onRowEdit = (record: IRecord) => {
   this.context.router.push(`${RoutePath.RECORD}/${record._id}`) 
  }

  renderButtonList = (text, record: IRecord) => {
    return <Button type="primary" onClick={ this.onRowEdit.bind(this, record) }>{ record.result ? '查看' : '标注' }</Button>
  }

  render() {

    return <IRecordTable { ...this.props }
      { ...TableDefaultProps }
      className="df-table"
      rowKey={ rb => rb._id.toString() }
      rowClassName={ this.props.renderRowClass }>
      <IRecordTableColumn title="记录ID" dataIndex="_id" />
      <IRecordTableColumn title="文件名称" dataIndex="fileName" />
      <IRecordTableColumn title="批次名称" dataIndex="resourceBatch.name" />
      <IRecordTableColumn title="任务名称" dataIndex="task.name" />
      <IRecordTableColumn title="操作员" dataIndex="operator.name" />
      <IRecordTableColumn title="标注时间" render={ (t, r) => formatDateString(r.updated_at) } />
      <IRecordTableColumn title="文件类型" dataIndex="fileType"></IRecordTableColumn>
      <IRecordTableColumn title="操作" render={ this.renderButtonList }></IRecordTableColumn>
    </IRecordTable>
  }
}