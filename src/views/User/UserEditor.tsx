import * as React from 'react';
import * as _ from "lodash";
import { connect } from 'dva';
import { Modal, Row, Col } from 'antd';
import { ModalDefaulProps } from '../../pureComponents/AntdProps';
import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import { RoutePath } from '../../utils/routes';
import { ConnectedComponent } from '../../typings';
import { IUser } from '../../typings/User';
import { NameSpaces } from '../../models/nameSpaces';
import { UserActionTypes } from '../../models/mUser';
import { setComponent } from '../../utils/refs';
import { UserApi } from '../../services/sUser';
import { success } from '../../utils/antdMessage';
import { WrappedUserEditorForm, UserEditorForm } from './UserEditorForm';

interface UserEditorProps extends ConnectedComponent {
  user: IUser,
  refresh: () => void
}

@RouterDecorator
export class UserEditorView extends React.Component<UserEditorProps, { confirming: boolean }> {

  componentWillMount() {
    const { dispatch, params } = this.props;
    this.isCreate = params.userId === RoutePath.PARAMS.CREATE;
    dispatch({ type: `${NameSpaces.USER}/${UserActionTypes.FETCH_PROFILE}`, user_id: this.isCreate ? null : params.userId });
  }

  state = {
    confirming: false
  }
  
  context: IRouterContext

  isCreate: boolean  = true;

  userForm: UserEditorForm = null

  save = () => {
    const { user, refresh } = this.props;
    const { form } = this.userForm.props;
    form.validateFields(async (erros, values) => {
      if (erros) { return }
      this.setState({ confirming: true });
      const result = await UserApi[this.isCreate ? 'create' : 'update']({ ...values, _id:  user._id })
      this.setState({ confirming: false });
      if (result && result.user) {
        refresh && refresh();
        this.close();
      }
    })
  }

  close = () => {
    this.context.router.push(RoutePath.USER);
    setTimeout(() => { this.props.dispatch({ type: `${NameSpaces.USER}/${UserActionTypes.CLEAR_PROFILE}` }); })
  }

  render() {
    const { user } = this.props;
    const ModalDefaulPropsValue = ModalDefaulProps(this);
    return <Modal title = { `${this.isCreate ? "新建" : "编辑"}用户` }
      { ...ModalDefaulPropsValue }
      width={ 400 }
      confirmLoading={ this.state.confirming }>
       <WrappedUserEditorForm wrappedComponentRef={ component => { this.userForm = setComponent(component) } } user={ user } />
    </Modal>
  }
}

export const ConnectUserEditor = connect(state => {
  return {
    user: state[NameSpaces.USER].theUser
  }
})(UserEditorView);