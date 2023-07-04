import Cookies from "js-cookie"
export function useReducer(
    state = Cookies.get("users") ? JSON.parse(Cookies.get("users")) : null,
    action) {
    switch (action.type) {
        case "LOGIN":
            return action.payload
        default:
            return state;
    }
}