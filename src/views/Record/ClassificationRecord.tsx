import { RecordActionTypes } from '../../models/mRecord';
import { NameSpaces } from '../../models/nameSpaces';
import { TaskClassificationType } from '../../utils/constants';
import * as React from 'react';
import * as _ from 'lodash';
import { Tabs, Radio, Checkbox } from 'antd'
import { IRecord } from '../../typings/Record';
import { IClassificationTask } from '../../typings/Task';
import { Dispatch } from 'redux';
const { TabPane } = Tabs
const { Group: RadioGroup } = Radio
const { Group: CheckboxGroup } = Checkbox

interface ClassificationRecordProps {
  record: IRecord,
  dispatch: Dispatch<any>
}

export class ClassificationRecord extends React.Component<ClassificationRecordProps, any> {

  dispatchResultChange = (newVal: any) => {
    const { record, dispatch } = this.props
    dispatch({ type: `${NameSpaces.RECORD}/${RecordActionTypes.PUT_PROFILE}`, theRecord: {
      ...record,
      result: {
        ...record.result,
        ...newVal
      }
    } })
  }

  onCheckboxGroupChange = (cft: IClassificationTask) => {
    return (changedValues) => this.dispatchResultChange({ [cft._id]: changedValues })
  }

  renderCheckboxGroup(cft: IClassificationTask) {
    const { result = {} } = this.props.record
    return <CheckboxGroup 
      onChange={ this.onCheckboxGroupChange(cft) }
      value={ result[cft._id] } 
      options={ _.map(cft.options, (opt, index) => {
        return { label: `${index + 1}、${opt}`, value: opt }
      }) }></CheckboxGroup>
  }

  onRadioGroupChecked = (cft: IClassificationTask) => {
    return (e: React.SyntheticEvent<any>) => this.dispatchResultChange({ [cft._id]: (e.target as HTMLInputElement).value })
  }

  renderRadioGroup(cft: IClassificationTask) {
    const { result = {} } = this.props.record
    return <RadioGroup
      onChange={ this.onRadioGroupChecked(cft) }
      value={ result[cft._id] }>
        { _.map(cft.options, (opt, index) => <Radio value={ opt }>{ `${index + 1}、${opt}` }</Radio>) }
      </RadioGroup>
  }

  getResult = () => {
    return this.props.record.result
  }

  render() {
    const { record } = this.props
    return <Tabs type="card">
      { _.map(record.task.content as IClassificationTask[], (cft, index) => <TabPane tab={ `${index + 1}、${cft.title}` } key={ cft._id }>
        { cft.type === TaskClassificationType.SINGLE ? this.renderRadioGroup(cft) : this.renderCheckboxGroup(cft) }
      </TabPane>) }
    </Tabs>
  }
}