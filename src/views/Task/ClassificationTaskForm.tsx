import { setComponent } from '../../utils/refs';
import Button from 'antd/es/button';
import { watch } from 'fs';
import { IIDGenerator, IDGenerator } from '../../utils';
import { EditableTagGroup } from '../../pureComponents/EditableTagGroup';
import { TaskClassificationType, TaskClassificationTypeMap } from '../../utils/constants';
import * as React from 'react';
import { ITask, IClassificationTask } from '../../typings/Task';
import { Table, Radio, Input } from 'antd';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import * as _ from 'lodash';

interface ClassificationTaskProps {
  task: ITask
}

interface ClassificationTaskState {
  items: IClassificationTask[]
} 

class IClassificationTaskTable extends Table<IClassificationTask> {}
class IClassificationTaskTableColumn extends Table.Column<IClassificationTask> {}

export class ClassificationTaskForm extends React.Component<ClassificationTaskProps, ClassificationTaskState> {

  componentWillReceiveProps(nextProps: ClassificationTaskProps) {
    let sItems;
    if (nextProps.task.content && nextProps.task.content.length > 0) {
      this.setState({ items: nextProps.task.content })
    } else {
      this.setState({ items: [ this.getEmptyTask() ] })
    }
  }

  getEmptyTask = (): IClassificationTask => {
    return {
      _id: this.IDGenerator.getNewId(),
      type: TaskClassificationType.MULTIPLE,
      title: '',
      options: []
    }
  }

  IDGenerator: IIDGenerator = new IDGenerator('CK')

  state = {
    items: [] as Array<IClassificationTask>
  }

  refreshTable = () => {
    this.setState({ items: [ ...this.state.items ] })
  }

  onTaskTitleChange = (ct: IClassificationTask) => {
    return (e: React.SyntheticEvent<any>) => {
      ct.title = (e.target as HTMLInputElement).value
      this.refreshTable()
    }
  }

  renderTaskTitle = (text, ct: IClassificationTask) => {
    return <Input placeholder="请输入任务标题" value={ ct.title } onChange={ this.onTaskTitleChange(ct) } />
  }

  onTaskTypeChange = (ct: IClassificationTask) => {
    return  (e: React.SyntheticEvent<any>) => {
      ct.type = +(e.target as HTMLInputElement).value
      this.refreshTable()
    }
  }

  renderTaskType = (text, ct: IClassificationTask) => {
    return <Radio.Group value={ ct.type } onChange={ this.onTaskTypeChange(ct) }>
      <Radio value={ TaskClassificationType.SINGLE }>{ TaskClassificationTypeMap[TaskClassificationType.SINGLE] }</Radio>
      <Radio value={ TaskClassificationType.MULTIPLE }>{ TaskClassificationTypeMap[TaskClassificationType.MULTIPLE] }</Radio>
    </Radio.Group>
  }

  onTaskOptionsConfirmed = (ct: IClassificationTask) => {
    return (tags: string[]) => {
      ct.options = [ ...tags ]
      this.refreshTable()
    }
  }
  
  renderTaskOptions = (text, ct: IClassificationTask) => {
    return  <EditableTagGroup tags={ ct.options || [] } handleConfirm={ this.onTaskOptionsConfirmed(ct) } /> 
  }

  addNewClassification = () => {
    this.setState({ items: [ ...this.state.items, this.getEmptyTask() ] })
  }

  onDeleteRow = (ct: IClassificationTask) => {
    this.setState({ items: this.state.items.filter(i => i._id !== ct._id) })
  }

  renderButton = (text, ct) => {
    return <Button type="primary" className="df-btn-grey" onClick={ this.onDeleteRow.bind(this, ct) }>删除</Button>
  }

  getFieldValue = () => {
    return _.map(this.state.items, item => {
      if (this.IDGenerator.is(item._id)) {
        delete item._id
      }
      return item
    })
  }
  
  render() {
    const { task } = this.props;
    return <div className="detail-card">
      <div className="card-header">分类任务问题列表</div>
      <IClassificationTaskTable { ...TableDefaultProps }
        dataSource={ this.state.items }
        className="df-table"
        style={{ marginTop: '20px' }}
        rowKey={ ct => ct._id }>
        <IClassificationTaskTableColumn width={280} title="标题" dataIndex="title" render={ this.renderTaskTitle }></IClassificationTaskTableColumn>
        <IClassificationTaskTableColumn width={280} title="类型" render={ this.renderTaskType }></IClassificationTaskTableColumn>
        <IClassificationTaskTableColumn className="tx-l" title="选项" render={ this.renderTaskOptions }></IClassificationTaskTableColumn>
        <IClassificationTaskTableColumn width={150} title="选项" render={ this.renderButton }></IClassificationTaskTableColumn>
      </IClassificationTaskTable>
      <Button type="primary" onClick={ this.addNewClassification } style={{ marginTop: '15px' }}>添加新问题</Button>
    </div>
  }
}