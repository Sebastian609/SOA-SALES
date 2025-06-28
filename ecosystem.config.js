module.exports = {
    apps: [
      {
        name: 'soa-tickets-api',
        script: 'dist/server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'development',
          PORT: 2226
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 2226
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true
      }
    ]
  };
  