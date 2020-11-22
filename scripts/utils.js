const fs = require('fs');
const yaml = require('yaml');

function getText(text) {
    return fs.readFileSync(`${__dirname}/../src/texts/${text}.txt`, 'utf8')
}

function getEpisodes() {
    const episodeFiles = fs.readdirSync(`${__dirname}/../src/episodes`);

    return episodeFiles.map(episodeFile => {
        const episodeNumber = episodeFile.split('.')[0];
        const episode = yaml.parse(fs.readFileSync(`${__dirname}/../src/episodes/${episodeFile}`, 'utf8'));

        return {
            ...episode,
            episode: episodeNumber,
            episodeNumber: parseInt(episodeNumber, 10)
        };
    })
}

function writeToDist(path, contents) {
    try {
        fs.mkdirSync(`${__dirname}/../dist`);
    } catch {
        // Folder is already created
    }
    return fs.writeFileSync(`${__dirname}/../dist/${path}`, contents);
}

module.exports = {
    getText,
    getEpisodes,
    writeToDist,
};