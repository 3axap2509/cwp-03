const net = require('net');
const fs = require('fs');
const port = 8125;
var counter = 0;
var user = require('os').userInfo().username;
var files_counter = 10;
var mainf = "d://saved_files_from_user//"

const server = net.createServer((client)=>
{
  client.id = user + '_' + (counter++).toString();
  client.fn = mainf + client.id;
  fs.mkdir(mainf, (err)=>{if(err)console.error(err)});
  fs.mkdir(client.fn, (err)=>{if(err)console.error(err)});
  console.log(client.id +' connected');

  client.setEncoding('utf8');

  client.on('data', (data) =>
  {
    console.log(data);
    if(!client.accepted)
    {
      if(data == "files")
      {
        client.write("ACK", err=>{if(err){console.error(err); throw err;}});
        client.accepted = true;
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
        client.write('bye');
      }
      else
      {
        let mmas = data.split('||||');
        mmas.forEach(element => 
        {
          let mas=element.split('%%%');
          let ttt = client.fn + '//' + mas[0];
          fs.open(ttt, "w+", 0644, (err)=>{if(err)console.error(err)});
          fs.writeFile(ttt, mas[1], 'utf8', (err)=>
          {
            if(err)
            {
              console.error(err);
            }
          })
        });
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
