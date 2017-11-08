import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import { TaskBasicForm, WrappedTaskBasicForm } from './TaskBasicForm';
import FormItem from 'antd/es/form/FormItem';
import Form from 'antd/lib/form';
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'dva';
import { Link } from "dva/router";
import { Button, Breadcrumb, Row, Col, Table, Select, Input } from 'antd';
import { NameSpaces } from '../../models/nameSpaces';
import { ITask } from '../../typings/Task';
import { ConnectedComponent } from '../../typings';
import { RoutePath } from '../../utils/routes';
import { TaskActionTypes } from '../../models/mTask';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import { TaskType, TaskTypeMap, TaskClassificationType, TaskClassificationTypeMap } from '../../utils/constants';
import { TaskApi } from '../../services/sTask';
import { success, error } from '../../utils/antdMessage';
import { setConnectComponent, setComponent } from '../../utils/refs';
import { ClassificationTaskForm } from './ClassificationTaskForm';
const { Item: BreadItem } = Breadcrumb;

interface TaskEditorProps extends ConnectedComponent {
  task: ITask
}

@RouterDecorator
export class TaskEditorView extends React.Component<TaskEditorProps, { saving: boolean }> {

  componentWillMount() {
    const { dispatch, params } = this.props;
    this.isCreate = params.taskId === RoutePath.PARAMS.CREATE
    dispatch({ type: `${NameSpaces.TASK}/${TaskActionTypes.FETCH_PROFILE}`, task_id: this.isCreate ? null : params.taskId });
  }

  state = {
    saving: false
  }

  isCreate: boolean = false
  
  context: IRouterContext

  taskBasicForm: TaskBasicForm = null

  classificationTaskForm: ClassificationTaskForm = null

  save = async () => {
    const { props: { form: basicForm } } = this.taskBasicForm
    this.setState({ saving: true })
    const result = await (this.isCreate ? TaskApi.create : TaskApi.update)({
      ...this.props.task,
      ...basicForm.getFieldsValue(),
      content: this.classificationTaskForm.getFieldValue()
    })
    this.setState({ saving: false })
    if (result && result.task) {
      success(`${ this.isCreate ? '创建' : '更新' }任务成功`);
      this.isCreate = false
      this.props.dispatch({ type: `${NameSpaces.TASK}/${TaskActionTypes.PUT_PROFILE}`, theTask: result.task })
      this.context.router.push(`${RoutePath.TASK}/${result.task._id}`)
    }
  }

  back = () => {
    this.context.router.push(RoutePath.TASK)
    this.props.dispatch({ type: `${NameSpaces.TASK}/${TaskActionTypes.CLEAR_PROFILE}` })
  }

  render() {
    const { task, location, dispatch } = this.props;
    return <span>
      <div className="page-header">
        <Breadcrumb>
          <BreadItem><Link to={{ pathname: RoutePath.TASK, state: location.state }}>任务管理</Link></BreadItem>
          <BreadItem>{ this.isCreate ? '新建任务' : task.name  }</BreadItem>
        </Breadcrumb>
        <span className="button-list">
          <Button type="primary" className="mr5" onClick={ this.save } loading={ this.state.saving }>保存</Button>
          <Button type="primary" className="df-btn-grey" onClick={ this.back }>返回</Button>
        </span>
      </div>
      <div className="page-container df-detailform-page">
        <WrappedTaskBasicForm wrappedComponentRef={ component => { this.taskBasicForm = setComponent(component) } } dispatch={ dispatch } task={ task }></WrappedTaskBasicForm>
        { !task.type || task.type === TaskType.CLASSIFICATION ? <ClassificationTaskForm ref={ component => { this.classificationTaskForm = setComponent(component) } } task={ task } /> : null }
      </div>
    </span>
  }
}

export const ConnectTaskEditor = connect(state => {
  return {
    task: state[NameSpaces.TASK].theTask
  }
})(TaskEditorView);