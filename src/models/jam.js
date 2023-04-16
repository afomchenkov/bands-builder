export class Jam {
  constructor(rawData) {
    this.rawData = rawData;
  }

  static fromDto(jsonData) {
    return new Jam(jsonData);
  }

  toDto() {
    const assignments = this.rawData.assignments.map(assignment => {
      const { assignment_instrument, assignment_username } = assignment;

      return {
        instrument: assignment_instrument,
        username: assignment_username,
      };
    });
    const available_roles = this.rawData.instruments.filter(instrument => {
      return !assignments.some(assignment => assignment.instrument === instrument);
    });

    return {
      id: this.rawData.id,
      created_at: this.rawData.created_at,
      description: this.rawData.description,
      started: !!this.rawData.started,
      finished: !!this.rawData.finished,
      assignments,
      author: {
        username: this.rawData.author_username,
      },
      song: {
        title: this.rawData.song_title,
        band: this.rawData.song_band,
        album: this.rawData.song_album,
        album_year: this.rawData.song_album_year,
        description: this.rawData.song_description,
      },
      available_roles,
    };
  }
}
