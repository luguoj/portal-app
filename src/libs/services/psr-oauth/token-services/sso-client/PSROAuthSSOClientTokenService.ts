import axios, {AxiosInstance} from "axios";

export class PSROAuthSSOClientTokenService implements TokenService {
    private readonly _baseURL: string;
    // 授权客户端
    private readonly _authClient: AxiosInstance;

    constructor(baseURL: string) {
        this._baseURL = baseURL
        this._authClient = axios.create({
            baseURL: baseURL,
            withCredentials: true
        })
    }

    baseURL() {
        return this._baseURL
    }

    // 调用获取令牌信息接口
    getToken() {
        return new Promise<TokenData>((resolve, reject) => {
            this._authClient.get('/api/token')
                .then(response => {
                        resolve(response.data)
                    }
                ).catch(err => {
                    reject(err)
                }
            )
        })
    }

    // 登出
    signOut() {
        return new Promise((resolve, reject) => {
            this._authClient.get('/logout')
                .then(response => {
                    resolve(response)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}