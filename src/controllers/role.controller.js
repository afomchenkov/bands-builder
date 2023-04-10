import repository from '../db';
import { TABLE } from '../db/constants';

const getRoles = async () => {
  const dbClient = repository.getClient();
  const roles = await dbClient(TABLE.ROLE);

  if (Array.isArray(roles)) {
    return roles;
  }

  return [];
};

export {
  getRoles,
};