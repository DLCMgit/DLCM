export default function InputReducer(state, action) {
  if (action.type === "input") {
    return {
      ...state,
      [action.name]: action.value,
    }
  } else if (action.type === "object-input") {
    //Make sure to send objectVariables prop to populate object with current key/value pairs.
    return {
      ...state,
      [action.object]: {
        ...action.objectVariables,
        [action.name]: action.value,
      },
    }
  } else if (action.type === "submit") {
    return {
      ...state,
      submitting: true,
      success: false,
      error: null,
    }
  } else if (action.type === "error") {
    return {
      ...state,
      submitting: false,
      success: false,
      error: action.error,
    }
  } else if (action.type === "success") {
    return {
      ...state,
      submitting: false,
      success: true,
    }
  } else if (action.type === "reset") {
    return action.state
  }
}
