export const genreMapPart1 = {
  rap: {
    underground: {
      artists: ['Playboi Carti', 'Ken Carson', 'Destroy Lonely', 'UnoTheActivist', 'Yeat', 'Nettspend', 'Feng', 'Fakemink', 'evilgiane', 'Benji Blue Bills', 'Lazer Dim 700', 'Lancey Foux', 'Summrs', 'Autumn!', 'Kasher Quon'],
      keywords: ['underground rap', 'trap', 'cloud rap', 'experimental hip hop', 'opium', 'surf gang', 'soundcloud', 'soundcloud rap', 'rage', 'hyperpop rap', 'plugg', 'drain'],
      audioFeatures: {
        tempo: { min: 130, max: 180, avg: 155 },
        danceability: { min: 0.6, max: 0.9, avg: 0.75 },
        energy: { min: 0.7, max: 0.95, avg: 0.82 },
        valence: { min: 0.3, max: 0.7, avg: 0.5 },
        acousticness: { min: 0.0, max: 0.3, avg: 0.1 },
        instrumentalness: { min: 0.0, max: 0.4, avg: 0.15 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.4, max: 0.8, avg: 0.6 },
        loudness: { min: -8, max: -3, avg: -5.5 }
      }
    },
    britishUnderground: {
      artists: ['Feng', 'Fakemink', 'Lancey Foux', 'Central Cee', 'Unknown T', 'Headie One', 'AJ Tracey', 'slowthai', 'Dave', 'Little Simz'],
      keywords: ['british underground rap', 'british underground', 'uk rap', 'uk underground', 'uk drill', 'grime', 'british hip hop'],
      audioFeatures: {
        tempo: { min: 140, max: 160, avg: 150 },
        danceability: { min: 0.65, max: 0.85, avg: 0.75 },
        energy: { min: 0.75, max: 0.9, avg: 0.82 },
        valence: { min: 0.2, max: 0.6, avg: 0.4 },
        acousticness: { min: 0.0, max: 0.2, avg: 0.08 },
        instrumentalness: { min: 0.0, max: 0.3, avg: 0.12 },
        liveness: { min: 0.08, max: 0.25, avg: 0.15 },
        speechiness: { min: 0.45, max: 0.75, avg: 0.6 },
        loudness: { min: -7, max: -4, avg: -5.5 }
      }
    },
    drill: {
      artists: ['Pop Smoke', 'Fivio Foreign', 'King Von', 'Lil Durk', 'Chief Keef', 'Polo G', 'Central Cee', 'Headie One', 'Unknown T'],
      keywords: ['drill', 'uk drill', 'chicago drill', 'ny drill', 'brooklyn drill', 'sliding'],
      audioFeatures: {
        tempo: { min: 130, max: 150, avg: 140 },
        danceability: { min: 0.7, max: 0.9, avg: 0.8 },
        energy: { min: 0.8, max: 0.95, avg: 0.87 },
        valence: { min: 0.1, max: 0.4, avg: 0.25 },
        acousticness: { min: 0.0, max: 0.15, avg: 0.05 },
        instrumentalness: { min: 0.0, max: 0.25, avg: 0.08 },
        liveness: { min: 0.05, max: 0.2, avg: 0.12 },
        speechiness: { min: 0.5, max: 0.8, avg: 0.65 },
        loudness: { min: -6, max: -3, avg: -4.5 }
      }
    },
    oldschool: {
      artists: ['Nas', 'Jay-Z', 'The Notorious B.I.G.', 'Tupac', 'Wu-Tang Clan', 'A Tribe Called Quest', 'De La Soul', 'Gang Starr', 'Public Enemy'],
      keywords: ['old school hip hop', '90s hip hop', 'boom bap', 'east coast hip hop', 'west coast hip hop', 'golden age hip hop', 'conscious rap'],
      audioFeatures: {
        tempo: { min: 85, max: 120, avg: 95 },
        danceability: { min: 0.6, max: 0.8, avg: 0.7 },
        energy: { min: 0.6, max: 0.85, avg: 0.72 },
        valence: { min: 0.3, max: 0.7, avg: 0.5 },
        acousticness: { min: 0.05, max: 0.4, avg: 0.15 },
        instrumentalness: { min: 0.0, max: 0.3, avg: 0.1 },
        liveness: { min: 0.08, max: 0.3, avg: 0.18 },
        speechiness: { min: 0.6, max: 0.9, avg: 0.75 },
        loudness: { min: -10, max: -5, avg: -7.5 }
      }
    },
    trap: {
      artists: ['Future', 'Young Thug', 'Lil Uzi Vert', 'Gunna', 'Lil Baby', 'Travis Scott', '21 Savage', 'Metro Boomin', 'Southside'],
      keywords: ['trap', 'atlanta trap', 'melodic trap', 'hard trap', 'trap metal', 'mumble rap'],
      audioFeatures: {
        tempo: { min: 130, max: 170, avg: 145 },
        danceability: { min: 0.65, max: 0.9, avg: 0.77 },
        energy: { min: 0.7, max: 0.95, avg: 0.82 },
        valence: { min: 0.2, max: 0.7, avg: 0.45 },
        acousticness: { min: 0.0, max: 0.2, avg: 0.08 },
        instrumentalness: { min: 0.0, max: 0.4, avg: 0.15 },
        liveness: { min: 0.05, max: 0.25, avg: 0.12 },
        speechiness: { min: 0.4, max: 0.8, avg: 0.6 },
        loudness: { min: -8, max: -3, avg: -5 }
      }
    },
    mainstream: {
      artists: ['Drake', 'Kendrick Lamar', 'Travis Scott', 'J. Cole', 'Post Malone', 'Eminem', 'Kanye West', 'Tyler, The Creator'],
      keywords: ['hip hop', 'rap', 'mainstream rap', 'pop rap', 'commercial hip hop'],
      audioFeatures: {
        tempo: { min: 70, max: 150, avg: 120 },
        danceability: { min: 0.6, max: 0.9, avg: 0.75 },
        energy: { min: 0.5, max: 0.9, avg: 0.7 },
        valence: { min: 0.3, max: 0.8, avg: 0.55 },
        acousticness: { min: 0.0, max: 0.3, avg: 0.1 },
        instrumentalness: { min: 0.0, max: 0.2, avg: 0.05 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.4, max: 0.8, avg: 0.6 },
        loudness: { min: -10, max: -4, avg: -6 }
      }
    }
  },

  house: {
    aussietronica: {
      artists: ['Mall Grab', 'DJ Boring', 'False Persona', 'Kettama', 'Skin on Skin', 'X Club.', 'Flansie', 'Interplanetary Criminal', 'Harvey Sutherland', 'Sleep D'],
      keywords: ['aussietronica', 'lo-fi house', 'melbourne bounce', 'deep house', 'speed house', 'bouncy', 'australian house'],
      audioFeatures: {
        tempo: { min: 120, max: 128, avg: 124 },
        danceability: { min: 0.75, max: 0.95, avg: 0.85 },
        energy: { min: 0.6, max: 0.85, avg: 0.72 },
        valence: { min: 0.4, max: 0.8, avg: 0.6 },
        acousticness: { min: 0.0, max: 0.2, avg: 0.05 },
        instrumentalness: { min: 0.5, max: 0.95, avg: 0.8 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.03, max: 0.15, avg: 0.08 },
        loudness: { min: -12, max: -6, avg: -8 }
      }
    },
    garage: {
      artists: ['Interplanetary Criminal','Nia Archives', '4am Kru', 'Main Phase', 'Bakey', 'Conducta', 'Logic1000', 'Todd Edwards', 'MJ Cole', 'Artful Dodger'],
      keywords: ['garage house', 'uk garage', '2 step', 'speed garage', 'garage', 'ukg', 'future garage', 'bassline'],
      audioFeatures: {
        tempo: { min: 130, max: 140, avg: 135 },
        danceability: { min: 0.7, max: 0.95, avg: 0.85 },
        energy: { min: 0.65, max: 0.9, avg: 0.77 },
        valence: { min: 0.4, max: 0.85, avg: 0.65 },
        acousticness: { min: 0.0, max: 0.15, avg: 0.05 },
        instrumentalness: { min: 0.2, max: 0.9, avg: 0.6 },
        liveness: { min: 0.05, max: 0.25, avg: 0.12 },
        speechiness: { min: 0.03, max: 0.3, avg: 0.15 },
        loudness: { min: -10, max: -5, avg: -7 }
      }
    },
    classic: {
      artists: ['Frankie Knuckles', 'Larry Heard', 'Marshall Jefferson', 'Joe Smooth', 'Fingers Inc.', 'Ten City'],
      keywords: ['classic house', 'chicago house', 'deep house', 'acid house', 'warehouse house'],
      audioFeatures: {
        tempo: { min: 118, max: 130, avg: 124 },
        danceability: { min: 0.7, max: 0.9, avg: 0.8 },
        energy: { min: 0.6, max: 0.85, avg: 0.72 },
        valence: { min: 0.5, max: 0.8, avg: 0.65 },
        acousticness: { min: 0.0, max: 0.25, avg: 0.08 },
        instrumentalness: { min: 0.4, max: 0.95, avg: 0.75 },
        liveness: { min: 0.08, max: 0.4, avg: 0.2 },
        speechiness: { min: 0.03, max: 0.2, avg: 0.1 },
        loudness: { min: -15, max: -8, avg: -10 }
      }
    },
    tech: {
      artists: ['Carl Cox', 'Richie Hawtin', 'Adam Beyer', 'Charlotte de Witte', 'Amelie Lens', 'Nina Kraviz', 'Maceo Plex'],
      keywords: ['tech house', 'techno house', 'minimal tech house', 'hard tech house', 'driving house'],
      audioFeatures: {
        tempo: { min: 125, max: 135, avg: 128 },
        danceability: { min: 0.65, max: 0.9, avg: 0.77 },
        energy: { min: 0.7, max: 0.95, avg: 0.82 },
        valence: { min: 0.3, max: 0.7, avg: 0.5 },
        acousticness: { min: 0.0, max: 0.1, avg: 0.03 },
        instrumentalness: { min: 0.7, max: 0.98, avg: 0.9 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.03, max: 0.1, avg: 0.05 },
        loudness: { min: -8, max: -4, avg: -6 }
      }
    }
  },

  techno: {
    detroit: {
      artists: ['Juan Atkins', 'Derrick May', 'Kevin Saunderson', 'Jeff Mills', 'Robert Hood', 'Underground Resistance'],
      keywords: ['detroit techno', 'classic techno', 'motor city techno', 'minimal techno', 'dub techno'],
      audioFeatures: {
        tempo: { min: 125, max: 135, avg: 130 },
        danceability: { min: 0.6, max: 0.85, avg: 0.72 },
        energy: { min: 0.75, max: 0.95, avg: 0.85 },
        valence: { min: 0.2, max: 0.6, avg: 0.4 },
        acousticness: { min: 0.0, max: 0.1, avg: 0.03 },
        instrumentalness: { min: 0.8, max: 0.98, avg: 0.92 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.03, max: 0.08, avg: 0.05 },
        loudness: { min: -10, max: -5, avg: -7 }
      }
    },
    berlin: {
      artists: ['Ben Klock', 'Marcel Dettmann', 'Paula Temple', 'I Hate Models', 'Kobosil', 'Klangkuenstler'],
      keywords: ['berlin techno', 'industrial techno', 'hard techno', 'raw techno', 'berghain', 'warehouse techno'],
      audioFeatures: {
        tempo: { min: 130, max: 145, avg: 135 },
        danceability: { min: 0.55, max: 0.8, avg: 0.67 },
        energy: { min: 0.8, max: 0.98, avg: 0.9 },
        valence: { min: 0.1, max: 0.4, avg: 0.25 },
        acousticness: { min: 0.0, max: 0.05, avg: 0.02 },
        instrumentalness: { min: 0.85, max: 0.98, avg: 0.95 },
        liveness: { min: 0.08, max: 0.4, avg: 0.2 },
        speechiness: { min: 0.03, max: 0.06, avg: 0.04 },
        loudness: { min: -6, max: -2, avg: -4 }
      }
    }
  },

  electronic: {
    dubstep: {
      artists: ['Skrillex', 'Zomboy', 'Virtual Riot', 'Subtronics', 'SVDDEN DEATH', 'Borgore', 'Must Die!'],
      keywords: ['dubstep', 'riddim', 'melodic dubstep', 'heavy dubstep', 'hybrid trap', 'color bass', 'future riddim'],
      audioFeatures: {
        tempo: { min: 140, max: 150, avg: 145 },
        danceability: { min: 0.4, max: 0.8, avg: 0.6 },
        energy: { min: 0.8, max: 0.98, avg: 0.9 },
        valence: { min: 0.2, max: 0.7, avg: 0.45 },
        acousticness: { min: 0.0, max: 0.05, avg: 0.02 },
        instrumentalness: { min: 0.6, max: 0.95, avg: 0.85 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.03, max: 0.15, avg: 0.08 },
        loudness: { min: -4, max: -1, avg: -2.5 }
      }
    },
    dnb: {
      artists: ['Netsky', 'Sub Focus', 'Pendulum', 'LTJ Bukem', 'Goldie', 'Roni Size', 'Chase & Status'],
      keywords: ['drum and bass', 'dnb', 'liquid dnb', 'neurofunk', 'jungle', 'jump up', 'hardcore breaks'],
      audioFeatures: {
        tempo: { min: 165, max: 180, avg: 174 },
        danceability: { min: 0.5, max: 0.85, avg: 0.67 },
        energy: { min: 0.75, max: 0.95, avg: 0.85 },
        valence: { min: 0.3, max: 0.8, avg: 0.55 },
        acousticness: { min: 0.0, max: 0.1, avg: 0.03 },
        instrumentalness: { min: 0.4, max: 0.9, avg: 0.7 },
        liveness: { min: 0.05, max: 0.4, avg: 0.2 },
        speechiness: { min: 0.03, max: 0.2, avg: 0.1 },
        loudness: { min: -8, max: -3, avg: -5 }
      }
    },
    ambient: {
      artists: ['Brian Eno', 'Tim Hecker', 'Stars of the Lid', 'William Basinski', 'Grouper', 'Loscil'],
      keywords: ['ambient', 'drone', 'dark ambient', 'field recording', 'microsound', 'lowercase', 'soundscape'],
      audioFeatures: {
        tempo: { min: 60, max: 120, avg: 85 },
        danceability: { min: 0.1, max: 0.5, avg: 0.3 },
        energy: { min: 0.1, max: 0.6, avg: 0.3 },
        valence: { min: 0.1, max: 0.7, avg: 0.4 },
        acousticness: { min: 0.2, max: 0.9, avg: 0.6 },
        instrumentalness: { min: 0.8, max: 0.98, avg: 0.95 },
        liveness: { min: 0.05, max: 0.6, avg: 0.25 },
        speechiness: { min: 0.03, max: 0.08, avg: 0.05 },
        loudness: { min: -25, max: -10, avg: -18 }
      }
    }
  },
    rock: {
    alternative: {
      artists: ['Nirvana', 'Radiohead', 'Pearl Jam', 'Soundgarden', 'Alice in Chains', 'Stone Temple Pilots', 'Smashing Pumpkins'],
      keywords: ['alternative rock', 'grunge', 'indie rock', 'alt rock', '90s alternative', 'college rock'],
      audioFeatures: {
        tempo: { min: 90, max: 140, avg: 115 },
        danceability: { min: 0.3, max: 0.7, avg: 0.5 },
        energy: { min: 0.6, max: 0.95, avg: 0.78 },
        valence: { min: 0.2, max: 0.7, avg: 0.45 },
        acousticness: { min: 0.0, max: 0.4, avg: 0.15 },
        instrumentalness: { min: 0.0, max: 0.3, avg: 0.08 },
        liveness: { min: 0.08, max: 0.5, avg: 0.25 },
        speechiness: { min: 0.03, max: 0.15, avg: 0.08 },
        loudness: { min: -12, max: -4, avg: -7 }
      }
    },
    indie: {
      artists: ['Arctic Monkeys', 'The Strokes', 'Interpol', 'Yeah Yeah Yeahs', 'LCD Soundsystem', 'Vampire Weekend', 'Tame Impala'],
      keywords: ['indie rock', 'indie pop', 'garage rock revival', 'post punk revival', 'art rock', 'dream pop'],
      audioFeatures: {
        tempo: { min: 100, max: 160, avg: 130 },
        danceability: { min: 0.4, max: 0.8, avg: 0.6 },
        energy: { min: 0.5, max: 0.9, avg: 0.7 },
        valence: { min: 0.3, max: 0.8, avg: 0.55 },
        acousticness: { min: 0.0, max: 0.5, avg: 0.2 },
        instrumentalness: { min: 0.0, max: 0.4, avg: 0.15 },
        liveness: { min: 0.08, max: 0.4, avg: 0.2 },
        speechiness: { min: 0.03, max: 0.12, avg: 0.07 },
        loudness: { min: -14, max: -6, avg: -9 }
      }
    },
    punk: {
      artists: ['The Clash', 'Sex Pistols', 'Ramones', 'Dead Kennedys', 'Black Flag', 'Minor Threat', 'Bad Brains'],
      keywords: ['punk rock', 'hardcore punk', 'post punk', 'pop punk', 'street punk', 'anarcho punk'],
      audioFeatures: {
        tempo: { min: 150, max: 200, avg: 175 },
        danceability: { min: 0.4, max: 0.75, avg: 0.57 },
        energy: { min: 0.8, max: 0.98, avg: 0.9 },
        valence: { min: 0.3, max: 0.8, avg: 0.55 },
        acousticness: { min: 0.0, max: 0.2, avg: 0.05 },
        instrumentalness: { min: 0.0, max: 0.1, avg: 0.03 },
        liveness: { min: 0.1, max: 0.6, avg: 0.3 },
        speechiness: { min: 0.05, max: 0.25, avg: 0.12 },
        loudness: { min: -8, max: -3, avg: -5 }
      }
    },
    metal: {
      artists: ['Black Sabbath', 'Iron Maiden', 'Metallica', 'Judas Priest', 'Slayer', 'Pantera', 'Tool'],
      keywords: ['heavy metal', 'thrash metal', 'death metal', 'black metal', 'doom metal', 'progressive metal'],
      audioFeatures: {
        tempo: { min: 80, max: 180, avg: 130 },
        danceability: { min: 0.2, max: 0.6, avg: 0.4 },
        energy: { min: 0.7, max: 0.98, avg: 0.85 },
        valence: { min: 0.1, max: 0.6, avg: 0.35 },
        acousticness: { min: 0.0, max: 0.15, avg: 0.05 },
        instrumentalness: { min: 0.05, max: 0.6, avg: 0.25 },
        liveness: { min: 0.08, max: 0.5, avg: 0.25 },
        speechiness: { min: 0.03, max: 0.2, avg: 0.08 },
        loudness: { min: -8, max: -2, avg: -4 }
      }
    }
  },

  pop: {
    mainstream: {
      artists: ['Taylor Swift', 'Ariana Grande', 'Billie Eilish', 'Dua Lipa', 'The Weeknd', 'Harry Styles', 'Olivia Rodrigo'],
      keywords: ['pop', 'mainstream pop', 'dance pop', 'electropop', 'teen pop', 'contemporary pop'],
      audioFeatures: {
        tempo: { min: 90, max: 130, avg: 110 },
        danceability: { min: 0.5, max: 0.9, avg: 0.7 },
        energy: { min: 0.4, max: 0.9, avg: 0.65 },
        valence: { min: 0.3, max: 0.9, avg: 0.6 },
        acousticness: { min: 0.0, max: 0.4, avg: 0.15 },
        instrumentalness: { min: 0.0, max: 0.1, avg: 0.02 },
        liveness: { min: 0.05, max: 0.3, avg: 0.12 },
        speechiness: { min: 0.03, max: 0.2, avg: 0.08 },
        loudness: { min: -12, max: -4, avg: -7 }
      }
    },
    indie: {
      artists: ['Lana Del Rey', 'Phoebe Bridgers', 'Clairo', 'Rex Orange County', 'Mac DeMarco', 'Beach House', 'MGMT'],
      keywords: ['indie pop', 'bedroom pop', 'dream pop', 'art pop', 'chamber pop', 'lo-fi pop'],
      audioFeatures: {
        tempo: { min: 80, max: 140, avg: 110 },
        danceability: { min: 0.4, max: 0.8, avg: 0.6 },
        energy: { min: 0.3, max: 0.8, avg: 0.55 },
        valence: { min: 0.2, max: 0.8, avg: 0.5 },
        acousticness: { min: 0.1, max: 0.7, avg: 0.4 },
        instrumentalness: { min: 0.0, max: 0.3, avg: 0.1 },
        liveness: { min: 0.05, max: 0.4, avg: 0.18 },
        speechiness: { min: 0.03, max: 0.15, avg: 0.07 },
        loudness: { min: -18, max: -8, avg: -12 }
      }
    },
    hyperpop: {
      artists: ['100 gecs', 'SOPHIE', 'Charli XCX', 'Dorian Electra', 'Machine Girl', 'Death Grips', 'clipping.'],
      keywords: ['hyperpop', 'experimental pop', 'glitchcore', 'digicore', 'breakcore pop', 'pc music'],
      audioFeatures: {
        tempo: { min: 120, max: 200, avg: 160 },
        danceability: { min: 0.5, max: 0.9, avg: 0.7 },
        energy: { min: 0.7, max: 0.98, avg: 0.85 },
        valence: { min: 0.3, max: 0.9, avg: 0.6 },
        acousticness: { min: 0.0, max: 0.1, avg: 0.03 },
        instrumentalness: { min: 0.0, max: 0.4, avg: 0.15 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.05, max: 0.4, avg: 0.2 },
        loudness: { min: -6, max: -1, avg: -3 }
      }
    }
  },
  rnb: {
    contemporary: {
      artists: ['The Weeknd', 'Frank Ocean', 'SZA', 'Daniel Caesar', 'Summer Walker', 'H.E.R.', 'Bryson Tiller'],
      keywords: ['contemporary r&b', 'alternative r&b', 'neo soul', 'trap soul', 'pnb r&b'],
      audioFeatures: {
        tempo: { min: 70, max: 120, avg: 95 },
        danceability: { min: 0.5, max: 0.9, avg: 0.7 },
        energy: { min: 0.3, max: 0.8, avg: 0.55 },
        valence: { min: 0.2, max: 0.8, avg: 0.5 },
        acousticness: { min: 0.0, max: 0.5, avg: 0.2 },
        instrumentalness: { min: 0.0, max: 0.3, avg: 0.1 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.03, max: 0.25, avg: 0.12 },
        loudness: { min: -15, max: -6, avg: -9 }
      }
    },
    classic: {
      artists: ['Marvin Gaye', 'Stevie Wonder', 'Aretha Franklin', 'Al Green', 'Prince', 'Whitney Houston', 'Michael Jackson'],
      keywords: ['classic r&b', 'soul', 'motown', 'funk', 'disco', 'new jack swing'],
      audioFeatures: {
        tempo: { min: 90, max: 130, avg: 110 },
        danceability: { min: 0.6, max: 0.9, avg: 0.75 },
        energy: { min: 0.5, max: 0.9, avg: 0.7 },
        valence: { min: 0.4, max: 0.9, avg: 0.65 },
        acousticness: { min: 0.0, max: 0.4, avg: 0.15 },
        instrumentalness: { min: 0.0, max: 0.2, avg: 0.05 },
        liveness: { min: 0.08, max: 0.5, avg: 0.25 },
        speechiness: { min: 0.03, max: 0.2, avg: 0.1 },
        loudness: { min: -18, max: -8, avg: -12 }
      }
    }
  },

  jazz: {
    traditional: {
      artists: ['Miles Davis', 'John Coltrane', 'Duke Ellington', 'Charlie Parker', 'Thelonious Monk', 'Bill Evans'],
      keywords: ['traditional jazz', 'bebop', 'cool jazz', 'hard bop', 'modal jazz', 'swing'],
      audioFeatures: {
        tempo: { min: 80, max: 180, avg: 130 },
        danceability: { min: 0.4, max: 0.8, avg: 0.6 },
        energy: { min: 0.4, max: 0.8, avg: 0.6 },
        valence: { min: 0.3, max: 0.8, avg: 0.55 },
        acousticness: { min: 0.3, max: 0.9, avg: 0.6 },
        instrumentalness: { min: 0.6, max: 0.95, avg: 0.8 },
        liveness: { min: 0.1, max: 0.7, avg: 0.4 },
        speechiness: { min: 0.03, max: 0.1, avg: 0.06 },
        loudness: { min: -20, max: -8, avg: -14 }
      }
    },
    fusion: {
      artists: ['Weather Report', 'Mahavishnu Orchestra', 'Return to Forever', 'Chick Corea', 'Herbie Hancock'],
      keywords: ['jazz fusion', 'smooth jazz', 'contemporary jazz', 'acid jazz', 'nu jazz'],
      audioFeatures: {
        tempo: { min: 90, max: 160, avg: 125 },
        danceability: { min: 0.5, max: 0.8, avg: 0.65 },
        energy: { min: 0.5, max: 0.9, avg: 0.7 },
        valence: { min: 0.4, max: 0.8, avg: 0.6 },
        acousticness: { min: 0.1, max: 0.6, avg: 0.35 },
        instrumentalness: { min: 0.4, max: 0.9, avg: 0.7 },
        liveness: { min: 0.08, max: 0.5, avg: 0.25 },
        speechiness: { min: 0.03, max: 0.08, avg: 0.05 },
        loudness: { min: -16, max: -8, avg: -11 }
      }
    }
  },

  country: {
    traditional: {
      artists: ['Hank Williams', 'Johnny Cash', 'Patsy Cline', 'Willie Nelson', 'Dolly Parton', 'George Jones'],
      keywords: ['traditional country', 'classic country', 'honky tonk', 'outlaw country', 'bluegrass'],
      audioFeatures: {
        tempo: { min: 90, max: 140, avg: 115 },
        danceability: { min: 0.5, max: 0.8, avg: 0.65 },
        energy: { min: 0.4, max: 0.8, avg: 0.6 },
        valence: { min: 0.3, max: 0.8, avg: 0.55 },
        acousticness: { min: 0.3, max: 0.9, avg: 0.6 },
        instrumentalness: { min: 0.0, max: 0.3, avg: 0.1 },
        liveness: { min: 0.1, max: 0.6, avg: 0.3 },
        speechiness: { min: 0.03, max: 0.15, avg: 0.08 },
        loudness: { min: -18, max: -8, avg: -12 }
      }
    },
    contemporary: {
      artists: ['Luke Bryan', 'Blake Shelton', 'Carrie Underwood', 'Keith Urban', 'Miranda Lambert', 'Jason Aldean'],
      keywords: ['contemporary country', 'country pop', 'bro country', 'stadium country', 'mainstream country'],
      audioFeatures: {
        tempo: { min: 100, max: 140, avg: 120 },
        danceability: { min: 0.6, max: 0.9, avg: 0.75 },
        energy: { min: 0.5, max: 0.9, avg: 0.7 },
        valence: { min: 0.4, max: 0.9, avg: 0.65 },
        acousticness: { min: 0.1, max: 0.6, avg: 0.35 },
        instrumentalness: { min: 0.0, max: 0.2, avg: 0.05 },
        liveness: { min: 0.08, max: 0.4, avg: 0.2 },
        speechiness: { min: 0.03, max: 0.15, avg: 0.08 },
        loudness: { min: -14, max: -6, avg: -9 }
      }
    }
  },

  folk: {
    traditional: {
      artists: ['Bob Dylan', 'Joan Baez', 'Woody Guthrie', 'Pete Seeger', 'The Carter Family', 'Lead Belly'],
      keywords: ['traditional folk', 'folk rock', 'protest folk', 'american folk', 'acoustic folk'],
      audioFeatures: {
        tempo: { min: 80, max: 130, avg: 105 },
        danceability: { min: 0.3, max: 0.7, avg: 0.5 },
        energy: { min: 0.3, max: 0.7, avg: 0.5 },
        valence: { min: 0.3, max: 0.8, avg: 0.55 },
        acousticness: { min: 0.5, max: 0.95, avg: 0.75 },
        instrumentalness: { min: 0.0, max: 0.4, avg: 0.15 },
        liveness: { min: 0.1, max: 0.6, avg: 0.3 },
        speechiness: { min: 0.03, max: 0.2, avg: 0.1 },
        loudness: { min: -20, max: -10, avg: -15 }
      }
    },
    indie: {
      artists: ['Fleet Foxes', 'Bon Iver', 'Iron & Wine', 'The National', 'Sufjan Stevens', 'Angel Olsen'],
      keywords: ['indie folk', 'chamber folk', 'folk pop', 'neo folk', 'freak folk', 'new weird america'],
      audioFeatures: {
        tempo: { min: 70, max: 130, avg: 100 },
        danceability: { min: 0.3, max: 0.7, avg: 0.5 },
        energy: { min: 0.2, max: 0.7, avg: 0.45 },
        valence: { min: 0.2, max: 0.8, avg: 0.5 },
        acousticness: { min: 0.3, max: 0.9, avg: 0.6 },
        instrumentalness: { min: 0.0, max: 0.5, avg: 0.2 },
        liveness: { min: 0.08, max: 0.4, avg: 0.2 },
        speechiness: { min: 0.03, max: 0.15, avg: 0.08 },
        loudness: { min: -22, max: -10, avg: -16 }
      }
    }
  },

  latin: {
    reggaeton: {
      artists: ['Bad Bunny', 'J Balvin', 'Ozuna', 'Daddy Yankee', 'Karol G', 'Anuel AA', 'Maluma'],
      keywords: ['reggaeton', 'latin trap', 'perreo', 'dembow', 'urbano', 'latin urban'],
      audioFeatures: {
        tempo: { min: 85, max: 105, avg: 95 },
        danceability: { min: 0.7, max: 0.95, avg: 0.85 },
        energy: { min: 0.6, max: 0.9, avg: 0.75 },
        valence: { min: 0.4, max: 0.9, avg: 0.65 },
        acousticness: { min: 0.0, max: 0.3, avg: 0.1 },
        instrumentalness: { min: 0.0, max: 0.2, avg: 0.05 },
        liveness: { min: 0.05, max: 0.3, avg: 0.15 },
        speechiness: { min: 0.1, max: 0.5, avg: 0.3 },
        loudness: { min: -10, max: -4, avg: -6 }
      }
    },
    traditional: {
      artists: ['Celia Cruz', 'Tito Puente', 'Compay Segundo', 'Buena Vista Social Club', 'Marc Anthony'],
      keywords: ['salsa', 'bachata', 'merengue', 'cumbia', 'son cubano', 'mambo', 'cha cha'],
      audioFeatures: {
        tempo: { min: 120, max: 180, avg: 150 },
        danceability: { min: 0.7, max: 0.95, avg: 0.85 },
        energy: { min: 0.6, max: 0.9, avg: 0.75 },
        valence: { min: 0.5, max: 0.9, avg: 0.7 },
        acousticness: { min: 0.1, max: 0.6, avg: 0.3 },
        instrumentalness: { min: 0.0, max: 0.3, avg: 0.1 },
        liveness: { min: 0.1, max: 0.6, avg: 0.3 },
        speechiness: { min: 0.05, max: 0.3, avg: 0.15 },
        loudness: { min: -14, max: -6, avg: -9 }
      }
    }
  }
};