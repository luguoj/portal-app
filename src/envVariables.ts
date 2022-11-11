if (process.env.VUE_APP_PORTAL_ID === undefined) {
    throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
export const appPortalId: string = process.env.VUE_APP_PORTAL_ID
