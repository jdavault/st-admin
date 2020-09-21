const customMiddleware = (store) => (next) => async (action) => {
  if (action.dispatch) {
    if (typeof action.dispatch === 'function') {
      return store.dispatch(action.dispatch);
    }

    return store.dispatch(action.dispatch);
  }

  if (action.pre_type) { // typically triggers loading
    store.dispatch({type: action.pre_type});
  }

  if (action.async_service_call) {
    try {
      const payload = await action.async_service_call;

      if (action.success) {
        store.dispatch({type: action.success, payload});
      }

      return payload;
    } catch (error) {
      if (action.failed) {
        store.dispatch({type: action.failed, error});
      }

      return error;
    }
  }

  if (action.callback) {
    try {
      const payload = await action.callback();

      if (action.success) {
        store.dispatch({type: action.success, payload});
      }

      return payload;
    } catch (error) {
      if (action.failed) {
        store.dispatch({type: action.failed, error});
      }

      return error;
    }
  }

  if (action.pre_type) {
    store.dispatch({type: action.pre_type});
  }

  if (typeof action === 'object') {
    next(action);
  }
};

export default customMiddleware;
