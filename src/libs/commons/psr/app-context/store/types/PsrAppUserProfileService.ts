import {PsrAppStoreRootState} from "@/libs/commons/psr/app-context/store";

export interface PsrAppUserProfileService {
    find: () => Promise<PsrAppStoreRootState>,
    update: (content: PsrAppStoreRootState) => Promise<boolean>
}