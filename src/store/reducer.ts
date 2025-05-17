const initialState = {
  axisActive: true,
  gridActive: true,
}

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case 'axis/activate':
      return {
        ...state,
        axisActive: true,
      }
    case 'axis/deactivate':
      return {
        ...state,
        axisActive: false,
      }
    case 'grid/activate':
      return {
        ...state,
        gridActive: true,
      }
    case 'grid/deactivate':
      return {
        ...state,
        gridActive: false,
      }
    default:
      return state;
  }
};

export default reducer;