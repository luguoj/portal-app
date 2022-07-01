import {PsrAppPersonalService} from "@/libs/commons/psr/app-context/personal/types/PsrAppPersonalService";
import {PsrAppPersonalRaw} from "@/libs/commons/psr/app-context/personal/types/PsrAppPersonalRaw";
import {ref, Ref} from "vue";

export class PsrAppPersonal {
    service: PsrAppPersonalService
    username: string = ''
    personal: Ref<PsrAppPersonalRaw> = ref(PsrAppPersonal.noname())

    static noname(): PsrAppPersonalRaw {
        return {
            fullName: '匿名用户',
            avatar: {iconCls: 'pi pi-user'}
        }
    }

    constructor(service: PsrAppPersonalService) {
        this.service = service;
    }

    changeUser(newUsername: string) {
        const oldUsername = this.username
        this.username = newUsername
        if (newUsername != '') {
            if (oldUsername !== newUsername) {
                return this.service(newUsername)
                    .then(newPersonal => {
                        if (this.username === newUsername) {
                            this.personal.value = newPersonal || PsrAppPersonal.noname()
                            return newPersonal
                        } else {
                            throw new Error("用户切换许可更新请求废弃")
                        }
                    })
                    .catch(() => {
                        throw new Error("获取个人信息失败")
                    })
            }
        } else {
            if (oldUsername !== newUsername) {
                this.personal.value = PsrAppPersonal.noname()
            }
        }
        return Promise.resolve(this.personal.value)
    }
}