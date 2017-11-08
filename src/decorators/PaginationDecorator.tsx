import * as React from 'react';
import { setComponent } from '../utils/refs';

interface PaginationProps {
  refreshMethod: string
}

interface PaginationState {
  pageNumber: number
}

export interface PaginationDecoratorProps {
  pageNumber: number,
  resetPageNumber: () => void,
  setPageNumber: (pageNumber: number) => void,
  onPageChange: (page: number) => void
}

export function PaginationDecorator(refreshMethod: string) {
  return (ComposedComponent: React.ComponentClass) => (class extends React.Component<PaginationProps, PaginationState> {

    constructor(props) {
      super(props);
    }

    wrappedComponentInstance: React.Component<any, any> = null

    state = {
      pageNumber: 1
    }

    resetPageNumber = () => {
      this.setState({ pageNumber: 1 });
    }

    setPageNumber = pageNumber => {
      this.setState({ pageNumber })
    }

    onPageChange = (page: number) => {
      this.setState({ pageNumber: page });
      this.wrappedComponentInstance[refreshMethod].call(this.wrappedComponentInstance, { page_number: page });
    }

    render() {
      const { pageNumber } = this.state;
      const newProps = {
        pageNumber,
        resetPageNumber: this.resetPageNumber,
        setPageNumber: this.setPageNumber,
        onPageChange: this.onPageChange,
        ref: wrappedComponentInstance => { this.wrappedComponentInstance = setComponent(wrappedComponentInstance) }
      }
      return <ComposedComponent { ...this.props } { ...newProps }  />
    }
  }) as any
}