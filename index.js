const express = require('express')
var mysql = require('mysql')

// create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "joseph", 
    database : "bloodbank"
});

// connect

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log("connected")
})
const app = express();
app.use('/',  express.static('static'));
app.get("/bloodbank/getDonors/:bloodType", (req, res)=>{
    let sql = 
    `SELECT d.firstName, d.lastName, d.emailAddress, d.bloodType,count(*) AS donationCount
    FROM donor AS d
    JOIN blooddonation AS bd ON bd.donor = d.emailAddress
    WHERE d.bloodType = "${req.params.bloodType}"
    GROUP BY d.emailAddress, d.bloodType, d.sex, d.weight
    HAVING count(*) > 6 AND ((max(DATEDIFF(CURRENT_DATE(), bd.dateCollected)) > 84 AND d.sex = 'F') 
        OR (max(DATEDIFF(CURRENT_DATE(), bd.dateCollected)) > 56 AND d.sex = 'M'))
        AND d.weight > 50
    ORDER BY d.emailAddress`
    let query = db.query(sql,(err,results)=>{
        if(err) throw err;
        if(results.length == 0){
            res.status(404).send("invalid input")
            return
        } 
        res.send(results)
    });
});

app.put("/bloodbank/setDonors/:bloodType", (req, res)=>{
    let sql = 
    `UPDATE donor AS d
    SET d.firstName = CONCAT(d.firstName, "*")
    WHERE d.emailaddress IN (
        SELECT emailAddress
        FROM (
            SELECT d.firstName, d.lastName, d.emailAddress, d.bloodType,count(*) AS donationCount
            FROM donor AS d
            JOIN blooddonation AS bd ON bd.donor = d.emailAddress
            WHERE d.bloodType = "${req.params.bloodType}"
            GROUP BY d.emailAddress, d.bloodType, d.sex, d.weight
            HAVING count(*) > 6 AND ((max(DATEDIFF(CURRENT_DATE(), bd.dateCollected)) > 84 AND d.sex = 'F') 
                OR (max(DATEDIFF(CURRENT_DATE(), bd.dateCollected)) > 56 AND d.sex = 'M'))
                AND d.weight > 50
            ORDER BY d.emailAddress
        ) AS ALIAS
    )`
    let query = db.query(sql,(err,results)=>{
        if(err) throw err;
        if(results.length == 0){
            res.status(404).send("invalid input")
            return
        } 
        res.send(results)
    });
});


app.get("/bloodbank/recentRequests", (req, res)=>{
    let sql = 
    `SELECT br.requestID,br.requestDate, h.hospitalName, l.streetAddress, l.city, l.postalCode
    FROM bloodrequest AS br
    JOIN hospital AS h ON h.hospitalID = br.hospitalID
    JOIN location as l on h.hospitalID = l.locationID
    ORDER BY br.requestDate DESC
    LIMIT 5`
    let query = db.query(sql,(err,results)=>{
        if(err) throw err;
        console.log("got it!")
        res.send(results)
    });
});

app.listen('3000', () => {
    console.log("server started port 3000")
});
