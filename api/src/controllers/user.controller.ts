import {
    FastifyInstance,
    FastifyRequest,
    FastifyReply,
} from 'fastify';
  
import {User} from '@prisma/client';
import {UserService} from '../services/user.service';

export default async (app: FastifyInstance,  service: UserService) => {

    // create user
    app.post<{ Body: User }>("/users/create", async (request: FastifyRequest, reply: FastifyReply) => {
        const user  = request.body as User;

        const newUser = await service.create(user).catch((err: any) => {
            reply.status(500).send({
            error: err.message,
            });
        });

        reply.status(201).send(newUser);
    });

    // get user by id
    app.get<{Params: {id: string}}>("/users/:id", async (request, reply) => {
        if (!request.params.id) {
            reply.status(400).send({
                error: "No id provided",
            });
        }
        const command = await service.get(request.params.id).catch((err: any) => {
            reply.status(500).send({
                error: err.message,
            });
        });

        if (!command) {
            reply.status(404).send({
                error: "No command found",
            });
        }

        reply.status(200).send(command);
    });


}