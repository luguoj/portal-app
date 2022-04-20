import {PsrAppRouteChangeEvent, PsrAppRouteError} from "./route";
import {watch} from "vue";
import {PsrAppContext} from "./PsrAppContext";

export function processRootRoute(event: PsrAppRouteChangeEvent, context: PsrAppContext) {
    if (event.newRoute.route.name == 'root') {
        const msg: string[] = ['路由到根路径', '跳转到默认布局']
        if (context.navigationMenu.layoutItems.value.length > 0) {
            msg.push(context.navigationMenu.layoutItems.value[0].path)
            console.log(msg.join('=>'))
            throw new PsrAppRouteError(msg.join('=>'), {path: context.navigationMenu.layoutItems.value[0].path})
        } else {
            msg.push('尝试加载布局导航信息')
            if (context.token) {
                msg.push('刷新令牌')
                console.log(msg.join('=>'))
                throw new PsrAppRouteError(
                    '等待令牌刷新',
                    context.token.refreshToken().then(() => {
                        console.log('令刷新成功，添加监听(加载导航布局项目后跳转到默认布局)')
                        return new Promise<{ path: string }>(resolve => {
                            const unWatch = watch(context.navigationMenu.layoutItems, layoutItems => {
                                if (layoutItems.length > 0) {
                                    unWatch()
                                    console.log('监听到布局项目已加载=>跳转到默认布局')
                                    resolve({path: context.navigationMenu.layoutItems.value[0].path})
                                }
                            }, {immediate: true})
                        })
                    }).catch(() => {
                        console.log('令牌刷新失败，直接放行加载根路由组件')
                        return Promise.resolve(true)
                    })
                )
            } else {
                msg.push('令牌上下文不存在，加载失败')
                console.log(msg.join('=>'))
                throw new PsrAppRouteError(msg.join('=>'))
            }
        }

    }
}