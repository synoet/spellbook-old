import { FastifyInstance } from "fastify";

export default async (app: FastifyInstance) => {
    
    app.register(require('fastify-swagger'), {
        routePrefix: '/documentation',
        swagger: {
          info: {
            title: 'Spellbook Fastify API',
            description: 'Auto-generated docs for Spellbock\'s fastify backend API',
            version: '0.1.0'
          },
          externalDocs: {
            url: 'https://spellbook.sh',
            description: 'Check out spellbook\'s official site here'
          },
          host: 'localhost',
          schemes: ['http'],
          consumes: ['application/json'],
          produces: ['application/json'],
          tags: [
            { name: 'command', description: 'Command related end-points' },
            { name: 'user', description: 'User related end-points' }
          ],
          definitions: {
            User: {
              type: 'object',
              required: ['id', 'email'],
              properties: {
                id: { type: 'string', format: 'uuid' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: {type: 'string', format: 'email' }
              }
            }
          },
          securityDefinitions: {
          }
        },
        uiConfig: {
          docExpansion: 'full',
          deepLinking: false
        },
        exposeRoute: false
      })
}