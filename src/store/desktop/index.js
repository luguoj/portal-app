export default {
    namespaced: true,
    states: {
        username: '',
        asideCollapsed:false
    },
    actions: {},
    mutations: {
        signOut(state) {
            state.username = null
        },
        signIn(state, username) {
            state.username = username
        },
        toggleAside(state) {
            state.asideCollapsed = !state.asideCollapsed
        }
    }
}