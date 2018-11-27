const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require ('path');

const app = express();

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req,res) => {
    const { firstName, lastName, email } = req.body;

    // Validation (!empty)
    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }

    // Data request
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const postData = JSON.stringify(data);

    // Your list ID
    const list_id = 'ea47cf84a2';

    // Your API key
    const api_key = '559e12613367dedc6c4f620bd1041aea-us19';

    const options = {
        url: `https://us19.api.mailchimp.com/3.0/lists/${list_id}`,
        method: 'POST',
        headers:{
            Authorization: `auth ${api_key}`
        },
        body: postData
    };

    request(options, (err, response, body) => {
        if (err) {
            res.redirect('/fail.html');
        } else {
            if ( response.statusCode === 200) {
                res.redirect('/success.html');
            } else{
                res.redirect('/fail.html');
            }
        }
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server started on ${PORT}`));