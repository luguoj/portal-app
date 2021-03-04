Ext.define('PSR.data.store.CatalogableTree', {
    extend: 'PSR.data.store.CatalogTree',
    searchCatalogable: function (opt) {
        PSR.Message.error('未实现searchCatalogable方法');
    },
    isRecord: false,
    fields: ['isRecord', 'code', 'description', 'text', {
        name: 'displaytext',
        calculate: function (data) {
            return data.isRecord ? (data.code + ' - ' + data.description) : data.text;
        }
    }],
    listeners: {
        load: function (store, records, catalogable) {
            if (catalogable == true) {
                const catalogUsage = store.getCatalogUsage(),
                    catalogMap = store.byIdMap;
                for (const catalogId in catalogMap) {
                    catalogMap[catalogId].set('iconCls', 'x-fa fa-spinner fa-spin');
                }
                store.searchCatalogable({
                    success: function (respObj) {
                        if (respObj && respObj.content) {
                            let root = store.getRoot(),
                                catalogableRecords = [],
                                nodeMap = {};
                            nodeMap[catalogUsage] = [];
                            for (let i = 0; i < respObj.content.length; i++) {
                                const entity = respObj.content[i];
                                Object.assign(entity, {leaf: true, isRecord: true});
                                let node = root.createNode(entity);
                                catalogableRecords.push(node);
                                if (entity.catalogId && catalogMap[entity.catalogId]) {
                                    if (!nodeMap[entity.catalogId]) {
                                        nodeMap[entity.catalogId] = [];
                                    }
                                    nodeMap[entity.catalogId].push(node);
                                } else {
                                    nodeMap[catalogUsage].push(node);
                                }
                            }
                            for (const catalogId in catalogMap) {
                                const catalogNode = catalogMap[catalogId];
                                if (nodeMap[catalogId] && nodeMap[catalogId].length > 0) {
                                    store.fillNode(catalogNode, nodeMap[catalogId]);
                                }
                                catalogNode.set('iconCls', '');
                                catalogNode.expand();
                            }
                            store.fireEvent('load', store, catalogableRecords, 'catalogable');
                        }
                    }
                });
            }
        }
    }
});
