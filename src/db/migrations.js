import { getUnixTime } from 'date-fns';
import { INSTRUMENT_ROLES, TABLE } from './constants';

export const migrateUser = async (client) => {
  // user table - user records
  if (await client.schema.hasTable(TABLE.USER)) {
    throw new Error(`The table ${TABLE.USER} already exists.`);
  }

  const time = getUnixTime(new Date);
  await client.schema.createTable(TABLE.USER, (table) => {
    table
      .increments('id')
      .primary()
      .unsigned();
    table.dateTime('created_at').notNullable().defaultTo(time);
    table.dateTime('updated_at').notNullable().defaultTo(time);
    table.string('first_name', 100).notNullable().index();
    table.string('last_name', 100).notNullable().index();
    table.string('email').notNullable().unique().index();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
    table.boolean('is_active').defaultTo(true);
  });
}

export const migrateRole = async (client) => {
  // role table - role(instrument) records
  if (await client.schema.hasTable(TABLE.ROLE)) {
    throw new Error(`The table ${TABLE.ROLE} already exists.`);
  }

  const time = getUnixTime(new Date);
  await client.schema.createTable(TABLE.ROLE, (table) => {
    table
      .increments('id')
      .primary()
      .unsigned();
    table.dateTime('created_at').notNullable().defaultTo(time);
    table.dateTime('updated_at').notNullable().defaultTo(time);
    table.enu('instrument', INSTRUMENT_ROLES).notNullable().unique();
  });
}

export const migrateSong = async (client) => {
  // song table - song records
  if (await client.schema.hasTable(TABLE.SONG)) {
    throw new Error(`The table ${TABLE.SONG} already exists.`);
  }

  const time = getUnixTime(new Date);
  await client.schema.createTable(TABLE.SONG, (table) => {
    table
      .increments('id')
      .primary()
      .unsigned();
    table.dateTime('created_at').notNullable().defaultTo(time);
    table.dateTime('updated_at').notNullable().defaultTo(time);
    table.string('title').notNullable().index();
    table.text('band').notNullable().index();
    table.string('album');
    table.integer('album_year');
    table.text('description');
  });
}

export const migrateJam = async (client) => {
  // jam table - jam records
  if (await client.schema.hasTable(TABLE.JAM)) {
    throw new Error(`The table ${TABLE.JAM} already exists.`);
  }

  const time = getUnixTime(new Date);
  await client.schema.createTable(TABLE.JAM, (table) => {
    table
      .increments('id')
      .primary()
      .unsigned();
    table.dateTime('created_at').notNullable().defaultTo(time);
    table.dateTime('updated_at').notNullable().defaultTo(time);
    table.string('description').notNullable();
    table
      .integer('song_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('song')
      .onDelete('SET NULL');
    table
      .integer('author_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('user')
      .onDelete('SET NULL');
    table.boolean('started').defaultTo(false);
    table.boolean('finished').defaultTo(false);
    table.boolean('public').defaultTo(true);
  });
}

export const migrateAssignment = async (client) => {
  // assignment table - jam assignment records
  if (await client.schema.hasTable(TABLE.ASSIGNMENT)) {
    throw new Error(`The table ${TABLE.ASSIGNMENT} already exists.`);
  }

  const time = getUnixTime(new Date);
  await client.schema.createTable(TABLE.ASSIGNMENT, (table) => {
    table
      .increments('id')
      .primary()
      .unsigned();
    table.dateTime('created_at').notNullable().defaultTo(time);
    table.dateTime('updated_at').notNullable().defaultTo(time);
    table
      .integer('user_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE') // if user is deleted, delete 'assignment' as well
    table
      .integer('role_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('role')
      .onDelete('SET NULL');
    table
      .integer('jam_id')
      .references('id')
      .inTable('jam')
      .onDelete('CASCADE') // if jam is deleted, delete 'assignment' as well
  });
}

export const migrateUserRole = async (client) => {
  // many-to-many user-role table
  if (await client.schema.hasTable(TABLE.USER_ROLE)) {
    throw new Error(`The table ${TABLE.USER_ROLE} already exists.`);
  }

  await client.schema.createTable(TABLE.USER_ROLE, (table) => {
    table.increments('id').primary().unsigned();
    table
      .integer('user_id')                // add a foreign key (FK)
      .references('id').inTable('user')  // which references user PK
      .onUpdate('CASCADE')               // if user PK is changed, update FK as well
      .onDelete('CASCADE')               // if user is deleted, delete 'user_role' as well
    table
      .integer('role_id')
      .references('id')
      .inTable('role')
  });
}

export const migrateSongRole = async (client) => {
  // many-to-many song-role table
  if (await client.schema.hasTable(TABLE.SONG_ROLE)) {
    throw new Error(`The table ${TABLE.SONG_ROLE} already exists.`);
  }

  await client.schema.createTable(TABLE.SONG_ROLE, (table) => {
    table.increments('id').primary().unsigned();
    table
      .integer('song_id')
      .references('id')
      .inTable('song')
      .onUpdate('CASCADE')
      .onDelete('CASCADE') // if song is deleted, delete 'song_role' as well
    table
      .integer('role_id')
      .references('id')
      .inTable('role')
  });
}
