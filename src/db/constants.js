export const INSTRUMENT_ROLES = [
  'guitar', 'piano', 'violin', 'drums', 'flute',
  'cello', 'trumpet', 'clarinet', 'accordion',
  'harmonica', 'mandolin', 'tuba', 'viola',
  'bag pipes', 'lute', 'bell', 'saxophone', 'banjo'
];

export const TABLE = Object.freeze({
  ROLE: 'role',
  USER: 'user',
  SONG: 'song',
  USER_ROLE: 'user_role',
  SONG_ROLE: 'song_role',
  JAM: 'jam',
  JAM_USER: 'jam_user', // assigned users to jam
  JAM_ROLE: 'jam_role', // filled roles/instruments in a jam
});
