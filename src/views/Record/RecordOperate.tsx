import { } from 'antd/lib/button';
import { ClassificationRecord } from './ClassificationRecord';
import { TaskType } from '../../utils/constants';
import { RecordActionTypes } from '../../models/mRecord';
import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'dva';
import { Link } from "dva/router";
import { Button, Breadcrumb, Row, Col, Form } from 'antd';
import { NameSpaces } from '../../models/nameSpaces';
import { IRecord } from '../../typings/Record';
import { ConnectedComponent } from '../../typings';
import { RoutePath } from '../../utils/routes';
import { TableDefaultProps } from '../../pureComponents/AntdProps';
import { RecordApi } from '../../services/sRecord';
import { success, error } from '../../utils/antdMessage';
import { setConnectComponent, setComponent } from '../../utils/refs';
const { Item: BreadItem } = Breadcrumb

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

interface RecordOperateProps extends ConnectedComponent {
  record: IRecord,
  recordHistory: string[],
  recordPos: number
}

interface RecordOperateState {
  loading: boolean
}

@RouterDecorator
class RecordOperateView extends React.Component<RecordOperateProps, RecordOperateState> {

  componentWillMount() {
    const { params } = this.props
    this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.FETCH_PROFILE}`, record_id: params.recordId })
    this.isSerial = !!params.resourceBatchId;
    if (this.isSerial) {
      this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.INIT_RECORD_HISTORY}`, record_id: params.recordId })
    }
  }

  isSerial: boolean = false

  state = {
    loading: false
  }

  context: IRouterContext

  recordComponent: ClassificationRecord

  asyncSave = (): Promise<{ record: IRecord | null }> => {
    const { record } = this.props
    return RecordApi.update({ 
      record_id: record._id,
      result: this.recordComponent.getResult() 
    })
  }

  next = async () => {
    const { params, recordHistory, recordPos } = this.props
    this.setState({ loading: true })
    const result = await this.asyncSave()
    if (result && result.record) {
      let newRecordPromise: Promise<{ record: IRecord | null }>
      if (recordPos < 0) {
        this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.PUT_RECORD_TO_HISOTRY}`, record_id: result.record._id })
        newRecordPromise = RecordApi.fetchNext({ resource_batch_id: params.resourceBatchId })
      } else if (recordHistory[recordPos + 1]) {
        this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.SET_RECORD_POS}`, recordPos: recordPos + 1 })
        newRecordPromise = RecordApi.fetchById({ record_id: recordHistory[recordPos + 1] })
      } else {
        this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.SET_RECORD_POS}`, recordPos: -1 })
        newRecordPromise = RecordApi.fetchNext({ resource_batch_id: params.resourceBatchId })
      }

      const nextResult = await newRecordPromise
      this.setState({ loading: false })
      if (nextResult && nextResult.record) {
        this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.PUT_PROFILE}`, theRecord: nextResult.record })
        this.context.router.push(`${RoutePath.RECORD}/${nextResult.record._id}/${params.resourceBatchId}`)
      }
    } else {
      this.setState({ loading: false })
    }
  }

  prev = async () => {
    const { dispatch, recordPos, recordHistory } = this.props
    this.setState({ loading: true })
    const newRecordPos = recordPos < 0 ? (recordHistory.length - 1) : (recordPos - 1)
    const result = await <Promise<{ record: IRecord }>>RecordApi.fetchById({ record_id: recordHistory[newRecordPos] })
    this.setState({ loading: false })
    if (result && result.record) {
      this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.PUT_PROFILE}`, theRecord: result.record })
      this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.SET_RECORD_POS}`, recordPos: newRecordPos })
      this.context.router.push(`${RoutePath.RECORD}/${result.record._id}/${result.record.resourceBatch._id}`)
    }
  }

  back = () => {
    this.context.router.push(RoutePath.RECORD)
  }

  remove = () => {
    const { dispatch } = this.props
    dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.REMOVE_RECORD_HISTORY}` })
  }

  save = async () => {
    this.setState({ loading: true })
    const result = await this.asyncSave()
    if (result && result.record) {
      success('标注成功')
      this.setState({ loading: false }, () => {
        this.props.dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.PUT_PROFILE}`, theRecord: result.record })
      })
    }
  }

  render() {
    const { record, dispatch, recordHistory, recordPos } = this.props
    return <span>
      <div className="page-header">
        <Breadcrumb>
          <BreadItem><Link to={{ pathname: RoutePath.RECORD }}>标注管理</Link></BreadItem>
          <BreadItem>{ record.fileName }</BreadItem>
        </Breadcrumb>
        <span className="button-list">
          { this.isSerial ? <Button type="primary" className="df-btn-red" onClick={ this.remove }>删除标记记录</Button> : null }
          <Button type="primary" className="df-btn-grey" onClick={ this.back }>返回</Button>
        </span>
      </div>
      <div className="page-container">
        <div className="record-contaienr mt15">
          <div className="image"><img src={ record.fileUrl } alt=""/></div>
          <div className="content">
            <div className="button-list">
              { this.isSerial ? <Button type="primary" onClick={ this.prev } style={{ marginRight: '15px' }} loading={ this.state.loading } disabled={ !recordHistory[recordPos >= 0 ? (recordPos - 1) : 0] }>上一个</Button> : null }
              { this.isSerial ? <span style={{ fontSize: '14px', marginRight: '15px' }}>{ recordPos >= 0 ? (recordPos + 1) : 'NEW' }&nbsp;/&nbsp;{ recordHistory.length }</span> : null }
              { this.isSerial ? <Button type="primary" onClick={ this.next } loading={ this.state.loading }>下一个</Button> :  <Button type="primary" onClick={ this.save } loading={ this.state.loading }>保存</Button> }
            </div>
            <div className="main-content" style={{ marginTop: '10px' }}>{ record.task && record.task.type === TaskType.CLASSIFICATION ? 
              <ClassificationRecord ref={ C => { this.recordComponent = setComponent(C) } } record={ record } dispatch={ dispatch } /> : null }
            </div>
          </div>
        </div>
      </div>
    </span>
  }
}

export const ConnectRecordOperateView = connect(state => {
  return {
    record: state[NameSpaces.RECORD].theRecord,
    recordHistory: state[NameSpaces.RECORD].recordHistory,
    recordPos: state[NameSpaces.RECORD].recordPos
  }
})(RecordOperateView)