import { } from 'antd/es/icon';
import { } from 'antd/lib/icon';
import * as React from 'react';
import './Login.less';
import { Button, Form, Icon, Input, Menu, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ConnectedComponent } from '../../typings/index';
import * as _ from 'lodash';
import { NameSpaces } from '../../models/nameSpaces';
import { LoginActionTypes } from '../../models/mLogin';
import { SelectParam } from "antd/lib/menu";
import { connect } from 'dva';
import { RouterDecorator, IRouterContext } from '../../decorators/ContextRouterDecorator';
import { RoutePath } from '../../utils/routes';
import { error } from '../../utils/antdMessage';

interface LoginProps extends ConnectedComponent {
  form: WrappedFormUtils,
  logining: boolean
}

interface LoginState {
  logined: boolean
}

@RouterDecorator
export class LoginView extends React.Component<LoginProps, LoginState> {

  componentWillMount() {
    this.restoreLogin();
  }

  restoreLogin = () => {
    const { dispatch } = this.props;
    dispatch({ type: `${NameSpaces.LOGIN}/${LoginActionTypes.ENSURE}`, cb: () => {
      this.context.router.push(RoutePath.PAGE);
    } });
  }

  state = {
    logined: false
  }

  context: IRouterContext

  doLogin = (e: React.SyntheticEvent<any>) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((erros, values) => {
      if (erros) { return; }
      dispatch({ 
        type: `${NameSpaces.LOGIN}/${LoginActionTypes.LOGIN}`, 
        ...values, 
        cb: () => {
          setTimeout(() => { this.context.router.push(RoutePath.PAGE); });
        } 
      })
    })
    return false;
  }
  
  render() {
    const { form: { getFieldDecorator: d }, logining } = this.props;
    const { logined } = this.state;

    return <div className="login-page">
      <div className="login-win">
        <div className="login-logo"><h1>DEEP FINCH标注平台</h1></div>
        <div className="login-f-wrap">
          <Form onSubmit={ this.doLogin } className="login-form">
            <span className="l-f-title">LOGIN</span>
            <Form.Item>{ d('username', { 
                rules: [{ required: true, message: '请输入用户名' }] 
              })(<Input className="l-f-input" size="large" placeholder="请输入用户名" prefix={ <Icon type="user"></Icon> }></Input>) }</Form.Item>
            <Form.Item>{ d('password', { 
                rules: [{ required: true, message: '请输入密码' }] 
              })(<Input className="l-f-input" type="password" size="large" placeholder="请输入密码" prefix={ <Icon type="lock"></Icon> }></Input>) }</Form.Item>
            <Form.Item><Button type="primary" loading={logining} htmlType="submit" className="l-f-submit">登录</Button></Form.Item>
          </Form>
        </div>
      </div>
    </div>
  }
}

export const LoginPage = connect(state => {
  return {
    logining: state[NameSpaces.LOGIN].logining
  }
})(Form.create()(LoginView));