Ext.define('PSR.data.reader.Transform', {
    alternateClassName: ['PSR.ReaderTransform'],
    singleton: true,
    getPathTreeOption: function (opt) {
        return Object.assign({
            expand: null,
            displayProperty: 'text',
            pathProperty: 'path',
            pathSplitter: '/',
            rootProperty: 'result'
        }, opt);
    },
    pathTree: function (records, opt) {
        opt = PSR.data.reader.Transform.getPathTreeOption(opt);
        var displayProperty = opt.displayProperty;
        var pathProperty = opt.pathProperty;
        var pathSplitter = opt.pathSplitter;
        var rootProperty = opt.rootProperty;
        var nodeMap = {};
        var rootNodes = [];
        for (var index = 0; records && index < records.length; index++) {
            // 节点赋值
            var record = Object.assign({isPath: false}, records[index]);
            // 获取路径值
            var pathValue = record[pathProperty];
            // 如果不存在路径值，为无效路径记录，跳过
            if (!pathValue) {
                continue;
            }
            var paths = pathValue.split(pathSplitter);
            var newPathNode = nodeMap[pathValue];
            // 如果不存在已创建的节点，则创建路径节点
            if (!newPathNode) {
                newPathNode = {leaf: true, isPath: true};
                newPathNode[displayProperty] = paths[paths.length - 1];
                newPathNode[rootProperty] = [];
                nodeMap[pathValue] = newPathNode;
                // 构造树结构
                if (paths.length == 1) {
                    // 自身为根节点
                    rootNodes.push(newPathNode);
                } else {
                    //自身不为根节点
                    var path = paths[0];
                    var pathNode = nodeMap[path];
                    if (!pathNode) {
                        pathNode = {isPath: true};
                        pathNode[displayProperty] = paths[0];
                        pathNode[rootProperty] = [];
                        rootNodes.push(pathNode);
                        nodeMap[path] = pathNode;
                    }
                    pathNode.leaf = false;
                    if (opt.expand === true) {
                        pathNode.expanded = true;
                    } else if (opt.expand === false) {
                        pathNode.expanded = false;
                    }
                    for (var deep = 1; deep < paths.length - 1; deep++) {
                        path = path + '/' + paths[deep];
                        var childPathNode = nodeMap[path];
                        if (!childPathNode) {
                            childPathNode = {isPath: true};
                            childPathNode[displayProperty] = paths[deep];
                            childPathNode[rootProperty] = [];
                            pathNode[rootProperty].push(childPathNode);
                            nodeMap[path] = childPathNode;
                        }
                        childPathNode.leaf = false;
                        if (opt.expand === true) {
                            childPathNode.expanded = true;
                        } else if (opt.expand === false) {
                            childPathNode.expanded = false;
                        }
                        pathNode = childPathNode;
                    }
                    pathNode[rootProperty].push(newPathNode);
                }
            }
            Object.assign(newPathNode, record);
        }
        return rootNodes;
    },
    parentTree: function (records, opt) {
        opt = Object.assign({}, opt);
        var rootProperty = opt.rootProperty ? opt.rootProperty : 'result';
        var roots = [];
        if (records && records.length > 0) {
            var nodeMap = {};
            for (var i = 0; i < records.length; i++) {
                var record = Object.assign({}, records[i]);
                if (record.iconCls == null) {
                    delete record.iconCls;
                }
                var tempNode = {leaf: true};
                if (opt.expand === true) {
                    tempNode.expanded = true;
                } else if (opt.expand === false) {
                    tempNode.expanded = false;
                }
                tempNode[rootProperty] = [];
                nodeMap[record.id] = Object.assign(tempNode, record);
            }
            for (var nodeMapKey in nodeMap) {
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
            var result = {isPath: true},
                root = Object.assign({leaf: false, expanded: true, isPath: true}, opt.root);
            root[rootProperty] = roots;
            result[rootProperty] = [root];
            return result;
        } else {
            var result = {isPath: true};
            result[rootProperty] = roots;
            return result;
        }
    }
});
