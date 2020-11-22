const { google } = require("googleapis");
const { getEpisodes, getText } = require("./utils");

const youtube = google.youtube("v3");

const auth = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CLIENT_REDIRECT_URI);
google.options({ auth });


if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.REFRESH_TOKEN) {
    auth.credentials.refresh_token = process.env.REFRESH_TOKEN;

    getEpisodes().filter(episode => episode.youtube).forEach(async episode => {
        const newSnippet = {
            title: `Gewoon Digital Man Ep.${episode.episode}`,
            description: getText('youtube-description')
                .replace('[episode description]', episode.description)
                .replace('[episode timestamps]', Object.entries(episode.timestamps).map(([time, subject]) => `${time} ${subject}`).join('\n'))
                .replace('[podcast description]', getText('podcast-description')),
        };

        console.log(`Getting youtube info about episode ${episode.episode}...`);

        const { data } = await youtube.videos.list({
            id: episode.youtube,
            part: 'id,snippet',
        });

        console.log(`Writing youtube info about episode ${episode.episode}...`);
        console.log(newSnippet);
        
        await youtube.videos.update({
            part: 'snippet',
            resource: {
                ...data.items[0],
                snippet: {
                    ...data.items[0].snippet,
                    ...newSnippet,
                }
            }
        });

        console.log(`Completed writing youtube info about episode ${episode.episode}.`);
    })
}
else if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    console.log('A CLIENT_ID and CLIENT_SECRET is required.');
}
else if (process.env.GOOGLE_CODE) {
    auth.getToken(process.env.GOOGLE_CODE).then(token => {
        console.log('Please provide the following REFRESH_TOKEN from now on:');
        console.log(token.refresh_token);
        process.exit(1);
    });

    process.exit(1);
}
else if (process.env.CLIENT_REDIRECT_URI) {
    const authUrl = auth.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube.force-ssl"],
    });
    console.log(`Please go to ${authUrl} and supply the code from the resulting url as GOOGLE_CODE env variable.`);
    process.exit(1);
}
else {
    console.log('A CLIENT_REDIRECT_URI is required when not providing a GOOGLE_CODE or REFRESH_TOKEN.');
    process.exit(1);
}