import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_PSR_GATEWAY_URL + '/portal/api/user/route_permission?portalId=platform-management-desktop',
    'get',
    []
)

Mock.mock(
    new RegExp(process.env.VUE_APP_PSR_GATEWAY_URL + '/portal/api/entity/org.psr.platform.portal.entity.GroupEntity' + '.*'),
    'get',
    {
        'content|20': [{
            id: '@guid',
            code: '@cword(8,16)',
            description: '@cword(16,32)',
            enabled: '@boolean'
        }]
    }
)
