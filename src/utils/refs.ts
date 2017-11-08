export const setComponent = (component: any): any => {
  if (component) {
    return component.wrappedComponentInstance || component;
  }
}

export const setConnectComponent = (component: any): any => {
  if (component && component.refs.wrappedInstance) {
    return component.refs.wrappedInstance.wrappedComponentInstance || component.refs.wrappedInstance;
  }
}