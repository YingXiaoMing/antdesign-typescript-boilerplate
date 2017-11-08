import * as React from 'react';

interface ActiveTableRowState {
  activeRowKey: string
}

export interface ActiveTableRowDecoratorProps {
  resetActiveRow?: () => void,
  activeRow?: (rowKey: string) => void,
  renderRowClass?: (record: { id?: string | number }, index) => string
}

export const ActiveTableRowDecorator: (ComposedComponent: React.ComponentClass) => any = ComposedComponent => class extends React.Component<any, ActiveTableRowState> {

  constructor(props) {
    super(props);
  }

  state = {
    activeRowKey: ''
  }

  resetActiveRow = () => {
    this.setState({ activeRowKey: '' });
  }

  activeRow = (rowKey: string) => {
    this.setState({ activeRowKey: rowKey })
  }

  renderRowClass = (record: { _id?: string | number }, index) => {
    return String(record._id) === this.state.activeRowKey ? 'active' : '';
  }

  render() {
    const { activeRowKey } = this.state;
    const newProps = {
      activeRowKey,
      resetActiveRow: this.resetActiveRow,
      activeRow: this.activeRow,
      renderRowClass: this.renderRowClass
    }
    return <ComposedComponent { ...this.props } { ...newProps }  />
  }
}