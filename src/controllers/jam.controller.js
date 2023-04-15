import repository from '../db';
import { TABLE } from '../db/constants';
import { Jam } from '../models/jam';

/**
 * > Jam model for UI
 * Model = {
 *    id: string
 *    created_at: timestamp
 *    description: string
 *    started: boolean
 *    finished: boolean
 *    author: {
 *      username
 *    }
 *    song: {
 *      title
 *      band
 *      album
 *      album_year
 *      description
 *    }
 *    available_roles: []
 *    filled_roles: []
 * }
 * @returns Model
 */
const getJams = async () => {
  const dbClient = repository.getClient();

  const jamsRecords = await dbClient
    .select(
      'jam.id', 'jam.created_at', 'jam.description', 'jam.started', 'jam.finished',
      'song.id as song_id', 'song.title as song_title', 'song.band as song_band', 'song.description as song_description', 'song.album as song_album', 'song.album_year as song_album_year',
      'user.username as user_username',
      dbClient.raw('GROUP_CONCAT (role.instrument) filled_roles'),
    )
    .from(`${TABLE.JAM} as jam`)
    .leftJoin(`${TABLE.SONG} as song`, 'jam.song_id', 'song.id')
    .leftJoin(`${TABLE.USER} as user`, 'jam.author_id', 'user.id')
    .innerJoin(`${TABLE.JAM_ROLE} as jam_roles`, 'jam_id', 'jam_roles.jam_id')
    .innerJoin(`${TABLE.ROLE} as role`, 'role.id', 'jam_roles.role_id')
    .groupBy('jam.id')
    .orderBy('jam.created_at');

  if (Array.isArray(jamsRecords)) {
    for (const jam of jamsRecords) {
      const { song_id } = jam;

      const roles = await dbClient
        .select('instrument')
        .from(TABLE.SONG_ROLE)
        .where('song_id', song_id)
        .leftJoin(TABLE.ROLE, 'role.id', 'song_role.role_id');

      jam.all_roles = roles.map(role => role.instrument);
    }

    return jamsRecords.map(jam => new Jam(jam).toDto());
  }

  return [];
};

export {
  getJams,
};