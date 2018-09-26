var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var cors = require('cors');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var GitHubStrategy = require('passport-github').Strategy;
var port = process.env.PORT || 3000;
var url = process.env.MONGOLAB_URI || process.env.MONGODB_URI;

app.use(session({secret: process.env.SESSIONS_SECRET, resave: false, saveUninitialized: false, store: new MongoStore({url: url})}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/dist'));

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://pinterestreplica.herokuapp.com/callback" 
  },
  function(accessToken, refreshToken, profile, cb) {
    if (profile) {
        user = profile;
        return cb(null, user);
    } else {
        return cb(null, false);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

mongoose.connect(url, { autoIndex: false }); 
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', ()=>{console.log('connection open!');});
var Image = mongoose.model('Image', {img: {data: Buffer, contentType: String, user: String, desc: String, likes: Number, userlikes: Array}});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./dist/index.html"));
});

app.get('/login', passport.authenticate('github')); /* once you authenticate => callback route */

app.get('/callback', passport.authenticate('github'), (req, res) => {
    res.redirect('/');
});

app.get('/isAuthenticated', (req, res)=>{
    req.isAuthenticated() ? res.send(true) : res.send(false);
});

app.post('/upload', upload.single('image'), (req, res)=>{
    var imageInstance = new Image();
    imageInstance.img.data = fs.readFileSync(req.file.path);
    imageInstance.img.contentType = 'image/png';
    imageInstance.img.user = req.user.username;
    imageInstance.img.desc = req.body.description;
    imageInstance.img.star = false;
    imageInstance.img.likes = 0;
    imageInstance.img.userlikes = [];
    imageInstance.save((err, product)=>{res.send('Upload successful!')});
});

app.get('/getusername', (req, res)=>{
    res.send(req.user.username);
});

app.get('/allpins', (req, res)=>{
    Image.find(function(err, images) {
        res.send(images);
    });
});

app.get('/mypins', (req, res)=>{
    Image.find({'img.user':req.user.username}, function(err, docs) {
        res.send(docs);
    }); 
});

app.post('/like', (req, res)=>{
    Image.findById(req.body.id, function(err, doc) {
        if (doc.img.userlikes.includes(req.user.username)) {
            doc.img.likes--;
            var index = doc.img.userlikes.indexOf(req.user.username);
            doc.img.userlikes.splice(index, 1);
            doc.save(function(err, updatedDoc) {
                Image.find(function(err, images) {
                    res.send(images);
                });
            });
        } else {
            doc.img.likes++;
            doc.img.userlikes.push(req.user.username);
            doc.save(function(err, updatedDoc) {
                Image.find(function(err, images) {
                    res.send(images);
                });
            });        
        }
    });
});

app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
}); 

app.listen(port, ()=>{
    console.log('App is listening at ' + port);
});