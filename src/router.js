import { AsyncRouter } from 'express-async-router';
import { check, validationResult, matchedData, param } from 'express-validator';
import { getRoles } from './controllers/role.controller';
import { getSongs, createSong } from './controllers/song.controller';
import { createUser, getUserById } from './controllers/user.controller';
import { getJams, getJam, joinJam } from './controllers/jam.controller';
import { INSTRUMENT_ROLES } from './db/constants';
import { Jam } from './models/jam';

const router = AsyncRouter();

// A user can create profile and choose band role (instrument) - create user
router.post('/users',
  [
    check('first_name').isLength({ min: 2, max: 100 }).bail(),
    check('last_name').isLength({ min: 2, max: 100 }).bail(),
    check('email').isEmail(),
    check('username').isLength({ min: 2, max: 100 }),
    check('instruments')
      .notEmpty()
      .isArray()
      .custom(async instruments => {
        const valid = instruments.every((role) => INSTRUMENT_ROLES.includes(role));
        return valid ? Promise.resolve(true) : Promise.reject();
      }).withMessage('Unsupported instrument has been specified.'),
    check('password').isString(),
    check('password', '...').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const requiredPayload = matchedData(req, { includeOptionals: true });
    const { body } = req;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    for (const prop of Object.keys(body)) {
      if (!(prop in requiredPayload)) {
        return res.status(400).json({
          errors: [
            `Extra property is not allowed: '${prop}'`
          ]
        });
      }
    }

    try {
      const userId = await createUser(body);
      return res.status(200).json(userId);
    } catch (error) {
      return res.status(404).end();
    }
  }
);

// fetch user
router.get('/users/:userId',
  param('userId').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    const { userId } = req.params;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await getUserById(userId);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).end();
    }
  }
);

// fetch available roles/instruments
router.get('/roles', async (_, res) => {
  const roles = await getRoles();
  return res.status(200).json(roles);
});

// A user can browse existing songs - fetch available songs
router.get('/songs', async (_, res) => {
  const songs = await getSongs();
  return res.status(200).json(songs);
});

// create new song
router.post('/songs',
  [
    check('title').isLength({ min: 2, max: 100 }).bail(),
    check('band').isLength({ min: 2, max: 100 }).bail(),
    check('instruments')
      .notEmpty()
      .isArray()
      .custom(async instruments => {
        const valid = instruments.every((role) => INSTRUMENT_ROLES.includes(role));
        return valid ? Promise.resolve(true) : Promise.reject();
      }).withMessage('Unsupported instrument has been specified.'),
    check('album').isString().optional(),
    check('album_year').isInt({ gt: 1900 }).optional(),
    check('description').isString().optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const requiredPayload = matchedData(req, { includeOptionals: true });
    const { body } = req;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    for (const prop of Object.keys(body)) {
      if (!(prop in requiredPayload)) {
        return res.status(400).json({
          errors: [
            `Extra property is not allowed: '${prop}'`
          ]
        });
      }
    }

    const songId = await createSong(body);

    return res.status(201).json(songId);
  }
)

// fetch available jams
router.get('/jams', async (_, res) => {
  const jams = await getJams();
  return res.status(200).json(jams.map(jam => new Jam(jam).toDto()));
});

// fetch specific jam
router.get('/jams/:jamId',
  param('jamId').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    const { jamId } = req.params;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const jam = await getJam(jamId);
      return res.status(200).json(new Jam(jam).toDto());
    } catch (error) {
      return res.status(404).end();
    }
  }
);

// join jam
router.put('/jams/:jamId',
  param('jamId').isInt(),
  check('instrument').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    const { jamId } = req.params;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { body: { instrument } } = req;

      // check via helper utils if user is eligible to join
      const jam = await joinJam(jamId, instrument);
      return res.status(200).json(jam);
    } catch (error) {
      return res.status(404).end();
    }
  }
);

// TODO:
// A user (host) can create a public jam based on a song
// post.jam(validate)

// A user (host) can start created jam when all song roles have assigned performers
// get.jam() - check if all roles filled and it can be started
// put.jam - start jam if all conditions met

// A user can be notified when jam starts
// trigger notification send on jam start

export default router;
