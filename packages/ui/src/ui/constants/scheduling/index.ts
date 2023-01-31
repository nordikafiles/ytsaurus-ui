export const SCHEDULING_DATA_REQUEST = 'SCHEDULING_DATA_REQUEST';
export const SCHEDULING_DATA_SUCCESS = 'SCHEDULING_DATA_SUCCESS';
export const SCHEDULING_DATA_FAILURE = 'SCHEDULING_DATA_FAILURE';
export const SCHEDULING_DATA_CANCELLED = 'SCHEDULING_DATA_CANCELLED';
export const SCHEDULING_DATA_PARTITION = 'SCHEDULING_DATA_PARTITION';

export const SCHEDULING_OPERATIONS_REQUEST = 'SCHEDULING_OPERATIONS_REQUEST';
export const SCHEDULING_OPERATIONS_SUCCESS = 'SCHEDULING_OPERATIONS_SUCCESS';
export const SCHEDULING_OPERATIONS_FAILURE = 'SCHEDULING_OPERATIONS_FAILURE';
export const SCHEDULING_OPERATIONS_CANCELLED = 'SCHEDULING_OPERATIONS_CANCELLED';
export const SCHEDULING_OPERATIONS_PARTITION = 'SCHEDULING_OPERATIONS_PARTITION';

export const SCHEDULING_CREATE_POOL_CANCELLED = 'SCHEDULING_CREATE_POOL_CANCELLED';

export const SCHEDULING_DELETE_POOL_REQUEST = 'SCHEDULING_CREATE_DELETE_REQUEST';
export const SCHEDULING_DELETE_POOL_SUCCESS = 'SCHEDULING_CREATE_DELETE_SUCCESS';
export const SCHEDULING_DELETE_POOL_FAILURE = 'SCHEDULING_CREATE_DELETE_FAILURE';

export const SCHEDULING_EDIT_POOL_REQUEST = 'SCHEDULING_CREATE_EDIT_REQUEST';
export const SCHEDULING_EDIT_POOL_SUCCESS = 'SCHEDULING_CREATE_EDIT_SUCCESS';
export const SCHEDULING_EDIT_POOL_FAILURE = 'SCHEDULING_CREATE_EDIT_FAILURE';
export const SCHEDULING_EDIT_POOL_CANCELLED = 'SCHEDULING_CREATE_EDIT_CANCELLED';

export const CHANGE_TABLE_TREE_STATE = 'SCHEDULING_CHANGE_TABLE_TREE_STATE';
export const CHANGE_TREE = 'SCHEDULING_CHANGE_TREE';
export const CHANGE_FILTER = 'SCHEDULING_CHANGE_FILTER';
export const CHANGE_POOL = 'SCHEDULING_CHANGE_POOL';
export const CHANGE_CONTENT_MODE = 'SCHEDULING_CHANGE_CONTENT_MODE';
export const CHANGE_POOL_CHILDREN_FILTER = 'SCHEDULING_CHANGE_POOL_CHILDREN_FILTER';
export const TOGGLE_EDIT_VISIBILITY = 'SCHEDULING_TOGGLE_EDIT_VISIBILITY';
export const TOGGLE_DELETE_VISIBILITY = 'SCHEDULING_TOGGLE_DELETE_VISIBILITY';

export const SCHEDULING_POOL_TREE_TABLE_ID = 'scheduling/pool-tree';
export const SCHEDULING_POOL_CHILDREN_TABLE_ID = 'scheduling/pool-children';
export const ROOT_POOL_NAME = '<Root>';
export const Tab = {
    OVERVIEW: 'overview',
    DETAILS: 'details',
    ACL: 'acl',
};
export const DEFAULT_TAB = Tab.OVERVIEW;

export const CREATE_POOL_DIALOG_TREE_ITEMS_REQUEST = 'CREATE_POOL_DIALOG_TREE_ITEMS_REQUEST';
export const CREATE_POOL_DIALOG_TREE_ITEMS_CANCELLED = 'CREATE_POOL_DIALOG_TREE_ITEMS_CANCELLED';
export const CREATE_POOL_DIALOG_TREE_ITEMS_FAILED = 'CREATE_POOL_DIALOG_TREE_ITEMS_FAILED';
export const CREATE_POOL_DIALOG_TREE_ITEMS_SUCCESS = 'CREATE_POOL_DIALOG_TREE_ITEMS_SUCCESS';
export const CREATE_POOL_DIALOG_TREE_ITEMS_PARTIAL = 'CREATE_POOL_DIALOG_TREE_ITEMS_PARTIAL';
export const CREATE_POOL_DIALOG_TREE_CREATE_FAILURE = 'CREATE_POOL_DIALOG_TREE_CREATE_FAILURE';

export const SCHEDULING_MONITOR_CHART_STATUS = 'SCHEDULING_MONITOR_CHART_STATUS';

export const SCHEDULING_ALLOWED_ROOT_TABS = {
    [Tab.OVERVIEW]: true,
    [Tab.DETAILS]: true,
};
