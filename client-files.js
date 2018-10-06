const fs = require('fs');
const net = require('net');
const port = 8125;
const client = new net.Socket();
const path = require('path');
var qa = [];
var counter4questing = 0;
var paths = [];
const buf = require('buffer');


for(let i=2; i < process.argv.length; i++)
{
  paths.push(process.argv[i]);
}

client.setEncoding('utf8');
client.connect(port, function() 
{
  console.log('Connected to server');
  client.write('files');
});

client.on('data', function(data) 
{
  console.log(data);
  if(data == 'ACK')
  {
    connected = true;
    for(let i=0; i < paths.length; i++)
    {
      fs.readdir(paths[i], (err, items)=>
      {
        if(err)
        {
          console.error(err);
        }
        else
        {
          items.forEach((item)=>
          {
            if(path.extname(item) != "")
            {
              var buf1 = fs.readFileSync(paths[i] + "//" + item);
              client.write(item.toString()); 
              client.write('%%%');
              client.write(buf1);
              client.write('||||');
            }
          })
        }
      })
    }
    client.write('bye');
  }
  else if(data == 'DEC'|| data =='bye')
  {
    client.destroy();
  }
  
});

client.on('close', function() {
  console.log('Connection closed');
});