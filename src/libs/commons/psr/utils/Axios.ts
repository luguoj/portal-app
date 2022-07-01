import {AxiosError, AxiosResponse} from "axios";
import {ElMessage} from "element-plus";

export function handleRespData(resp: AxiosResponse) {
    if (resp && resp.data) {
        return resp.data
    }
    return null
}

export function handleErrorMessage(error: AxiosError) {
    ElMessage({
        message: `失败. ${error.message}`,
        type: 'error'
    })
    return Promise.reject(error)
}