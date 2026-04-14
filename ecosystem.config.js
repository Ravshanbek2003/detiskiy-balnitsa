module.exports = {
   apps: [
      {
         name: 'detiskiy-balnisa',
         script: 'dist/server.js',
         instances: 1,
         exec_mode: 'fork',
         watch: false,
         max_memory_restart: '500M', // Restart if memory exceeds 500MB
         error_file: './logs/error.log',
         out_file: './logs/out.log',
         log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
         merge_logs: true,
         autorestart: true,
         max_restarts: 10,
         min_uptime: '10s', // Consider app crashed if uptime is less than 10s
         restart_delay: 4000,
         env: {
            NODE_ENV: 'production',
         },
      },
   ],
}
