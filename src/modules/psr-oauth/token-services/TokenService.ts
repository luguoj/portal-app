interface TokenData {
    username: string;
    access_token: string;
    token_type: { value: string };
    expires_at?: number | null;
}

interface TokenService {
    getToken(): Promise<TokenData>;

    signOut(): Promise<any>;
}