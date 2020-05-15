Ext.define('PSR.data.reader.Transform', {
    alternateClassName: ['PSR.ReaderTransform'],
    singleton: true,
    getPathTreeOption: function (opt) {
        return Object.assign({
            expand: false,
            displayProperty: 'text',
            pathProperty: 'path',
            pathSplitter: '/',
            rootProperty: 'result'
        }, opt);
    },
    transforCatalogedNode: function (record, opt) {
        if (record.catalog) {
            record[opt.pathProperty] = record.catalog.path + '/' + record[opt.displayProperty];
        } else {
            record[opt.pathProperty] = record[opt.displayProperty];
        }
        return record;
    },
    pathTree: function (records, opt) {
        opt = PSR.data.reader.Transform.getPathTreeOption(opt);
        const displayProperty = opt.displayProperty;
        const pathProperty = opt.pathProperty;
        const pathSplitter = opt.pathSplitter;
        const rootProperty = opt.rootProperty;
        const nodeMap = {};
        const rootNodes = [];
        for (let index = 0; index < records.length; index++) {
            // 节点赋值
            const record = Object.assign({isRecord: true},
                (opt && opt.transformNode) ?
                    opt.transformNode(records[index], opt) : records[index]);

            // 获取路径值
            const pathValue = record[pathProperty];
            // 如果不存在路径值，为无效路径记录，跳过
            if (!pathValue) {
                continue;
            }
            const paths = pathValue.split(pathSplitter);
            let newPathNode = nodeMap[pathValue];
            // 如果不存在已创建的节点，则创建路径节点
            if (!newPathNode) {
                newPathNode = {leaf: true};
                newPathNode[displayProperty] = paths[paths.length - 1];
                newPathNode[rootProperty] = [];
                nodeMap[pathValue] = newPathNode;
                // 构造树结构
                if (paths.length == 1) {
                    // 自身为根节点
                    rootNodes.push(newPathNode);
                } else {
                    //自身不为根节点
                    let path = paths[0];
                    let pathNode = nodeMap[path];
                    if (!pathNode) {
                        pathNode = {leaf: false, expanded: opt.expand};
                        pathNode[displayProperty] = path;
                        pathNode[rootProperty] = [];
                        nodeMap[path] = pathNode;
                        rootNodes.push(pathNode);
                    }
                    for (let deep = 1; deep < paths.length - 1; deep++) {
                        path = path + '/' + paths[deep];
                        let childPathNode = nodeMap[path];
                        if (!childPathNode) {
                            childPathNode = {};
                            childPathNode[displayProperty] = paths[deep];
                            childPathNode[rootProperty] = [];
                            pathNode[rootProperty].push(childPathNode);
                            nodeMap[path] = childPathNode;
                        }
                        childPathNode.leaf = false;
                        childPathNode.expanded = opt.expand;
                        pathNode = childPathNode;
                    }
                    pathNode.leaf = false;
                    pathNode.expanded = opt.expand;
                    pathNode[rootProperty].push(newPathNode);
                }
            }
            for (let key in record) {
                newPathNode[key] = record[key];
            }
        }
        return rootNodes;
    },
    parentTree: function (records, opt) {
        opt = Object.assign({}, opt);
        const rootProperty = opt.rootProperty ? opt.rootProperty : 'result';
        var roots = [];
        if (records && records.length > 0) {
            var nodeMap = {};
            for (let i = 0; i < records.length; i++) {
                const record = Object.assign({},
                    (opt && opt.transformNode) ?
                        opt.transformNode(records[i], opt) : records[i]);
                if (record.iconCls == null) {
                    delete record.iconCls;
                }
                nodeMap[record.id] = Object.assign({leaf: true, [rootProperty]: [], isRecord: true}, record);
            }
            for (const nodeMapKey in nodeMap) {
                var node = nodeMap[nodeMapKey];
                if (node.parentId && nodeMap[node.parentId]) {
                    var parentNode = nodeMap[node.parentId];
                    parentNode.leaf = false
                    parentNode[rootProperty].push(node);
                } else {
                    roots.push(node);
                }
            }
        }
        if (opt.root) {
            return {
                [rootProperty]: [Object.assign(
                    {leaf: false, expanded: true},
                    opt.root,
                    {[rootProperty]: roots}
                )]
            };
        } else {
            return {
                [rootProperty]: roots
            }
        }
    }
});
