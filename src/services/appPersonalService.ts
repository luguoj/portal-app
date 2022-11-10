import {PsrAppPersonalService} from "@/libs/commons/psr/app-context/personal";
import {useGatewayClient} from "@/services/useGatewayClient";
import {handleErrorMessage, handleRespData} from "@/libs/commons/psr/utils/Axios";
import {Entity} from "@/libs/services/psr-entity-crud";

const ApiClient = useGatewayClient('/organization/api')

export interface UserPersonnelEntity extends Entity {
    firstName?: string
    lastName?: string
    resume?: string
}

function findPersonnel(): Promise<UserPersonnelEntity | null> {
    return ApiClient.get('/user/personnel').then(handleRespData).catch(handleErrorMessage)
}

function updatePersonnel(userPersonnelEntity: UserPersonnelEntity): Promise<UserPersonnelEntity> {
    return ApiClient.put('/user/personnel', userPersonnelEntity).then(handleRespData).catch(handleErrorMessage)
}

export const appPersonalService: PsrAppPersonalService = (username: string) => {
    return findPersonnel().then(userPersonnel => {
        if (userPersonnel) {
            return {
                fullName: (userPersonnel.lastName || '') + (userPersonnel.firstName || ''),
                avatar: {
                    iconCls: 'pi pi-user'
                }
            }
        } else {
            return updatePersonnel({
                lastName: '',
                firstName: username,
            }).then(newUserPersonnel => {
                return {
                    fullName: (newUserPersonnel.lastName || '') + (newUserPersonnel.firstName || ''),
                    avatar: {
                        iconCls: 'pi pi-user'
                    }
                }
            })
        }
    });
}