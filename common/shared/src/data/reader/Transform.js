Ext.define('PSR.data.reader.Transform', {
    singleton: true,
    getPathTreeOption: function (opt) {
        return Object.assign({
            expand: null,
            displayField: 'text',
            pathField: 'path',
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
        const displayField = opt.displayField,
            pathField = opt.pathField,
            pathSplitter = opt.pathSplitter,
            rootProperty = opt.rootProperty,
            roots = [],
            nodeMap = {};
        for (let index = 0; records && index < records.length; index++) {
            const record = Object.assign({isRecord: true}, records[index]),
                pathValue = record[pathField],
                paths = pathValue ? pathValue.split(pathSplitter) : null;
            let path = '',
                pathNode = null;
            for (let deep = 0; deep < paths.length; deep++) {
                if (deep == 0) {
                    path = paths[deep];
                } else {
                    path = path + pathSplitter + paths[deep];
                }
                let childPathNode = nodeMap[path];
                if (!childPathNode) {
                    childPathNode = {leaf: true, expanded: !!opt.expand};
                    childPathNode[displayField] = paths[deep];
                    childPathNode[pathField] = path;
                    childPathNode.id = path.replaceAll(pathSplitter, '-');
                    childPathNode[rootProperty] = [];
                    nodeMap[path] = childPathNode;
                    if (pathNode) {
                        pathNode.leaf = false;
                        pathNode[rootProperty].push(childPathNode);
                    } else {
                        roots.push(childPathNode);
                    }
                }
                pathNode = childPathNode;
            }
            Object.assign(pathNode, record);
        }
        const result = {};
        result[rootProperty] = roots;
        return result;
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
                const tempNode = {leaf: true, expanded: !!opt.expand};
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
        const result = {};
        result[rootProperty] = roots;
        return result;
    }
});
