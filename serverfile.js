var express = require("express");
var app = express();
var mysql = require("mysql");
var fileuploader = require("express-fileupload");

var nodemailer = require('nodemailer');



 

app.listen(2002, function () {
    console.log("Server started")
});


var connection = {
    host: "localhost",
    user: "root",
    password: "",
    database: "user"


}


var connect = mysql.createConnection(connection);
connect.connect(function (err) {
    if (err) {
        console.log(err);

    }
    else
        console.log("connected");

});



app.use(express.static("public"));


app.get("/", function (req, resp) {
    // console.log("Home page");

    resp.sendFile(__dirname + "/public/index.html");
});


app.get("/profile", function (req, resp) {
    resp.sendFile(__dirname + "/public/profile.html");
});

app.get("/picterprofile",function(req,resp){
    resp.sendFile(__dirname+"/public/Founder-profile.html");
})






app.get("/ajaxsignup", function (req, resp) {


    


    var dataary = [req.query.txtemail, req.query.txtpass, req.query.txttype];
    connect.query("insert into userinfo values(?,?,?)", dataary, function (err) {

        console.log(req.query.txtemail)
        if (err) {
            resp.send(err);


        }
        else {
            if (req.query.txttype == "Shark") {

                // resp.sendFile(__dirname + "/public/home.html");
                resp.send("shark");
            }



            else {
                //resp.sendFile(__dirname + "/public/bitter-home.html");
                resp.send("bitter");
            }



        }

    })

});


app.get("/ajaxcheckuser", function (req, resp) {
    //var data=[req.query.emailid,req.query.password];
    connect.query("select usertype from userinfo where Email=? and Password=? and Status=1", [req.query.emailid, req.query.password], function (err, result) {
        //  console.log(result.usertype)
        if (err) {
            resp.send(err);

        }
        else {
            if (result.length == 0) {
                resp.send("invalid");
            }
            else {
                //resp.send("availble");
                // console.log(req.query.txttype);
                //resp.sendFile(__dirname+ "/public/bitter-home.html");
                resp.send(result[0].usertype);//shark/founder

            }
        }

    })

})
app.use(express.urlencoded('extended:true'));
app.use(fileuploader());

app.post("/saverecord", function (req, resp) {
    var newName = "nopic.png";
    var profilename = "nopic.png";
    if (req.files != null) {
        newName = req.body.username + "-" + req.files.adhaarpic.name;
        // profilename=req.body.username+"-"+req.files.profilepic.name;
        var des = process.cwd() + "/public/uploads/" + newName;

        req.files.adhaarpic.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("1.File Uploaded Successfullllyyyy");




        })

        /*   fs.writeFile("/public/uploads/adhaarpic",req.files.adhaarpic.data,()=>{
               console.log("done");
           })

*/

    }

    if (req.files != null) {
        profilename = req.body.username + "-" + req.files.profilepic.name;
        var des = process.cwd() + "/public/profileuploads/" + profilename;

        req.files.profilepic.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("1.File Uploaded Successfullllyyyy");
        });
    }

   



    var dataAry = [req.body.username, req.body.email, req.body.city, req.body.address, req.body.phone, req.body.occup, newName, profilename, req.body.txtselect, req.body.company, req.body.amount, req.body.textarea];
    connect.query("insert into Sharkinfo values(?,?,?,?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
        if (err)
            resp.send(err);
        else {
            resp.send("Record saved successfully");
        }

    })
    //--------------------
});



app.post("/profile-update", function (req, resp)
 {
    var newName;
    var profilename;

    //if req.files==null , it means user dont want to change the pic
    //then use the old pic name to update
   


    if (req.files != null) {
        newName = req.body.username + "-" + req.files.adhaarpic.name;
        var des = process.cwd() + "/public/uploads/" + newName;
        req.files.adhaarpic.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("1.File Uploaded Successfullllyyyy");
        });
    }
    else
    newName = req.body.oldPic;  //old wala name-hidden wala


    if (req.files != null) {
       profilename=req.body.username+"-"+req.files.profilepic.name;
       var des=process.cwd()+"/public/profileuploads/"+profilename;
       req.files.profilepic.mv(des,function(err){
           if (err) {
               console.log(err)
           }
           else
           console.log("Done")
       })

    }
    else
    profilename = req.body.ppic;
        

    var dataAry = [req.body.username, req.body.city, req.body.address, req.body.phone, req.body.occup, newName, profilename, req.body.txtselect, req.body.company, req.body.amount, req.body.textarea, req.body.email];
    connect.query("update Sharkinfo set Name=?,City=?,Address=?,Contactno=?,Occupation=?,Adhaarpic=?,Profilepic=?,Catagory=?,Companycount=?,Amount=?,Otherinfo=? where Email=?", dataAry, function (err) {
        if (err)
            resp.send(err);
        else {
            resp.send("Record Updated successfully");
        }

    })
    //--------------------

})

          app.get("/JSONserachRecord", function (req, resp) {

    //uid primary key in table
    //table wala col-uid
    connect.query("select * from Sharkinfo where Email=?", [req.query.email], function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
          
    })
});




//------------------------------------Founder-Data-----------------------------------------------//



app.post("/savefounderrecord", function (req, resp) {
    var newName = "nopic.png";
   
    if (req.files != null) {
        newName = req.body.username + "-" + req.files.adhaarpic.name;
       
        var des = process.cwd() + "/public/Founderadhaar/" + newName;

        req.files.adhaarpic.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("1.File Uploaded Successfullllyyyy");




        })


    }


    var dataAry = [req.body.username, req.body.email, req.body.city, req.body.address, req.body.phone, newName, req.body.company,req.body.txtselect, req.body.estabh,req.body.amount,req.body.partners,req.body.eval, req.body.textarea];
    connect.query("insert into foundrerinfo values(?,?,?,?,?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
        if (err)
            resp.send(err);
        else {
            resp.send("Record saved successfully");
        }

    })
    //--------------------
});






app.post("/founderprofile-update", function (req, resp) {
    var newName ;
    
    if (req.files != null) {
        newName = req.body.username + "-" + req.files.adhaarpic.name;
       
        var des = process.cwd() + "/public/Founderadhaar/" + newName;

        req.files.adhaarpic.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("1.File Uploaded Successfullllyyyy");




        })


    }
    else
    newName = req.body.oldPic; 




    var dataAry = [req.body.username, req.body.city, req.body.address, req.body.phone, newName, req.body.company,req.body.txtselect, req.body.estabh,req.body.amount,req.body.partners,req.body.eval, req.body.textarea, req.body.email];
    connect.query("update foundrerinfo set Name=?,City=?,Address=?,Phone=?,Adhaarpic=?,Company=?,catagory=?,Establishdate=?,Comapnysales=?,Nopartners=?,Evaluation=?,Otherinfo=? where Email=?", dataAry, function (err) {
        if (err)
            resp.send(err);
        else {
            resp.send("Update saved successfully");
        }

    })
    //--------------------
});






