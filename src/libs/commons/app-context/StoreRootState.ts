import {MutationTree} from "vuex";

export interface StoreRootState {
    username: string,
    userLastRoutePath: string
}

export function StoreRootStateDefaultValue(): StoreRootState {
    return {
        username: '',
        userLastRoutePath: '/'
    }
}

export const StoreRootMutations: MutationTree<StoreRootState> = {
    updateUsername(state, username) {
        state.username = username
    },
    updateUserLastRoutePath(state, value) {
        state.userLastRoutePath = value
    }
}