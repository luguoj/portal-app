export interface PsrAppUserProfileService {
    find: () => Promise<any>,
    update: (content: any) => Promise<boolean>
}