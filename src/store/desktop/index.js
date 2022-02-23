export default {
    namespaced: true,
    states: {
        username: null,
        navigationExpanded: true
    },
    actions: {},
    mutations: {
        signOut(state) {
            state.username = null
        },
        signIn(state, username) {
            state.username = username
        },
        toggleNavigationExpansion(state) {
            state.navigationExpanded = !state.navigationExpanded
        }
    }
}