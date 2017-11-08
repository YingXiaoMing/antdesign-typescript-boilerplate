import { UserRole, UserRoleMap } from '../../utils/constants';
import RadioButton from 'antd/lib/radio/radioButton';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Form, Input, Row, Col, Radio } from 'antd';
import * as React from 'react';
import * as _ from 'lodash';
import { IUser } from '../../typings/User';
import { setConnectComponent } from '../../utils/refs';
import { obj2Field } from '../../utils/index';
const classNames = require('classnames');

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 } 
}

export class UserEditorForm extends React.Component<{ form: WrappedFormUtils, user: IUser }, any> {

  render() {
    const { form, user } = this.props;
    const { getFieldDecorator: d } = form;
    
    return <Form className="df-form df-required-tail-form">
      <Row>
        <Col><FormItem {...formLayout} label="用户名">{ d('username')(<Input placeholder="请输入用户名" />) }</FormItem></Col>
        <Col><FormItem {...formLayout} label="姓名">{ d('name')(<Input placeholder="请输入姓名" />) }</FormItem></Col>
        { user._id ? null : <Col><FormItem {...formLayout} label="密码">
          { d('password')(<Input placeholder="请输入密码" type="password" />) }
        </FormItem></Col> }
        <Col><FormItem {...formLayout } label="角色">{ d('type', {
          initialValue: UserRole.ANNOTATOR
        })(<RadioGroup>
          <Radio value={UserRole.ADMIN}>{ UserRoleMap[UserRole.ADMIN] }</Radio>
          <Radio value={UserRole.ANNOTATOR}>{ UserRoleMap[UserRole.ANNOTATOR] }</Radio>
        </RadioGroup>) }</FormItem></Col>
      </Row> 
    </Form>;
  }
}

export const WrappedUserEditorForm: React.ComponentClass<any> = Form.create({
  mapPropsToFields(props) {
    const { user } = props as any;
    if (user && user._id) {
      return obj2Field(user);
    } else {
      return {};
    }
  }
})(UserEditorForm)
