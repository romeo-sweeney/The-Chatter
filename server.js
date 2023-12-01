const data = require('./data');
const express = require('express');
const basicAuth = require('express-basic-auth')
const app = express();
const port = 4131;

const authorization = basicAuth({
    users: { 'admin': 'password' },
    challenge: true,
    realm: "User Visible Realm"
});

app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/resources', express.static('resources'));

// Extra credit middleware function
// app.use((req, res, next) => {
//     console.log("***********************************");
//     console.log(`Processing a ${req.method} request for ${req.url}`);
//     next();
//     console.log(`Server sent back a ${res.statusCode} code`);
//     console.log(`The sale is ${isSales ? "active" : "not active"}`);
//     console.log(`There are ${data.getContactData().length} contacts`);
//     console.log();
// });


app.get('/', (req , res) => {
    res.render("mainpage");
});

app.get('/main', (req, res) => {
    res.render("mainpage");
});

app.get('/contact', (req, res) => {
    res.render("contactform");
});

app.post('/contact', (req , res) => {
    data.addContact(req.body)
    .then(() => {
        res.status(201).render("contactLogErrorless");
    })
    .catch(error => {
        res.status(400).render("contactLogError");    
    })
});

app.get('/testimonies', (req, res) => {
    res.render("testimonies")
});

app.get('/admin/contactlog', authorization, (req, res) => {
    data.getContacts()
    .then(contacts => {
        res.render("contactlog", { contacts });
    })
    .catch(error => {
        console.log("Error in GET /admin/contactlog", error);
        res.status(500).send(error.message);
    });
});

app.delete('/api/contact', authorization, (req, res) => {
    const body = req.body;
    console.log(body);
    try {
        if (!("id" in body)) {
            res.status(400).send("ERROR: JSON object does not contain 'id' property");
        }

        const contactId = parseInt(body["id"]);

        data.deleteContact(contactId)
            .then((valid)=> {
                if (valid) {
                    res.status(200).send(`Contact ID [${contactId}] has been deleted`);
                } else {
                    res.status(404).send(`Contact ID [${contactId}] does not exist in contacts`);
                }

            })
            .catch(error => {
                console.error(error.message);
                res.status(404).send(`ERROR: Cannot delete row [${contactId}]`);
            });
    } catch (e) {
        console.error(e);
        res.status(400).send(`ERROR: Unable to parse JSON object: ${body}`);
    }
});


app.get('/api/sale', (req, res) => {
    data.getRecentSales()
    .then(recentSales => {
        if (recentSales[0].active) {
            res.status(200).send({ "active": true, "message": recentSales[0].message});
        } else {
            res.status(200).send({ "active": false});
        }
    })
    .catch(error => {
        console.log("Error in GET /api/sale: ", error);
        res.status(500).send(error.message);
    });
});

app.post('/api/sale', authorization, (req, res) => {
    data.addSale(req.body.message)
    .then((result)=> {
        res.status(200);
    })
    .catch(error => {
        console.log("Error in POST /api/sale", error);
        res.status(500).send(error.message);
    });
});

app.delete('/api/sale', authorization, (req, res) => {
    data.endSale()
    .then(()=> {
        res.status(200).json({ data: {"active": false} });
    })
    .catch(error => {
        console.log("Error in DELETE /api/sale", error);
        res.status(500).send(error.message);
    });
});

app.get('/admin/salelog', authorization, (req, res) => {
    data.getRecentSales()
    .then(recentSales=> {
        res.status(200).json(recentSales);
    })
    .catch(error => {
        console.log("Error in GET /admin/salelog", error);
        res.status(500).send(error.message);
    });
})

// catch all
app.use((req, res, next) => {
    res.status(404).render("404");
});


app.listen(port, () => {   
    console.log("Server is running on: http://localhost:4131/");
});