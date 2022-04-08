import {useAppContext} from "./AppContextProvider";

export function computeModuleRouteName(name: string) {
    const route = useAppContext().currentRoute
    return route.value.layout?.name + '/' + name
}

// export function computeModuleRoutePath(path: string) {
//     const layoutMeta = useAppContext().currentLayoutMeta
//     return layoutMeta.value?.path + '/' + path
// }