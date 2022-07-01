export type PsrAppTokenState = 'not_authenticated' | 'certification_expired' | 'authenticated' | 'synchronizing'

export interface PsrAppTokenPrincipal {
    state: PsrAppTokenState;
    username: string
}

export interface PsrAppTokenInfo {
    access_token: string;
    expires_at?: number | null;
    token_type: { value: string } | null;
}