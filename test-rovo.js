const fs = require('fs');
const path = require('path');
const https = require('https');

// 1. Get Config Path
const configPath = path.join(process.env.APPDATA, 'jira-72h-updater-boss', 'config.json');
console.log(`Reading config from: ${configPath}`);

if (!fs.existsSync(configPath)) {
    console.error('❌ Config file not found. Please run the app and save settings first.');
    process.exit(1);
}

// 2. Read Credentials
try {
    const configRaw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configRaw);
    const settings = config.jiraSettings;

    if (!settings || !settings.jiraUrl || !settings.userEmail || !settings.apiToken) {
        console.error('❌ Jira settings are incomplete in the config file.');
        process.exit(1);
    }

    console.log(`✅ Found credentials for: ${settings.userEmail} @ ${settings.jiraUrl}`);

    // 3. Test Rovo API
    testRovo(settings);

} catch (error) {
    console.error('❌ Error reading config:', error.message);
}

function testRovo(settings) {
    const auth = Buffer.from(`${settings.userEmail}:${settings.apiToken}`).toString('base64');
    const data = JSON.stringify({
        messages: [
            {
                role: 'user',
                content: 'Hello, are you working?'
            }
        ],
        context: {
            products: ['jira'],
            sites: [settings.jiraUrl]
        }
    });

    const url = new URL(`${settings.jiraUrl}/gateway/api/rovo/chat/v1/conversations`);

    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log('\nSending request to Rovo...');

    const req = https.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);

        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    const json = JSON.parse(responseBody);
                    const reply = json.messages?.[0]?.content;
                    console.log('\n✅ Rovo Response:');
                    console.log('---------------------------------------------------');
                    console.log(reply);
                    console.log('---------------------------------------------------');
                } catch (e) {
                    console.log('Response:', responseBody);
                }
            } else {
                console.error(`\n❌ Request Failed: ${res.statusCode}`);
                console.error('Headers:', res.headers);
                console.error('Body:', responseBody);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Network Error:', error);
    });

    req.write(data);
    req.end();
}
