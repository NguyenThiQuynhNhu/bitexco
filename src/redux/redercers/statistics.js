

const INIT_STATE = {
    dataRequestLine: null,
    loadingRequestLine: false,
    errorRequestLine: null,

    dataRequestStackBar: null,
    loadingRequestStackBar: false,
    errorRequestStackBar: null,

    dataRequestBar: null,
    loadingRequestBar: false,
    errorRequestBar: null,

    dataRequestPie: null,
    loadingRequestPie: false,
    errorRequestPier: null,

    listEmployee: null,
    loadingEmployee: false,
    listDepartment: null,
    loadingDepartment: false,
    isError: false,
   
    listBlock: null,
    loadingBlock: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case 'SAVE_USER': {
            return INIT_STATE
        }
        //line
        case 'START_GETSTATISTICS_LINE':
            return {
                ...state,
                loadingRequestLine: true,
                errorRequestLine: null,
                dataRequestLine: null
            };
        case 'LOAD_STATISTICS_LINE':
            return {
                ...state,
                loadingRequestLine: false,
                dataRequestLine: action.payload.data,
                errorRequestLine: null
            };
        case 'FAIL_STATISTICS_LINE':
            return {
                ...state,
                loadingRequestLine: false,
                dataRequestLine: null,
                errorRequestLine: action.errorLineType
            };
        //Stackbar
        case 'START_GETSTATISTICS_STACK_BAR':
            return {
                ...state,
                loadingRequestStackBar: true,
                errorRequestStackBar: null,
                dataRequestStackBar: null
            };
        case 'LOAD_STATISTICS_STACK_BAR':
            return {
                ...state,
                loadingRequestStackBar: false,
                dataRequestStackBar: action.payload.data,
                errorRequestStackBar: null
            };
        case 'FAIL_STATISTICS_STACK_BAR':
            return {
                ...state,
                loadingRequestStackBar: false,
                dataRequestStackBar: null,
                errorRequestStackBar: action.errorBarType
            };
        //bar
        case 'START_GETSTATISTICS_BAR':
            return {
                ...state,
                loadingRequestBar: true,
                errorRequestBar: null,
                dataRequestBar: null
            };
        case 'LOAD_STATISTICS_BAR':
            return {
                ...state,
                loadingRequestBar: false,
                dataRequestBar: action.payload.data,
                errorRequestBar: null
            };
        case 'FAIL_STATISTICS_BAR':
            return {
                ...state,
                loadingRequestBar: false,
                dataRequestBar: null,
                errorRequestBar: action.errorBarType
            };

        // //Pie
        // case START_GETSTATISTICS_PIE_BAR:
        //     return {
        //         ...state,
        //         loadingRequestPie: true,
        //         errorRequestPier: null,
        //         dataRequestPie: null
        //     };
        // case LOAD_STATISTICS_PIE_BAR:
        //     return {
        //         ...state,
        //         loadingRequestPie: false,
        //         dataRequestPie: action.dataPie,
        //         errorRequestPier: null
        //     };
        // case FAIL_STATISTICS_PIE_BAR:
        //     return {
        //         ...state,
        //         loadingRequestPie: false,
        //         dataRequestPie: null,
        //         errorRequestPier: action.errorBarType
        //     };
        // //Employee 
      
        case 'RESET_DATASTATISTICS_LINE':
            return {
                ...state,
                state: INIT_STATE
            };
        case 'EMPLOYEE_LOADDATA_REQUEST': {
            return {
                ...state,
                loadingEmployee: true,
                isError: false,
                listEmployee: null
            };
        }
        case 'EMPLOYEE_LOADDATA_SUCCESS': {
            return {
                ...state,
                loadingEmployee: false,
                listEmployee: action.payload.data,
                isError: false
            };
        }
        case 'EMPLOYEE_LOADDATA_FAILURE': {
            return {
                ...state,
                loadingEmployee: false,
                listEmployee: null,
                isError: true
            };
        }
        case 'DEPARTMENT_LOADDATA_REQUEST': {
            return {
                ...state,
                loadingDepartment: true,
                isError: false,
                listDepartment: null
            };
        }
        case 'DEPARTMENT_LOADDATA_SUCCESS': {
            return {
                ...state,
                loadingDepartment: false,
                listDepartment: action.payload.data,
                isError: false
            };
        }
        case 'DEPARTMENT_LOADDATA_FAILURE': {
            return {
                ...state,
                loadingDepartment: false,
                listDepartment: null,
                isError: true
            };
        }

        case 'BLOCK_LOADDATA_REQUEST': {
            return {
                ...state,
                loadingBlock: true,
                isError: false,
                listBlock: null
            };
        }
        case 'BLOCK_LOADDATA_SUCCESS': {
            return {
                ...state,
                loadingBlock: false,
                listBlock: action.payload.data,
                isError: false
            };
        }
        case 'BLOCK_LOADDATA_FAILURE': {
            return {
                ...state,
                loadingBlock: false,
                listBlock: null,
                isError: true
            };
        }
        // case REMOVE_DATA_LOGOUT:
        //     return INIT_STATE;
        default: return state;
    }
};