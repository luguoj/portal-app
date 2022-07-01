import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_PSR_AUTH_CLIENT_URL + '/api/token',
    'get', {
        "access_token": "df34b522-2c2c-4500-b186-b88a052fc23f",
        "expires_at": new Date().getTime() + 10000,
        "token_type": {"value": "Bearer"},
        "username": "platform_admin"
    }
)