module.exports = function Route(app, server) {
    var mongoose = require('mongoose');
    
    mongoose.connect('mongodb://localhost/panda_dashboard');
    mongoose.Promise = global.Promise;
    var PandaSchema = new mongoose.Schema({
        name: String,
        age: Number
       })
    
    mongoose.model('Panda', PandaSchema);
    var Panda = mongoose.model('Panda')

    app.get('/', function (req, res) {
        if (Panda == undefined) {
            res.render('index');
        }
        else {
            Panda.find({}, function (err, results) {
                if (err) {
                    console.log(err);
                }
                res.render('index', { pandas: results });
            })
        }
    });

    app.get('/pandas/new', function(req, res){
        res.render('new');
    });


    app.post('/pandas', function (req, res) {
        // console.log("POST DATA", req.body);
        var panda = new Panda({ name: req.body.name, age: req.body.age });
        panda.save(function (err) {
            if (err) {
                console.log('something went wrong in add panda');
            } else {
                console.log('successfully added a panda!');
                res.redirect('/');
            }
        });
    });

    app.get('/pandas/edit/:id', function(req, res){
        // console.log(req.params.id);
        res.render('edit', { id: req.params.id });
    });

    app.post('/pandas/:id', function(req, res){
        // console.log("Edit submission works!")
        Panda.update({_id: req.params.id}, {name: req.body.name, age: req.body.age}, function(err){
            if(err){
                console.log("something went wrong in edit panda");
            }
            else{
                console.log('successfully edited a panda!');
                res.redirect('/');
            }
        });
    });

    app.get('/pandas/destroy/:id', function (req, res){
        Panda.remove({_id: req.params.id}, function(err){
            if(err){
                console.log("Did not delete record!");
            }
            else{
                console.log("Successfully deleted Panda");
                res.redirect('/');
            }
        })
    });
};