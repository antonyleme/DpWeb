const INITIAL_STATE = {
	token: null,
};

export default function auth(state = INITIAL_STATE, action) {
    switch (action.type) {
        case '@auth/LOGIN': {
            return {
                ...state,
                token: action.payload.token
            }
        }
        case '@auth/LOGOUT': {
            return {
                ...state,
                token: null
            }
        }
        default:
            return state;
    }
}