import dns from 'dns'
import { connect } from 'mongoose'

import { DNS_SERVERS, MONGO_URI } from './secrets'

export const CONNECT_DB = async () => {
   try {
      if (DNS_SERVERS.trim()) {
         const servers = DNS_SERVERS.split(',')
            .map(server => server.trim())
            .filter(Boolean)

         if (servers.length > 0) {
            dns.setServers(servers)
            console.info(
               `📡[DNS]: Using custom DNS servers: ${servers.join(', ')}`,
            )
         }
      }

      const { connections } = await connect(MONGO_URI, {
         maxPoolSize: 50, // Maximum number of connections in the pool
         minPoolSize: 10, // Minimum number of connections in the pool
         socketTimeoutMS: 120000, // Close sockets after 120 seconds of inactivity
         serverSelectionTimeoutMS: 30000, // Timeout after 30s
         connectTimeoutMS: 30000, // Connection timeout
         family: 4, // Use IPv4, skip trying IPv6
         maxIdleTimeMS: 60000, // Close idle connections after 60 seconds
         compressors: ['zlib'], // Enable compression for network traffic
         retryWrites: true,
         retryReads: true,
      })
      console.info(
         `⚡️[DB]: Name:${connections[0].name}; ${connections[0].host}:${connections[0].port}`,
      )
      console.info(`📊[DB]: Pool size: min=${10}, max=${50}`)
   } catch (err) {
      console.error('❌[DB]: Connection failed:', err)
      throw err
   }
}
