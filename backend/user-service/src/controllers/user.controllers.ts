//backend/user-service/src/controllers/user.controllets.ts
import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { User } from '../models/user.models';

interface GetUserRoute extends RouteGenericInterface {
	Params: {
		id: string;
	};
}
// Get all users
export const getUsers = async (req: FastifyRequest, res: FastifyReply) => {
	try {
		const users = await User.findAll({
			attributes: { exclude: ['password'] }
		});
		return res.status(200).send({ success: true, data: users });
  	} catch (error) {
    	return res.status(500).send({ success: false, message: (error as Error).message });
  	}
};
// Get a single user by ID
export const getUser = async (req: FastifyRequest<GetUserRoute>, res: FastifyReply) => {
	try {
    	const { id } = req.params;
    	const user = await User.findByPk(id, {
      		attributes: { exclude: ['password'] }
    	});
    	if (!user)
			return res.status(404).send({ success: false, message: 'User not found' });
    	return res.status(200).send({ success: true, data: user });
  	} catch (error) {
    	return res.status(500).send({ success: false, message: (error as Error).message });
  	}
};


interface CreateUserRequestBody {
    id?: number;
    name: string;
    email: string;
}

export const createUser = async (req: FastifyRequest<{ Body: CreateUserRequestBody }>, reply: FastifyReply) => {
    try {
        const { id, name, email } = req.body;
        if (!email || !name)
            return reply.status(400).send({ success: false, message: 'Email and Name are required' });
        const newUser = await User.create({ id, name, email });
        return reply.status(201).send({ success: true, data: newUser });
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError')
            return reply.status(409).send({ success: false, message: 'User with this email already exists' });
        console.error('USER_SERVICE: Error creating user:', error);
        return reply.status(500).send({ success: false, message: (error as Error).message });
    }
};