import {config} from "dotenv";

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/api/blogs',
        POSTS: '/api/posts',
        COMMENTS: '/api/comments',
        TESTING: '/api/testing/all-data',
        USERS: '/api/users',
        AUTH: '/api/auth',
        SECURITY: '/api/security',
        API_URL: process.env.API_URL,
        MONGODB: process.env.MONGO_URI
    },
    VARIABLES: {
        // DB_NAME: 'db9',
        BLOG_COLLECTION_NAME: 'blogs',
        POST_COLLECTION_NAME: 'posts',
        USER_COLLECTION_NAME: 'users',
        COMMENT_COLLECTION_NAME: 'comments',
        TOKEN_COLLECTION_NAME: 'tokens',
        DEVICE_COLLECTION_NAME: 'devices',
        RATE_LIMIT_COLLECTION_NAME: 'rate-limit',
        ADMIN: process.env.ADMIN || 'admin:qwerty',
        JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS,
        JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH,
    }
}
