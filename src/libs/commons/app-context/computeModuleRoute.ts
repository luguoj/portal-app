import {useAppContext} from "./AppContextProvider";

export function computeModuleRouteName(name: string) {
    const route = useAppContext().currentRoute
    return route.value.layout?.name + '/' + name
}