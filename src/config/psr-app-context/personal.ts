import {PsrAppPersonalService} from "@/libs/commons/psr/app-context/personal";
import {organizationService} from "@/services/organization";

export const personalService: PsrAppPersonalService = (username: string) => {
    return organizationService.user.findPersonnel().then(userPersonnel => {
        if (userPersonnel) {
            return {
                fullName: (userPersonnel.lastName || '') + (userPersonnel.firstName || ''),
                avatar: {
                    iconCls: 'pi pi-user'
                }
            }
        } else {
            return organizationService.user.updatePersonnel({
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