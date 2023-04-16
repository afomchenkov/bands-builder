import repository from '../db';
import { TABLE } from '../db/constants';

const getJamAssignmentInfo = async (assignment_ids, song_id) => {
  const dbClient = repository.getClient();

  const assignments = [];

  for (const id of assignment_ids) {
    const assignment = await dbClient
      .select(
        'role.instrument as assignment_instrument',
        'user.username as assignment_username',
      )
      .from(TABLE.ASSIGNMENT)
      .leftJoin(`${TABLE.ROLE} as role`, 'role.id', 'assignment.role_id')
      .leftJoin(`${TABLE.USER} as user`, 'user.id', 'assignment.user_id')
      .where('assignment.id', id);

    assignments.push(...assignment);
  }

  const roles = await dbClient
    .select('instrument')
    .from(TABLE.SONG_ROLE)
    .leftJoin(TABLE.ROLE, 'role.id', 'song_role.role_id')
    .where('song_id', song_id);

  const instruments = roles.map(role => role.instrument);

  return {
    assignments,
    instruments,
  };
}

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
      'author.username as author_username',
      dbClient.raw('GROUP_CONCAT (assignment.id) assignment_ids'),
    )
    .from(`${TABLE.JAM} as jam`)
    .leftJoin(`${TABLE.SONG} as song`, 'jam.song_id', 'song.id')
    .leftJoin(`${TABLE.USER} as author`, 'jam.author_id', 'author.id')
    .leftJoin(`${TABLE.ASSIGNMENT} as assignment`, 'jam.id', 'assignment.jam_id')
    .groupBy('jam.id')
    .orderBy('jam.created_at');

  if (Array.isArray(jamsRecords)) {
    for (const jam of jamsRecords) {
      const { assignment_ids, song_id } = jam;
      const ids = assignment_ids.split(',');

      const { assignments, instruments } = await getJamAssignmentInfo(ids, song_id)

      jam.assignments = assignments;
      jam.instruments = instruments;
    }

    return jamsRecords;
  }

  return [];
};

const getJam = async (jamId) => {
  const dbClient = repository.getClient();

  const jamRecord = await dbClient
    .select(
      'jam.id', 'jam.created_at', 'jam.description', 'jam.started', 'jam.finished',
      'song.id as song_id', 'song.title as song_title', 'song.band as song_band', 'song.description as song_description', 'song.album as song_album', 'song.album_year as song_album_year',
      'author.username as author_username',
      dbClient.raw('GROUP_CONCAT (assignment.id) assignment_ids'),
    )
    .from(`${TABLE.JAM} as jam`)
    .leftJoin(`${TABLE.SONG} as song`, 'jam.song_id', 'song.id')
    .leftJoin(`${TABLE.USER} as author`, 'jam.author_id', 'author.id')
    .leftJoin(`${TABLE.ASSIGNMENT} as assignment`, 'jam.id', 'assignment.jam_id')
    .groupBy('jam.id')
    .orderBy('jam.created_at')
    .where('jam.id', jamId);

  const jam = jamRecord[0];
  const { assignment_ids, song_id } = jam;
  const ids = assignment_ids.split(',');

  const { assignments, instruments } = await getJamAssignmentInfo(ids, song_id)

  jam.assignments = assignments;
  jam.instruments = instruments;

  return jam;
}

const joinJam = async (jamId) => {

}

export {
  getJams,
  getJam,
  joinJam,
};