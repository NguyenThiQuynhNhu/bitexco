export const resetStateByKey = (params) => async (dispatch) => {
    dispatch({ type: 'APP_RESET_BY_KEY', payload: params });
};
// export const resetStateByKey = ({ key, path, value }) => ({
//     type: 'APP_RESET_BY_KEY',
//     payload: { key, path, value }
// });