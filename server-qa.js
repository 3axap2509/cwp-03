const net = require('net');
const fs = require('fs');
const port = 8125;
var counter = 0;
var qa = [];
var user = require('os').userInfo().username;

const server = net.createServer((client)=>
{
  read_json();
  fs.mkdir("log", (err)=>{if(err){console.error(err);}});
  client.id = user + '_' + (counter++).toString();
  client.log = "log/" + client.id + ".log";
  console.log(client.id +' connected');

  client.setEncoding('utf8');

  client.on('data', (data) =>
  {
    console.log(data);
    if(!client.qa)
    {
      if(data == "qa")
      {
        fs.writeFileSync(client.log, "client " + client.id + " connected \r\n", err=>{if(err)console.error(err)});
        client.qa = true;
        client.write("ACK", err=>{if(err){console.error(err); throw err;}});
      }
      else
      {
        client.write("DEC", err=>{if(err){console.error(err); throw err;}});
      }
    }
    else
    {
      if(data == 'bye')
      {
        fs.appendFileSync(client.log, client.id + ': ' + data+' \r\n', (err) => {if(err){console.error(err);}});
        fs.appendFileSync(client.log, data+' \r\n', (err) => {if(err){console.error(err);}});
        client.write('bye');
      }
      else
      {
      fs.appendFileSync(client.log, client.id + ': ' +  data+' \r\n', err=>{if(err)console.error(err)});
        if(Math.random() > 0.35)
        {
          qa.forEach(element => 
          {
            if(data == element.q)
            {
              client.write(element.a, err=>{if(err){console.error(err); throw err;}});
              fs.appendFileSync(client.log, 'server: ' + element.a+' \r\n', err=>{if(err)console.error(err)});
            }
          });
        }
        else
        {
          client.write("idk the answer, sorry :(", err=>{if(err){console.error(err); throw err;}})
          fs.appendFileSync(client.log,  'server: ' + "idk the answer, sorry :( \r\n", err=>{if(err)console.error(err)});
        }
      }
    }
  })
  client.on('close', (err)=>{if(err){console.error(err); throw err;}})
})

server.listen(port, () =>
{
  console.log(`Server listening on localhost:${port}`);
});

function read_json()
{
  fs.readFile('qa.json', 'utf8', (err, data) =>
  {
    if (err) throw err;
    qa = JSON.parse(data);
  });
}
