import * as React from 'react';
import { connect } from 'dva';
import * as _ from "lodash";
import { NameSpaces } from '../../models/nameSpaces';
import { ConnectedComponent } from '../../typings/index';
import { ITask } from '../../typings/Task';
import { PAGE_SIZE } from '../../utils/constants';
import { TaskActionTypes } from '../../models/mTask';
import { Row, Pagination, Button, Select } from 'antd';
import { TaskTable } from './TaskTable';
import { RoutePath } from '../../utils/routes';
import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import { wrapChildrenProps } from '../../utils/reactUtils';
import { PaginationDecorator, PaginationDecoratorProps } from '../../decorators/PaginationDecorator';
import { setComponent } from '../../utils/refs';
import './Task.less'

interface TaskProps extends ConnectedComponent, PaginationDecoratorProps {
  tasks: ITask[],
  tasksLoading: boolean,
  tasksTotal: number
}

@PaginationDecorator('fetchDataSource')
@RouterDecorator
export class TaskView extends React.Component<TaskProps, any> {

  componentWillReceiveProps(nextProps: TaskProps) {

  }

  componentWillMount() {
    this.fetchDataSource();
  }

  context: IRouterContext

  fetchDataSource = (payload?: any) => {
    const { dispatch, pageNumber } = this.props;
    dispatch({ 
      type: `${NameSpaces.TASK}/${TaskActionTypes.FETCH_REMOTE}`, 
      page_number: pageNumber, 
      page_size: PAGE_SIZE,
      ...payload
    });
  }
  
  addNewTask = () => {
    this.context.router.push(`${RoutePath.TASK}/${RoutePath.PARAMS.CREATE}`);
  }

  render() {
    const { tasks, tasksLoading, tasksTotal, children, pageNumber, onPageChange } = this.props;
    return <span><div className="page-header no-border">
        任务管理<span className="button-list"><Button type="primary" onClick={ this.addNewTask }>添加任务</Button></span>
      </div>
      <div className="page-container">
        <TaskTable dataSource={ tasks } loading={ tasksLoading } refresh={ this.fetchDataSource.bind(this) } />
        <Pagination className="mt15 df-pagination" size="small" total={ tasksTotal } pageSize={ PAGE_SIZE } current={ pageNumber } onChange={ onPageChange } />
        { wrapChildrenProps(children, { refresh: this.fetchDataSource.bind(this) }) }
      </div></span>;
  }
}

export const ConnectTaskView = connect(state => {
  return {
    tasks: state[NameSpaces.TASK].list,
    tasksLoading: state[NameSpaces.TASK].listLoading,
    tasksTotal: state[NameSpaces.TASK].total
  }
})(TaskView);