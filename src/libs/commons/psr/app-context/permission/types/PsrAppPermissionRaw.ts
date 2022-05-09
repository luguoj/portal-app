export type PsrAppPermissionUsage = 'route' | 'widget'
export type PsrAppPermissionRaw = 'permit-all' | Record<PsrAppPermissionUsage, Record<string | symbol, string[]>>