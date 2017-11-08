import { ResourceBatchActionTypes } from '../../models/mResourceBatch';
import { TaskActionTypes } from '../../models/mTask';
import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'dva';
import { Link } from "dva/router";
import { Button, Breadcrumb, Row, Col, Select, Input, Form, TreeSelect, Tree } from 'antd';
import { NameSpaces } from '../../models/nameSpaces';
import { IResourceBatch, IFolderTreeNode } from '../../typings/ResourceBatch';
import { ConnectedComponent } from '../../typings';
import { RoutePath } from '../../utils/routes';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import { ResourceBatchApi } from '../../services/sResourceBatch';
import { success, error } from '../../utils/antdMessage';
import { setConnectComponent, setComponent } from '../../utils/refs';
import { ITask } from '../../typings/Task';
const { Item: BreadItem } = Breadcrumb
const { TreeNode } = Tree

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

interface ResourceBatchCreateProps extends ConnectedComponent {
  tasks: ITask[],
  files: IFolderTreeNode[]
}

interface ResourceBatchCreateState {
  saving: boolean,
  theResourceBatch: IResourceBatch
}

@RouterDecorator
class ResourceBatchCreate extends React.Component<ResourceBatchCreateProps, ResourceBatchCreateState> {

  componentWillMount() {
    this.props.dispatch({ type: `${NameSpaces.TASK}/${TaskActionTypes.FETCH_REMOTE}`, page_number: 1, page_size: 1000 })
    this.props.dispatch({ type: `${NameSpaces.RESOURCE_BATCH}/${ResourceBatchActionTypes.FETCH_FILES_REMOTE}` })
  }

  state = {
    saving: false,
    theResourceBatch: {} as IResourceBatch
  }

  context: IRouterContext

  save = async () => {
    this.setState({ saving: true })
    const result = await ResourceBatchApi.create({
      ...this.state.theResourceBatch
    })
    this.setState({ saving: false })
    if (result && result.resourceBatch) {
      success('创建批次成功');
      this.back()
    }
  }

  back = () => {
    this.context.router.push(RoutePath.RESOURCE_BATCH)
  }

  setResourceBatchState = (field, value) => {
    this.setState({ theResourceBatch: { ...this.state.theResourceBatch, [field]: value } })
  }

  onNameInputChange = (e: React.SyntheticEvent<any>) => {
    this.setResourceBatchState('name',  (e.target as HTMLInputElement).value)
  }

  onRelatedTaskSelect = (value) => {
    this.setResourceBatchState('task_id', value)
  }

  onFolderSelect = (value) => {
    this.setResourceBatchState('root', value)
  }
  
  renderFolderTree = (files: IFolderTreeNode[], parent: string) => {
    return _.map(files, file => {
      if (file.key === '0') {
        return <TreeNode key={ file.key } title={ file.title } selectable={ false }>
          { file.children && file.children.length ? this.renderFolderTree(file.children, '') : null }
        </TreeNode>
      } else {
        const relativePath = `${parent}${parent ? '/' : ''}${file.title}`
        return <TreeNode key={ file.key } title={ file.title } value={ relativePath } selectable={ true }>
          { file.children && file.children.length ? this.renderFolderTree(file.children, relativePath) : null }
        </TreeNode>
      }
    })
  }

  render() {
    const { tasks, files } = this.props;
    const { theResourceBatch } = this.state
    return <span>
      <div className="page-header">
        <Breadcrumb>
          <BreadItem><Link to={{ pathname: RoutePath.RESOURCE_BATCH }}>批次管理</Link></BreadItem>
          <BreadItem>新建批次</BreadItem>
        </Breadcrumb>
        <span className="button-list">
          <Button type="primary" className="mr5" onClick={ this.save } loading={ this.state.saving }>保存</Button>
          <Button type="primary" className="df-btn-grey" onClick={ this.back }>返回</Button>
        </span>
      </div>
      <div className="page-container df-detailform-page">
        <div className="detail-card">
          <div className="card-header">基本信息</div>
          <Form className="df-form task-form">
            <Row>
              <Col><Form.Item { ...formItemLayout } label="批次名称"><Input value={ theResourceBatch.name } placeholder="请输入批次名称" onChange={ this.onNameInputChange } /></Form.Item></Col>
              <Col><Form.Item { ...formItemLayout } label="关联任务"><Select value={ theResourceBatch.task_id } placeholder="请选择要关联的任务" onChange={ this.onRelatedTaskSelect }>
                  { _.map(tasks, task => <Select.Option value={ task._id }>{ task.name }</Select.Option>) }
                </Select></Form.Item></Col>
              <Col><Form.Item { ...formItemLayout } label="标注文件夹"><TreeSelect 
                dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
                value={ theResourceBatch.root }
                placeholder="请选择标注文件夹"
                onSelect={ this.onFolderSelect }
                >{ this.renderFolderTree(files, '') }</TreeSelect></Form.Item></Col>
            </Row> 
          </Form>
        </div>
      </div>
    </span>
  }
}

export const ConnectResourceBatchCreate = connect(state => {
  return {
    tasks: state[NameSpaces.TASK].list,
    files: state[NameSpaces.RESOURCE_BATCH].files
  }
})(ResourceBatchCreate)