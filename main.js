import 'dotenv/config';
import http from 'http';
import { Attachment, AttachmentBuilder, Client, GatewayIntentBits } from 'discord.js';
import characters from './heroes.json' with {type: 'json'}
import scenario from './randomScenario.json' with {type: 'json'}
import items from './Items.json' with {type: 'json'}
import fs from "fs"
import path from 'path'



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers  
  ],
});


const cardsPath = path.resolve('./SmallCards');
const cardFiles = fs.readdirSync(cardsPath)




client.once('clientReady', () => {
  console.log("Ready!");
});
  

function imgCheker(Name) {
  const charPhoto = cardFiles.find(file => file.toLowerCase().includes(Name.toLowerCase()) )
  if (charPhoto) {
    const pPhto = path.join('./SmallCards', charPhoto)
    return new AttachmentBuilder(pPhto)
  } else {
    console.log("Error")
  }
}

function CategoryFilter() {
  const categ = ['Armaments', 'Attributes', 'Arcane', 'Common', 'Support']

  const ItemofCategory = items.filter(item => categ.includes(item.category))

  const shuffled = ItemofCategory.sort(() => 0.5 - Math.random());

  
  const selectedItems = shuffled.slice(0, 6);


  return selectedItems.map(item => item.name).join(', ')
  
  
}


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes('донат')) {
    try {
      message.reply('Спасибо за донат!')
      
    } catch(error) {
      console.log(error)
    }
  };

  if (message.content.toLowerCase() === 'дота') {
    const server = client.guilds.cache.get(message.guild.id); // Ид сервера если надр

    try {

      
     
      const Ritem = CategoryFilter()

      const heroRanCharacter = characters.heroes[Math.floor(Math.random() * characters.heroes.length)]

      const rCharacter = heroRanCharacter.name

      const Charname = heroRanCharacter.localized_name // Visual

      const rScenario = scenario.scennario[Math.floor(Math.random() * scenario.scennario.length)]

      
      const photo = imgCheker(rCharacter)
      
      let attachments = []

      if (photo)   {
        attachments.push(photo)
      }
      message.reply({ content: ' Выбирай: ' + Charname + ', по сценарию: ' + rScenario + ',  предметы которые ты можешь собрать: ' + Ritem,
        files: attachments,
        
      })

    } catch (error) {
      console.error('Cant choose r member and else', error);
    }




  };
  
  
});


http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running\n');
}).listen(process.env.PORT || 3000, () => {
  console.log('Web server is running');
});

client.login(process.env.DISCORD_TOKEN);
