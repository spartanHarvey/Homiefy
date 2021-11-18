const firebaseObj = require('./firebase');
const { doc, setDoc, getDoc } = require("firebase/firestore");
const { uploadBytes, ref, getDownloadURL } = require("firebase/storage");
const express = require('express');
const config = require('./config')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bcrypt = require('bcryptjs')


const app = express();
const oneDay = 1000 * 60 * 60 * 24;

/// setting sessions config
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/public'))
app.use(cors())
app.use(cookieParser());

//set views
app.set('views', './views')
app.set('view engine', 'ejs')




app.get('/', cors(), async (req, res) => {


    console.log("server here...")
    res.render('index', { msg: "" })


});



app.get('/register', cors(), async (req, res) => res.redirect('/'));
app.post('/register', cors(), async (req, res) => {


    const data = req.body;
    const file = req.files

    const user = await getDoc(doc(firebaseObj.db, 'Users', data.email));

    if (user.exists()) {


        res.render('index', { msg: "Email already in use" });
    }
    else {
        /* ref returns a refence the newly created folder
            then uploadbytes upload the profile picture to that folder
            getDownloadURL get the url of the image which is stored in the Users collection
        */
        const storageRef = ref(firebaseObj.storage, `profilepicture/${data.email}/${file.profilePicture.name}`);
        const uploadedFile = await uploadBytes(storageRef, file.profilePicture.data);
        const fullPath = uploadedFile.metadata.fullPath;
        const img = await getDownloadURL(ref(firebaseObj.storage, fullPath));
        data.profilePicture = img;
        data.password = await bcrypt.hash(data.password, 10);  /// hashed password
        await setDoc(doc(firebaseObj.db, "Users", data.email), data); ///creating new user in firebase with email as the ID


        req.session.userName = data.email;
        res.render('profile', { msg: img })

    }



});


app.get('/login', cors(), async(req,res) => res.redirect('/'));
app.post('/login', cors(), async (req, res) => {

   

        try {
            const data = req.body;
            const user = await getDoc(doc(firebaseObj.db, 'Users', data.email))

            if (user.exists()) {

                try {

                    const validPassword = await bcrypt.compare(data.password, user._document.data.value.mapValue.fields.password.stringValue)
                    if (validPassword) {


                        req.session.userName = data.email;

                        res.redirect('profile')
                    }
                }
                catch (err) {

                    console.log(err)
                    res.render('index', { msg: "wrong password" });
                }

            }
        }

        catch (err) {
            console.log(err)
            res.render('index', { msg: `No account associated with ${data.email} email` });

        }
    
   
});



app.get('/logout', cors(), (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});


app.get('/profile/edit', cors(), async(req,res) => {
    
    
    if (req.session.userName) {
        const user = await getDoc(doc(firebaseObj.db, 'Users', req.session.userName));
        
        const img = user._document.data.value.mapValue.fields.profilePicture.stringValue;
        const fname = user._document.data.value.mapValue.fields.fname.stringValue;
        const lname = user._document.data.value.mapValue.fields.lname.stringValue;
        const email = user._document.data.value.mapValue.fields.email.stringValue;
        const college= user._document.data.value.mapValue.fields.college.mapValue.fields;
        const social = user._document.data.value.mapValue.fields.socialMediaLinks.mapValue.fields;
        
       
      
        res.render('profile-edit', {img,fname, lname,email,social,college});
    }
    else {
        res.redirect('/')
    }
   
    
});

app.get('/profile', cors(), async (req, res) => {

    if (req.session.userName) {
        const user = await getDoc(doc(firebaseObj.db, 'Users', req.session.userName));
        const img = user._document.data.value.mapValue.fields.profilePicture.stringValue;
        const fname = user._document.data.value.mapValue.fields.fname.stringValue;
        const lname = user._document.data.value.mapValue.fields.lname.stringValue;
        const email = user._document.data.value.mapValue.fields.email.stringValue;
        const college= user._document.data.value.mapValue.fields.college.mapValue.fields;
        const social = user._document.data.value.mapValue.fields.socialMediaLinks.mapValue.fields;
        res.render('profile', { img,fname, lname,email,social,college});
    }
    else{
    
         res.redirect('/');
     
    }
    

});


app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})