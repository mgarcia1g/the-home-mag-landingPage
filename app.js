const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");
const API_KEY="395d8ecd46f2735be609ea8570776d8d-us12";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.listen(process.env.PORT || 3000, function () { //update port to be able to deploy in heroku. instead of just 3000
    console.log("Server is running on port 3000")
});

app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phoneNumber,
                }
            }
        ]
    }
    
    var jsonData = JSON.stringify(data); // turning data to flatpack json. instad of js.
    const url="https://us12.api.mailchimp.com/3.0/lists/355d90f401";
    const options={
        method: "POST",
        auth: "tracy1:"+API_KEY
    }
   

    const request = https.request(url, options, function(response){
        // console.log(response)
        
        if(response.statusCode === 200) {

            const theHomeMag="https://www.thehomemag.com/";
            res.redirect(theHomeMag);

        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData);
    request.end();
})
