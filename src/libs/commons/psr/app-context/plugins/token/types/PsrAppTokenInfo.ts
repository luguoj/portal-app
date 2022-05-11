export type PsrAppTokenState = 'not_authenticated' | 'certification_expired' | 'authenticated' | 'synchronizing'

export interface PsrAppTokenInfo {
    access_token: string;
    expires_at?: number | null;
    token_type: { value: string } | null;
    authentication: {
        state: PsrAppTokenState;
        username: string
    }
}