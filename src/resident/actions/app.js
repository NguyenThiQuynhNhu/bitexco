export const resetStateByKey = ({ key, path, value, language }) => ({
    type: 'APP_RESET_BY_KEY',
    payload: { key, path, value, language }
});

export const onSubmitEditing = (payload) => ({
    type: 'APP_ON_SUBMIT_EDITTING',
    payload
});