import repository from '../db';
import { TABLE } from '../db/constants';

const getSongs = async () => {
  const dbClient = repository.getClient();
  const songs = await dbClient(TABLE.SONG);

  if (Array.isArray(songs)) {
    return songs;
  }

  return [];
};

const createSong = async (payload) => {
  const dbClient = repository.getClient();
  const { instruments } = payload;
  delete payload.instruments;

  const song = await dbClient
    .insert(payload)
    .into(TABLE.SONG)
    .returning('id');
  const [{ id: song_id }] = song;

  for (const instrument of instruments) {
    const [{ id: role_id }] = await dbClient
      .select('id')
      .from(TABLE.ROLE)
      .where('instrument', instrument)

    await dbClient
      .insert({ song_id, role_id })
      .into(TABLE.SONG_ROLE);
  }

  return song_id;
}

export {
  getSongs,
  createSong,
};