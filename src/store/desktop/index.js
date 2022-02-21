export default {
    namespaced: true,
    states: {
        navigationExpanded: true
    },
    actions: {},
    mutations: {
        toggleNavigationExpansion(state) {
            state.navigationExpanded = !state.navigationExpanded
        }
    }
}