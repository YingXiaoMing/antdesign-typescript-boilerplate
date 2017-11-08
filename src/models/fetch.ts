export const FetchActionTypes = {
  FETCH: 'fetch',
  CLEAR: 'clear',
  FETCH_REMOTE: 'fetchRemote',
  TOGGLE_LOADING: 'toggleLoading'
}

export const fetchDecorator = fetchProperty => {
  return {
    state: {
      list: [],
      listLoading: false,
      total: 0,
      page_count: 1
    },

    reducers: {
      [FetchActionTypes.FETCH](state, action) {
        const { list, listLoading, total, page_count } = action;
        return { ...state, list, listLoading, total, page_count };
      },

      [FetchActionTypes.TOGGLE_LOADING](state, action) {
        const { listLoading } = action;
        return { ...state, listLoading };
      },

      [FetchActionTypes.CLEAR](state, action) {
        return { ...state, list: [], total: 0, page_count: 1 };
      }
    },

    effects: {
      *[FetchActionTypes.FETCH_REMOTE](action, { call, put }) {
        yield put({ type: FetchActionTypes.TOGGLE_LOADING, listLoading: true });
        const result = yield call(fetchProperty.method, fetchProperty.action.call(null, action));
        if (result) {
          const { total, page_count } = result;
          yield put({ type: FetchActionTypes.FETCH, list: result[fetchProperty.property], listLoading: false, total, page_count })
        } else {
          yield put({ type: FetchActionTypes.TOGGLE_LOADING, listLoading: false });
        }
      }
    }
  }
}