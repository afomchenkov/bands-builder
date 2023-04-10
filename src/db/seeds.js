import { INSTRUMENT_ROLES, TABLE } from './constants';
import { hashPassword } from '../lib/utils';

const defaultPassword = '123456';

export const seedUsers = async (client) => {
  const password = await hashPassword(defaultPassword);

  await client(TABLE.USER).insert([
    {
      first_name: 'John',
      last_name: 'Dow',
      email: 'john.dow@gmail.com',
      username: 'john_dow',
      password,
    },
    {
      first_name: 'Michael',
      last_name: 'Jackson',
      email: 'michael.jacksondow@gmail.com',
      username: 'michael_jackson',
      password,
    },
    {
      first_name: 'Max',
      last_name: 'Mustermann',
      email: 'max.mustermann@gmail.com',
      username: 'max_mustermann',
      password,
    },
  ]);
}

export const seedRoles = async (client) => {
  await client(TABLE.ROLE).insert(INSTRUMENT_ROLES.map(instrument => ({
    instrument,
  })));
}

export const seedUserRoles = async (client) => {
  await client(TABLE.USER_ROLE).insert([
    {
      user_id: 1,
      role_id: 4,
    },
    {
      user_id: 1,
      role_id: 1,
    },
    {
      user_id: 1,
      role_id: 11,
    },
    {
      user_id: 1,
      role_id: 7,
    },
    {
      user_id: 2,
      role_id: 14,
    },
    {
      user_id: 2,
      role_id: 1,
    },
    {
      user_id: 2,
      role_id: 18,
    },
    {
      user_id: 2,
      role_id: 16,
    },
    {
      user_id: 2,
      role_id: 6,
    },
    {
      user_id: 3,
      role_id: 1,
    },
    {
      user_id: 3,
      role_id: 2,
    },
  ]);
}

export const seedSongs = async (client) => {
  await client(TABLE.SONG).insert([
    {
      title: 'Banjo',
      band: 'Leonard Cohen',
      album: 'Old Ideas',
      album_year: 2012,
      description: `An evil banjo stalks Cohen in this folk-bluesy meditation of surrender. "There's a broken banjo bobbing on a dark infested sea," he croons. During a press preview of Old Ideas in London (as reported by The Sun) Cohen was asked if the broken banjo was something he had actually seen? "I don't know whether I actually saw it. I certainly imagined it," replied the poet-singer, before acknowledging that there's something "hilarious" about the bobbing banjo even in this dark and dangerous setting.`,
    },
    {
      title: 'Mandolin Wind',
      band: 'Rod Stewart',
      album: 'Every Picture Tells a Story',
      album_year: 1971,
      description: `Rod Stewart composed and sang this ballad, which was sung from the point of view of an aging farmer husband. The song is a tribute to his loyal wife who stays by his side during a horrendous winter on the farm.
      Ray Jackson of the British folk/rock group Lindisfarne played the mandolin on this track. Stewart forgot Jackson's name and referred to him as "the mandolin player in Lindisfarne" on the sleeve credits.
      This was the only track on Every Picture Tells a Story, that Stewart composed by himself. He also penned the title track with Ronnie Wood.`,
    },
    {
      title: 'Hey Jude',
      band: 'The Beatles',
      album: 'Past Masters, Vol. 2',
      album_year: 1968,
      description: `Paul McCartney wrote this as "Hey Jules," a song meant to comfort John Lennon's 5-year-old son Julian as his parents were getting a divorce. The change to "Jude" was inspired by the character "Jud" in the musical Oklahoma! (McCartney loves show tunes)
      In 1987 Julian ran into Paul in New York City when they were staying at the same hotel and he finally heard Paul tell him the story of the song firsthand. He admitted to Paul that growing up, he'd always felt closer to him than to his own father. In Steve Turner's book The Stories Behind Every Beatles Song, Julian said: "Paul told me he'd been thinking about my circumstances, about what I was going through and what I'd have to go through. Paul and I used to hang out quite a bit - more than Dad and I did... There seem to be far more pictures of me and Paul playing at that age than me and Dad. I've never really wanted to know the truth of how Dad was and how he was with me. There was some very negative stuff - like when he said that I'd come out of a whisky bottle on a Saturday night. That's tough to deal with. You think, where's the love in that? It surprises me whenever I hear the song. It's strange to think someone has written a song about you. It still touches me."`,
    },
    {
      title: 'Love Bites',
      band: 'Def Leppard',
      album: 'Hysteria',
      album_year: 1987,
      description: `This was the fifth single released from the Hysteria album in the US. The album came out in August 1987, and the first single, "Women," stalled at #80 in September. "Animal" made #19 in December, the title track reached #10 in March 1988, and "Pour Some Sugar On Me" got Leppard fans through the summer, peaking at #2 in July. You might think listeners would be fatigued at this point, but clearly there was still an appetite, as "Love Bites" reached #1 in October 1988, giving the group their only chart-topper.
      Remarkably, they squeezed two more singles out of the album: "Armageddon It" (#3, January 1989) and "Rocket" (#12, April 1989).`,
    },
    {
      title: 'The Sting',
      band: 'Gabriella Cilmi',
      album: 'The Sting',
      album_year: 2013,
      description: `This sultry, string-backed tune is the title track of Gabriella Cilmi's third album. Cilmi explained the song's meaning: 'It's about karma," she said, "I think the more we try to run away from trouble, the more we find it."
      "I love the string arrangement in this tune," she added, "it adds to the drama- I guess the production is inspired by Danger Mouse, I think he's a genius."`,
    },
    {
      title: 'Come Out And Play',
      band: 'The Offspring',
      album: 'Smash',
      album_year: 1994,
      description: `This song is about gang and gun violence in schools, and was the breakthrough hit for The Offspring. In a Rolling Stone interview, lead singer Dexter Holland recalled writing the song: "Back then I was a grad student and I was commuting to school everyday in a s--tty car, driving through East LA Gangland central. I was there the day of the LA riots. So I was very aware of that part of the world, and a lot of that gun stuff came out in songs like 'Come Out And Play.' But there was also some humor to it, like with 'Bad Habit.' There was a lot of freeway violence and road-rage at that time. And my car was so s--tty that people used to literally throw things at me on the freeway because I wasn't going fast enough. So I decided to write a song about it."`,
    },
    {
      title: 'Go Away Little Girl',
      band: 'Steve Lawrence',
      album: 'Greatest Hits',
      album_year: 1962,
      description: `Steve Lawrence, better known as one-half of an act billed as "Steve and Eydie" with his wife Eydie Gorme, had a respectable career with several charting hits from 1957 to 1964. He even shared a stage with the likes of Carol Burnett and Julie Andrews, and also had an acting career. And finally, he won awards including one Tony, two Emmys, and a New York Drama Critics' Circle. So why isn't he better known today? Because of this song. You can track the story through the charts: he was hitting in the Top 10 consistently, then this song became his #1, and after that, he would only chart in the mid-20s and 30s.
      A negative article in the New York Times sparked a controversy, where a columnist believed the song was referring to an under age girl and derided it as "sick." Songwriter Gerry Goffin even had Times reporters coming to him with sneers asking, "So you like to molest little girls, eh?" A similar controversy would break out over the song "Young Girl" in 1968, which just goes to show that moral guardians continue to have far dirtier minds than the songwriters they're supposed to be protecting us from.`,
    },
    {
      title: 'Chains',
      band: 'The Cookies',
      album: 'Dimension Dolls, Volume 1',
      album_year: 1962,
      description: `In his book Backstage Passes and Backstabbing Bastards, Al Kooper cites this as an example of how many songs attributed to the "Brill Building sound" actually came from the building at 1650 Broadway: "Aldon Music, the hottest song-publishing concern of the early sixties and perhaps of all time, dominated 1950's action. Ironically, as I mentioned before, much of what today is called 'the Brill Building sound' actually originated at 1650 right in Aldon's offices!... In 1962, Carole King, Gerry Goffin, Barry Mann, Cynthia Weil, Neil Sedaka, Howie Greenfield, Helen Miller, and numerous others competed for space at Aldon's piano to compose the hits that would monopolize the airwaves. Even the Beatles recorded Aldon songs when they first started out."`,
    },
  ]);
}

