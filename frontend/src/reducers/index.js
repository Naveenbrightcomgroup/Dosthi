import { useReducer } from "./userReducer";
const { combineReducers } = require("redux");
const rootReducer=combineReducers({
    user:useReducer,
});
export default rootReducer