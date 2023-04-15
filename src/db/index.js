import { knex } from 'knex';
import { annotation } from '../lib/decorators';
import { TABLE } from './constants';
import {
  migrateUser,
  migrateRole,
  migrateSong,
  migrateJam,
  migrateUserRole,
  migrateSongRole,
  migrateJamUser,
  migrateJamRole,
} from './migrations';
import {
  seedUsers,
  seedRoles,
  seedSongs,
  seedUserRoles,
  seedSongRoles,
  seedJams,
} from './seeds';

const knexClient = knex({
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
});

export const migrate = async (client) => {
  await migrateUser(client);
  await migrateRole(client);
  await migrateSong(client);
  await migrateJam(client);
  // relations
  await migrateUserRole(client);
  await migrateSongRole(client);
  await migrateJamUser(client);
  await migrateJamRole(client);
}

const down = async (client) => {
  await client.schema
    .dropTableIfExists(TABLE.ROLE)
    .dropTableIfExists(TABLE.USER)
    .dropTableIfExists(TABLE.SONG)
    .dropTableIfExists(TABLE.JAM)
}

const seed = async (client) => {
  await seedRoles(client);
  await seedUsers(client);
  await seedUserRoles(client);
  await seedSongs(client);
  await seedSongRoles(client);
  await seedJams(client);
}


@annotation
class Repository {
  #client = null;

  constructor(client) {
    if (!client) {
      throw new Error('The DB client is not provided.');
    }
    this.#client = client;
  }

  async migrate() {
    await migrate(this.#client);
  }

  async seed() {
    await seed(this.#client);
  }

  async down() {
    await down(this.#client);
  }

  getClient() {
    return this.#client;
  }
}

const repository = new Repository(knexClient);

export default repository;
