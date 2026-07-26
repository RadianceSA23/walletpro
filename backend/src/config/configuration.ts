export default () => ({
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb+srv://riseinradiance_db_user:Wp5ETBgKYEy7XF45@expensetrackercluster.c8rehgm.mongodb.net/expense_tracker?retryWrites=true&w=majority',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_access_secret',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret',
    expiresIn: process.env.JWT_EXPIRATION || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
});
