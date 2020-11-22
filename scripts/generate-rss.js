const Podcast = require('podcast');
const { getText, getEpisodes, writeToDist } = require('./utils');

const podcast = new Podcast({
    title: 'Gewoon Digital Man',
    description: getText('podcast-description'),
    feedUrl: 'https://gewoondigitalman.nl/rss.xml',
    siteUrl: 'https://gewoondigitalman.nl',
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
    });
});

writeToDist('rss.xml', podcast.buildXml('\t'))