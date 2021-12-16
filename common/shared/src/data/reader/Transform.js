Ext.define('PSR.data.reader.Transform', {
    singleton: true,
    getPathTreeOption: function (opt) {
        return Object.assign({
            expand: null,
            displayProperty: 'text',
            pathProperty: 'path',
            pathSplitter: '/',
            rootProperty: 'content',
            isRecord: false
        }, opt);
    },
    catalogTree: function (records, opt) {
        opt = PSR.data.reader.Transform.getPathTreeOption(opt);
        const displayProperty = opt.displayProperty,
            pathProperty = opt.pathProperty,
            pathSplitter = opt.pathSplitter,
            rootProperty = opt.rootProperty,
            rootNode = {},
            rootNodes = rootNode[rootProperty] = [],
            nodeMap = {root: rootNode};
        for (let index = 0; records && index < records.length; index++) {
            // 节点赋值, 获取路径值
            const record = Object.assign({isRecord: opt.isRecord}, records[index]),
                usage = record.usage ? record.usage : 'null-usage',
                pathValue = record[pathProperty],
                paths = pathValue ? pathValue.split(pathSplitter) : null;
            let usageNode = nodeMap[usage];
            if (!usageNode) {
                usageNode = {id: usage};
                usageNode[displayProperty] = usage;
                usageNode[rootProperty] = [];
                nodeMap[usage] = usageNode;
                rootNodes.push(usageNode);
            }
            // 如果不存在路径值，为无效节点，放在根节点
            if (!pathValue || pathValue == '') {
                usageNode[rootProperty].push(record);
                continue;
            }
            let path = usage,
                pathNode = usageNode;
            for (let deep = 0; deep < paths.length; deep++) {
                path = path + '/' + paths[deep];
                let childPathNode = nodeMap[path];
                if (!childPathNode) {
                    childPathNode = {};
                    childPathNode[displayProperty] = paths[deep];
                    childPathNode[rootProperty] = [];
                    nodeMap[path] = childPathNode;
                    pathNode[rootProperty].push(childPathNode);
                    pathNode.leaf = false;
                    pathNode.expanded = !!opt.expand;
                }
                pathNode = childPathNode;
            }
            Object.assign(pathNode, record);
        }
        if (opt.hideUsage && rootNodes.length == 1) {
            return rootNodes[0][rootProperty];
        } else {
            return rootNodes;
        }
    },
    pathTree: function (records, opt) {
        opt = PSR.data.reader.Transform.getPathTreeOption(opt);
        const displayProperty = opt.displayProperty,
            pathProperty = opt.pathProperty,
            pathSplitter = opt.pathSplitter,
            rootProperty = opt.rootProperty,
            rootNode = {},
            rootNodes = rootNode[rootProperty] = [],
            nodeMap = {root: rootNode};
        for (let index = 0; records && index < records.length; index++) {
            // 节点赋值, 获取路径值
            const record = Object.assign({isRecord: true, leaf: true}, records[index]),
                pathValue = record[pathProperty],
                paths = pathValue ? pathValue.split(pathSplitter) : null;
            // 如果不存在路径值，为根节点
            if (!pathValue || pathValue == '') {
                rootNodes.push(record);
                continue;
            }
            let path = 'root',
                pathNode = rootNode;
            for (let deep = 0; deep < paths.length; deep++) {
                path = path + '/' + paths[deep];
                let childPathNode = nodeMap[path];
                if (!childPathNode) {
                    childPathNode = {leaf: false, expanded: !!opt.expand};
                    childPathNode[displayProperty] = paths[deep];
                    childPathNode[rootProperty] = [];
                    pathNode[rootProperty].push(childPathNode);
                    nodeMap[path] = childPathNode;
                }
                pathNode = childPathNode;
            }
            pathNode[rootProperty].push(record);
        }
        return rootNodes;
    },
    parentTree: function (records, opt) {
        opt = Object.assign({}, opt);
        const rootProperty = opt.rootProperty ? opt.rootProperty : 'content',
            parentIdField = opt.parentIdField ? opt.parentIdField : 'parentId',
            roots = [];
        if (records && records.length > 0) {
            const nodeMap = {};
            for (let i = 0; i < records.length; i++) {
                const record = Object.assign({}, records[i]);
                if (record.iconCls == null) {
                    delete record.iconCls;
                }
                const tempNode = {leaf: true};
                if (opt.expand === true) {
                    tempNode.expanded = true;
                } else if (opt.expand === false) {
                    tempNode.expanded = false;
                }
                tempNode[rootProperty] = [];
                nodeMap[record.id] = Object.assign(tempNode, record);
            }
            for (let nodeMapKey in nodeMap) {
                const node = nodeMap[nodeMapKey];
                if (node[parentIdField] && nodeMap[node[parentIdField]]) {
                    const parentNode = nodeMap[node[parentIdField]];
                    parentNode.leaf = false
                    parentNode[rootProperty].push(node);
                } else {
                    roots.push(node);
                }
            }
        }
        const result = {expanded: true};
        if (opt.root) {
            const root = Object.assign({leaf: false, expanded: true}, opt.root);
            root[rootProperty] = roots;
            result[rootProperty] = [root];
        } else {
            result[rootProperty] = roots;
        }
        return result;
    }
});
