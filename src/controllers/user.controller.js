import repository from '../db';
import { TABLE } from '../db/constants';
import { hashPassword } from '../lib/utils';

const getUserById = async (userId) => {
  const dbClient = repository.getClient();
  // For PostgreSQL use ARRAY_AGG
  const user = await dbClient
    .select(
      'user.first_name', 'user.last_name', 'user.email', 'user.username', 'user.id',
      dbClient.raw('GROUP_CONCAT (role.instrument) instruments')
    )
    .from(TABLE.USER)
    .innerJoin(TABLE.USER_ROLE, { 'user.id': 'user_role.user_id' })
    .innerJoin(TABLE.ROLE, { 'role.id': 'user_role.role_id' })
    .where('user.id', userId)
    .groupBy('user.id')
    .orderBy('user.id')
    .first();

  Object.assign(user, { instruments: user.instruments.split(',') });

  return user;
};

const createUser = async (payload) => {
  const dbClient = repository.getClient();
  const { instruments } = payload;
  delete payload.instruments;
  payload.password = await hashPassword(payload.password);

  const user = await dbClient
    .insert(payload)
    .into(TABLE.USER)
    .returning('id');
  const [{ id: user_id }] = user;

  for (const instrument of instruments) {
    const [{ id: role_id }] = await dbClient
      .select('id')
      .from(TABLE.ROLE)
      .where('instrument', instrument)

    await dbClient
      .insert({ user_id, role_id })
      .into(TABLE.USER_ROLE);
  }

  return user_id;
}

export {
  getUserById,
  createUser,
};