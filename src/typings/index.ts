import { Dispatch } from "redux";
import * as H from "history"

export interface ConnectedComponent {
  dispatch: Dispatch<any>,
  history: History,
  location: H.Location,
  params?: any,
  routes: any[]
}