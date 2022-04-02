import {useAppContext} from "./AppContextProvider";

export function computeModuleRouteName(name: string) {
    const {meta: layoutMeta} = useAppContext().currentLayout
    return layoutMeta.value?.name + '/' + name
}

export function computeModuleRoutePath(path: string) {
    const {meta: layoutMeta} = useAppContext().currentLayout
    return layoutMeta.value?.path + '/' + path
}