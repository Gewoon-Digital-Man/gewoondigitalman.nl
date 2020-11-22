const Podcast = require('podcast');
const { getText, getEpisodes, writeToDist } = require('./utils');

const podcast = new Podcast({
    title: 'Gewoon Digital Man',
    description: getText('podcast-description'),
    feedUrl: 'https://www.gewoondigitalman.nl/rss.xml',
    siteUrl: 'https://www.gewoondigitalman.nl',
    imageUrl: 'https://www.gewoondigitalman.nl/logo.png',
    author: 'Gewoon Digital Man',
    managingEditor: 'Bart Langelaan',
    webMaster: 'Bart Langelaan',
    copyright: 'Gewoon Digital Man',
    language: 'Dutch',
    itunesType: 'episodic',
    itunesOwner: {
        name: 'Gewoon Digital Man',
        email: 'mailen@gewoondigitalman.nl',
    },
});

getEpisodes().forEach(episode => {
    podcast.addItem({
        title: `Gewoon Digital Man Ep.${episode.episode}`,
        description: episode.description,
        enclosure: {
            url: `https://gewoon-digital-man.s3.eu-west-3.amazonaws.com/Gewoon+Digital+Man+Ep${episode.episode}.mp3`,
        },
        url: `https://www.youtube.com/watch?v=${episode.youtube}`,
        date: episode.date,
        itunesEpisode: episode.episodeNumber,
        customElements: [{
            'psc:chapters': [
                {
                    _attr: {
                        version: '1.2',
                        'xmlns:psc': 'http://podlove.org/simple-chapters',
                    }
                },
                ...Object.entries(episode.timestamps).map(([start, title]) => ({
                    'psc:chapter': {
                        _attr: {
                            start, title
                        }
                    }
                }))
            ]
        }]
    });
});

writeToDist('rss.xml', podcast.buildXml('\t'))