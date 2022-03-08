export default {
    namespaced: true,
    states: {
        asideCollapsed:false
    },
    actions: {},
    mutations: {
        toggleAside(state) {
            state.asideCollapsed = !state.asideCollapsed
        }
    }
}