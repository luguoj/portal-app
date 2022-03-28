interface TokenData {
    username: string;
    access_token: string;
    token_type: { value: string };
    expires_at?: number | null;
}

interface TokenService {
    baseURL(): string;

    getToken(): Promise<TokenData>;

    signOut(): Promise<any>;
}