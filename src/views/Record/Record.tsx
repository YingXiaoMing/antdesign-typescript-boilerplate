import { RecordApi } from '../../services/sRecord';
import { ResourceBatchActionTypes } from '../../models/mResourceBatch';
import { LabeledValue } from 'antd/es/select';
import { } from 'antd/lib/select';
import * as React from 'react';
import { connect } from 'dva';
import * as _ from 'lodash';
import { NameSpaces } from '../../models/nameSpaces';
import { ConnectedComponent } from '../../typings/index';
import { IRecord } from '../../typings/Record';
import { PAGE_SIZE } from '../../utils/constants';
import { RecordActionTypes } from '../../models/mRecord';
import { Row, Pagination, Button, Select } from 'antd';
import { RecordTable } from './RecordTable';
import { RoutePath } from '../../utils/routes';
import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import { wrapChildrenProps } from '../../utils/reactUtils';
import { PaginationDecorator, PaginationDecoratorProps } from '../../decorators/PaginationDecorator';
import { setComponent } from '../../utils/refs';
import './Record.less';
import { IResourceBatch } from '../../typings/ResourceBatch';

interface RecordProps extends ConnectedComponent, PaginationDecoratorProps {
  records: IRecord[],
  recordsLoading: boolean,
  recordsTotal: number,
  resourceBatches: IResourceBatch[]
}

interface RecordState {
  starting: boolean,
  selectedResourceBatch: LabeledValue
}

@PaginationDecorator('fetchDataSource')
@RouterDecorator
export class RecordView extends React.Component<RecordProps, RecordState> {

  componentWillMount() {
    this.props.dispatch({ type: `${NameSpaces.RESOURCE_BATCH}/${ResourceBatchActionTypes.FETCH_REMOTE}`, page_number: 1, page_size: 1000, callback: (resourceBatches) => {
      if (resourceBatches && resourceBatches.length) {
        const rb = resourceBatches[0] as IResourceBatch
        this.setState({ selectedResourceBatch: { key: rb._id, label: rb.name } }, () => {
          this.fetchDataSource({ resource_batch_id: rb._id });
        })
      }
    } })
  }

  context: IRouterContext

  state = {
    starting: false,
    selectedResourceBatch: {} as LabeledValue
  }

  fetchDataSource = (payload?: any) => {
    const { dispatch, pageNumber } = this.props;
    dispatch({ 
      type: `${NameSpaces.RECORD}/${RecordActionTypes.FETCH_REMOTE}`, 
      page_number: pageNumber, 
      page_size: PAGE_SIZE,
      resource_batch_id: this.state.selectedResourceBatch.key,
      ...payload
    });
  }
  
  startAnnotate = async () => {
    const { selectedResourceBatch: rb } = this.state
    this.setState({ starting: true })
    const result = await RecordApi.fetchNext({ resource_batch_id: rb.key })
    this.setState({ starting: false })
    if (result && result.record) {
      this.context.router.push(`${RoutePath.RECORD}/${(result.record as IRecord)._id}/${rb.key}`)
    }
  }

  renderResourceBatchSelect = () => {
    const { resourceBatches } = this.props
    return <span style={{ fontSize: '12px' }}>标注批次：<Select labelInValue value={ this.state.selectedResourceBatch }>
      { _.map(resourceBatches, rb => <Select.Option value={ rb._id }>{ rb.name }</Select.Option>) }
    </Select></span>
  }

  render() {
    const { records, recordsLoading, recordsTotal, children, pageNumber, onPageChange } = this.props;
    return <span><div className="page-header no-border">
        标注管理<span className="button-list"><Button type="primary" onClick={ this.startAnnotate } loading={ this.state.starting }>开始标注</Button></span>
      </div>
      <div className="page-container">
        <Row className="query-bar">
          { this.renderResourceBatchSelect() }
        </Row>
        <RecordTable dataSource={ records } loading={ recordsLoading } refresh={ this.fetchDataSource.bind(this) } />
        <Pagination className="mt15 df-pagination" size="small" total={ recordsTotal } pageSize={ PAGE_SIZE } current={ pageNumber } onChange={ onPageChange } />
        { wrapChildrenProps(children, { refresh: this.fetchDataSource.bind(this) }) }
      </div></span>;
  }
}

export const ConnectRecordView = connect(state => {
  return {
    records: state[NameSpaces.RECORD].list,
    recordsLoading: state[NameSpaces.RECORD].listLoading,
    recordsTotal: state[NameSpaces.RECORD].total,
    resourceBatches: state[NameSpaces.RESOURCE_BATCH].list
  }
})(RecordView);