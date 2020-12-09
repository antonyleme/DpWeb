export function loginAction(token) {
    return {
        type: '@auth/LOGIN',
        payload: { token }
    }
}

export function logoutAction() {
    return {
        type: '@auth/LOGOUT'
    }
}