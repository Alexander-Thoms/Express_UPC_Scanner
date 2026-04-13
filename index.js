const port = 8080;
const express = require('express');
const app = express();



app.use(express.urlencoded({extended: true}));
app.get('/', (req,res)=>{
    res.send(`
        <html>
        <head>
        <title>upc lookup</title>
        </head>
        <body>
        <h1>upc lookup</h1>
        <form method="POST" action="/lookup">
        <label>
        <input type="text" name="upc" value="049000000443">
        </label>
        <button type="submit">look up</button>
        </form>
        </body>
        </html>
`);
});
app.post('/lookup', async(req,res)=>{
    const upc = req.body.upc;
    apikey = "";
    const url = `https://barcode-spider.p.rapidapi.com/v1/lookup?upc=${upc}`;
    const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '',
    'x-rapidapi-host': 'barcode-spider.p.rapidapi.com'
  }
};
    const response = await fetch(url, options)
   // if(!response.ok){
     //    return res.status(200).send(`error with fetching upc api`);
   // }
    const data = await response.json();
    const title = data.item_attributes.title;
    const image = data.item_attributes.image;
    const store = data.Stores?.[0]?.link;

    console.log(data)


res.send(`
    <html>
    <body>
    <h1>${title}</h1>
    <img src="${image}"width=100px height=100px>
    <br>
    <a href="${store}">amazon link</a>
    </body>
    </html>
    `);
  
	
});





app.listen(port, ()=>{
    console.log("server is running on port: ", port)
});
