export interface PsrAppTokenServiceData {
    username: string;
    access_token: string;
    token_type: { value: string };
    expires_at?: number | null;
}

export interface PsrAppTokenService {
    baseURL(): string;

    getToken(): Promise<PsrAppTokenServiceData>;

    signOut(): Promise<any>;
}