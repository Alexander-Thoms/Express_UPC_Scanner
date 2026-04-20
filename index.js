const port = 8080;
const express = require('express');
const app = express();
app.disable('x-powered-by'); // information exporure disable x powered by
const mysql = require('mysql2');
const dotenv = require('dotenv');
const sqlpassword = process.env.password;


/**
 

 create table items (
 id int auto_increment primary key,
 productnames TEXT NOT NULL
 );



 */


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: sqlpassword,// hard coded passwords unsafe use env
    database: 'shoppingdatabase'

});

connection.connect((err) =>{
    if (err){
        console.error("error connecting to myql: " + err.stack)
    }
    console.log("connected to sql");

});




app.use(express.urlencoded({extended: true}));

 function makelist(namesparam){
        let content = ""
        let start = "<li>" // html tags
        let end = "</li>"
        for(let index = 0; index < namesparam.length; index++){ // for loop each items in names array
            content += start + namesparam[index] + end // create proper li html code
        }
        return content // return the html
      
    }

     function deleteitem(deleteparam){
         let deletecode = `delete from productnames where ("${deleteparam}")`
        connection.query(deletecode, (error, results, fields)=>{
            if(error){
                warn(error)
            }
            console.log(results)
        });
        return console.log("delete success");
    }





app.get('/', (req,res)=>{



 let showallcode = `select productnames from items` // select all product names from items
    let names = [];
    connection.query(showallcode, (error, results, fields)=>{
         if(error){
            console.warn(error)
        }
         results.forEach((record)=>{ // for reach record it finds push it into names array
            names.push(record.productnames);
        });
    console.log("main logs: ");
    console.log(names);
    console.log(names.length)

      res.send(`
        <html>
        <head>
        <title>shopping list main page</title>
        </head>
       <body>
       <h1>Shopping List</h1>
        <form method="POST" action="/lookup">
        <label>
        <input type="text" name="upc" value="049000061017">
        </label>
        <button type="submit">look up</button>
        </form>
        <form method="POST" action ="/namelookup">
        <input type="text" name="productnames" value="product name"> 
        <button type="submit">add non upc product</button>
        </form>
        <ol>
        ${makelist(names)}
        </ol>
        </body>
        </html>
`);




    });

      

});
app.post(`/namelookup`, async(req, res)=>{
    let input = req.body.productnames
    let insertcodename =  `insert into items(productnames) values (?)`
    connection.query(insertcodename, [input], (error, results, field)=>{
        if(error){
            warn(error)
        }
        console.log(results);
        console.log("inserted name success");

    });

     function makelist(namesparam){
        let content = ""
        let start = "<li>" // html tags
        let end = "</li>"
        for(let index = 0; index < namesparam.length; index++){ // for loop each items in names array
            content += start + namesparam[index] + end // create proper li html code
        }
        return content // return the html
      
    }

    let showallcode = `select productnames from items` // select all product names from items
    let names = [];
    connection.query(showallcode, (error, results, fields)=>{
         if(error){
            console.warn(error)
        }
         results.forEach((record)=>{ // for reach record it finds push it into names array
            names.push(record.productnames);
        });
    console.log(names);



     res.send(`

    <html>
    <body>
    <h1>Shopping List</h1>
        <form method="POST" action="/lookup">
        <label>
        <input type="text" name="upc" value="049000061017">
        </label>
        <button type="submit">look up</button>
        </form>
        <form method="POST" action= "/namelookup">
        <input type="text" name="productnames" value="product name"> 
        <button type="submit">add non upc product</button>
        </form>
    <ol>
    ${makelist(names)}
    </ol>
    </html>


    `);
});


});
app.post('/lookup', async(req,res)=>{
    const upc = req.body.upc;
    
    const url = `https://barcode-spider.p.rapidapi.com/v1/lookup?upc=${upc}`;
    const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'effcf28ec4msh408c10f13a68dcdp1836b1jsnc602376e95f5',
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
    const upccode = data.item_attributes.upc;
    let input = upc.value;

    function makelist(namesparam){
        let content = ""
        let start = "<li>" // html tags
        let end = "</li>"
        for(let index = 0; index < namesparam.length; index++){ // for loop each items in names array
            content += start + namesparam[index] + end // create proper li html code
        }
        return content // return the html
      
    }

   
   

    console.log(data);
    insertcode = `insert into items(productnames) values (?)`
    connection.query(insertcode, [title], (error, results, fields)=>{
        if(error){
            console.warn(error)
        }
        console.log(results)
        console.log("inserted success"); // if everything worked out it will
        
    });
    let showallcode = `select productnames from items` // select all product names from items
    let names = [];
    connection.query(showallcode, (error, results, fields)=>{
         if(error){
            console.warn(error)
        }
         results.forEach((record)=>{ // for reach record it finds push it into names array
            names.push(record.productnames);
        });
    console.log(names);

     res.send(`

    <html>
    <body>
    <h1>Shopping List</h1>
        <form method="POST" action="/lookup">
        <label>
        <input type="text" name="upc" value="049000061017">
        </label>
        <button type="submit">look up</button>
        </form>
        <form method="POST" action="/namelookup">
        <input type="text" name="productnames" value="product name"> 
        <button type="submit">add non upc product</button>
        </form>
    <ol>
    ${makelist(names)}
    </ol>
    </html>


    `);
   
  
	
});
    });
  
   







app.listen(port, ()=>{
    console.log("server is running on port: ", port)
});
