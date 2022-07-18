// Helps to standardize and keep actions unique across your application
const helper = (moduleName) => {
    // We will define our action type here
    const defineAction = actionName => `${moduleName}/${actionName}`

    // Then create action for the type
    const createAction = (type, isRequest = false) =>
        function actionCreator(payload) {
            return isRequest
                ? { type: `${type}:PENDING`, payload: { ...payload } }
                : { type, payload: { ...payload } }
        }

    // Consume all actions and initial state (if have) to make our reducer
    const createReducer = (cases, defaultState = {}) => (state, action = {}) => {
        if (state === undefined) {
            return defaultState
        }
        if (cases[action.type]) {
            return cases[action.type](state, action)
        }
        return state
    }

    return {
        defineAction,
        createAction,
        createReducer
    }
}

export default helper
