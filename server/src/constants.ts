const constants = {
    /** Used by Bcrypt to determine hash strength */
    BCRYPT_SALT_ROUNDS: 12,
    /** Used by server to determine login token lifespan */
    // Current lifespan is set to 7 days so user doesnt have to login again often
    LOGIN_TOKEN_LIFESPAN_MS: 7 * 24 * 3600 * 1000
}
export default constants;
