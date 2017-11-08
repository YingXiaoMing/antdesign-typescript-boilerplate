import * as React from 'react';
import { connect } from 'dva';
import * as _ from "lodash";
import { NameSpaces } from '../../models/nameSpaces';
import { ConnectedComponent } from '../../typings/index';
import { IResourceBatch } from '../../typings/ResourceBatch';
import { PAGE_SIZE } from '../../utils/constants';
import { ResourceBatchActionTypes } from '../../models/mResourceBatch';
import { Row, Pagination, Button, Select } from 'antd';
import { ResourceBatchTable } from './ResourceBatchTable';
import { RoutePath } from '../../utils/routes';
import { IRouterContext, RouterDecorator } from '../../decorators/ContextRouterDecorator';
import { wrapChildrenProps } from '../../utils/reactUtils';
import { PaginationDecorator, PaginationDecoratorProps } from '../../decorators/PaginationDecorator';
import { setComponent } from '../../utils/refs';

interface ResourceBatchProps extends ConnectedComponent, PaginationDecoratorProps {
  resourceBatches: IResourceBatch[],
  resourceBatchesLoading: boolean,
  resourceBatchesTotal: number
}

@PaginationDecorator('fetchDataSource')
@RouterDecorator
export class ResourceBatchView extends React.Component<ResourceBatchProps, any> {

  componentWillReceiveProps(nextProps: ResourceBatchProps) {

  }

  componentWillMount() {
    this.fetchDataSource();
  }

  context: IRouterContext

  fetchDataSource = (payload?: any) => {
    const { dispatch, pageNumber } = this.props;
    dispatch({ 
      type: `${NameSpaces.RESOURCE_BATCH}/${ResourceBatchActionTypes.FETCH_REMOTE}`, 
      page_number: pageNumber, 
      page_size: PAGE_SIZE,
      ...payload
    });
  }
  
  addNewResourceBatch = () => {
    this.context.router.push(`${RoutePath.RESOURCE_BATCH}/${RoutePath.PARAMS.CREATE}`);
  }

  render() {
    const { resourceBatches, resourceBatchesLoading, resourceBatchesTotal, children, pageNumber, onPageChange } = this.props;
    return <span><div className="page-header no-border">
        标注批次<span className="button-list"><Button type="primary" onClick={ this.addNewResourceBatch }>添加批次</Button></span>
      </div>
      <div className="page-container">
        <ResourceBatchTable dataSource={ resourceBatches } loading={ resourceBatchesLoading } refresh={ this.fetchDataSource.bind(this) } />
        <Pagination className="mt15 df-pagination" size="small" total={ resourceBatchesTotal } pageSize={ PAGE_SIZE } current={ pageNumber } onChange={ onPageChange } />
        { wrapChildrenProps(children, { refresh: this.fetchDataSource.bind(this) }) }
      </div></span>;
  }
}

export const ConnectResourceBatchView = connect(state => {
  return {
    resourceBatches: state[NameSpaces.RESOURCE_BATCH].list,
    resourceBatchesLoading: state[NameSpaces.RESOURCE_BATCH].listLoading,
    resourceBatchesTotal: state[NameSpaces.RESOURCE_BATCH].total
  }
})(ResourceBatchView);