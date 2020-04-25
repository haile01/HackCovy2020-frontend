const userReducer = (state = {}, action: any) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    default:
      return state;
  }
}

export default userReducer;