export const seedSongRoles = async (client) => {
  await client(TABLE.SONG_ROLE).insert([
    {
      song_id: 1,
      role_id: 4,
    },
    {
      song_id: 1,
      role_id: 6,
    },
    {
      song_id: 1,
      role_id: 14,
    },
    {
      song_id: 1,
      role_id: 12,
    },
    {
      song_id: 1,
      role_id: 8,
    },
    {
      song_id: 1,
      role_id: 9,
    },
    {
      song_id: 2,
      role_id: 4,
    },
    {
      song_id: 2,
      role_id: 1,
    },
    {
      song_id: 2,
      role_id: 2,
    },
    {
      song_id: 2,
      role_id: 7,
    },
    {
      song_id: 2,
      role_id: 11,
    },
    {
      song_id: 2,
      role_id: 12,
    },
    {
      song_id: 3,
      role_id: 7,
    },
    {
      song_id: 3,
      role_id: 13,
    },
    {
      song_id: 3,
      role_id: 18,
    },
    {
      song_id: 3,
      role_id: 8,
    },
    {
      song_id: 3,
      role_id: 2,
    },
    {
      song_id: 4,
      role_id: 9,
    },
    {
      song_id: 4,
      role_id: 10,
    },
    {
      song_id: 4,
      role_id: 8,
    },
    {
      song_id: 4,
      role_id: 6,
    },
    {
      song_id: 4,
      role_id: 7,
    },
    {
      song_id: 4,
      role_id: 1,
    },
    {
      song_id: 5,
      role_id: 3,
    },
    {
      song_id: 5,
      role_id: 17,
    },
    {
      song_id: 5,
      role_id: 5,
    },
    {
      song_id: 5,
      role_id: 11,
    },
    {
      song_id: 5,
      role_id: 10,
    },
    {
      song_id: 5,
      role_id: 16,
    },
    {
      song_id: 6,
      role_id: 17,
    },
    {
      song_id: 6,
      role_id: 6,
    },
    {
      song_id: 6,
      role_id: 1,
    },
    {
      song_id: 6,
      role_id: 14,
    },
    {
      song_id: 7,
      role_id: 11,
    },
    {
      song_id: 7,
      role_id: 6,
    },
    {
      song_id: 7,
      role_id: 14,
    },
    {
      song_id: 8,
      role_id: 14,
    },
    {
      song_id: 8,
      role_id: 2,
    },
    {
      song_id: 8,
      role_id: 16,
    },
  ]);
}
