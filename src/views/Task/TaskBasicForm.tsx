import { TaskActionTypes } from '../../models/mTask';
import { NameSpaces } from '../../models/nameSpaces';
import { TaskType, TaskTypeMap } from '../../utils/constants';
import RadioButton from 'antd/lib/radio/radioButton';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Form, Input, Row, Col, Radio } from 'antd';
import * as React from 'react';
import * as _ from 'lodash';
import { ITask } from '../../typings/Task';
import { setConnectComponent } from '../../utils/refs';
import { obj2Field } from '../../utils/index';
const classNames = require('classnames');

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export class TaskBasicForm extends React.Component<{ form: WrappedFormUtils, task: ITask }, any> {

  render() {
    const { form, task } = this.props;
    const { getFieldDecorator: d } = form;
    
    return <div className="detail-card">
      <div className="card-header">基本信息</div>
      <Form className="df-form task-form">
        <Row>
          <Col><FormItem { ...formItemLayout } label="任务名称">{ d('name')(<Input placeholder="请输入任务名称" />) }</FormItem></Col>
          <Col><FormItem { ...formItemLayout } label="任务类型">{ d('type', {
            initialValue: TaskType.CLASSIFICATION
          })(<RadioGroup>
            <Radio value={TaskType.CLASSIFICATION}>{ TaskTypeMap[TaskType.CLASSIFICATION] }</Radio>
          </RadioGroup>) }</FormItem></Col>
        </Row> 
      </Form>
    </div>
  }
}

export const WrappedTaskBasicForm: React.ComponentClass<any> = Form.create({
  mapPropsToFields(props) {
    const { task } = props as any;
    if (task && task._id) {
      return obj2Field(task);
    } else {
      return {};
    }
  },
  onFieldsChange(props: any, changedField) {
    const { name, value } = changedField[Object.keys(changedField)[0]]
    if (name) {
      props.dispatch({ type: `${NameSpaces.TASK}/${TaskActionTypes.UPDATE_PROFILE}`, field: name, value })
    }
  }
})(TaskBasicForm)
