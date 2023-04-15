export class Jam {
  constructor(rawData) {
    this.rawData = rawData;
  }

  static fromDto(jsonData) {
    return new Jam(jsonData);
  }

  toDto() {
    const filled_roles = this.rawData.filled_roles.split(',');
    const available_roles = this.rawData.all_roles.filter(role => !filled_roles.includes(role))

    return {
      id: this.rawData.id,
      created_at: this.rawData.created_at,
      description: this.rawData.description,
      started: !!this.rawData.started,
      finished: !!this.rawData.finished,
      author: {
        username: this.rawData.user_username,
      },
      song: {
        title: this.rawData.song_title,
        band: this.rawData.song_band,
        album: this.rawData.song_album,
        album_year: this.rawData.song_album_year,
        description: this.rawData.song_description,
      },
      available_roles,
      filled_roles,
    };
  }
}
