function getChildren<T extends Record<string | number | symbol, any>>(
    node: T,
    childrenProperty: keyof T
): T[] | null {
    if (node[childrenProperty] && Array.isArray(node[childrenProperty]) && node[childrenProperty].length > 0) {
        return node[childrenProperty]
    }
    return null
}

export function filterFromBottom<T extends Record<string | number | symbol, any>>(
    nodes: T[],
    filterFn: (node: T) => boolean,
    childrenProperty: keyof T = "children"
): T[] {
    const result: T[] = []
    for (let i = 0; i < nodes.length; i++) {
        const node = {...nodes[i]};
        const flag = filterFn(node)
        let filteredChildren: T[] = []
        const children = getChildren(node, childrenProperty)
        if (children) {
            filteredChildren = filterFromBottom(children, filterFn, childrenProperty)
            node[childrenProperty] = filteredChildren as T[keyof T]
        }
        if (flag || filteredChildren.length > 0) {
            result.push(node)
        }
    }
    return result
}

export function filterFromRoot<T extends Record<string | number | symbol, any>>(
    nodes: T[],
    filterFn: (node: T) => boolean,
    childrenProperty: keyof T = "children"
): T[] {
    const result: T[] = []
    for (let i = 0; i < nodes.length; i++) {
        const node = {...nodes[i]};
        if (filterFn(node)) {
            result.push(node)
            const children = node[childrenProperty]
            if (children) {
                const filteredChildren = filterFromBottom(children, filterFn, childrenProperty) as unknown
                node[childrenProperty] = filteredChildren as T[keyof T]
            }
        }
    }
    return result
}