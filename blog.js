var bodyParser = require("body-parser"),
	expressSanitizer = require("express-sanitizer"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose"),
	express = require("express"),
    app = express();
	
mongoose.connect("mongodb://localhost/restfulblog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {
		type: Date, 
		default: Date.now
	}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "test blog",
// 	image:"https://images.unsplash.com/photo-1559892503-1e0c679cd4bd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body:"Mussum Ipsum, cacilds vidis litro abertis. Interagi no mé, cursus quis, vehicula ac nisi. Paisis, filhis, espiritis santis. Posuere libero varius. Nullam a nisl ut ante blandit hendrerit. Aenean sit amet nisi. Nec orci ornare consequat. Praesent lacinia ultrices consectetur. Sed non ipsum felis."
// });

// Restful Routes
app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("error!");
		} else{
			res.render("index", {blogs: blogs});
		}
	});
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});


app.post("/blogs", function(req, res){
	// console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// console.log(req.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else{
			res.redirect("/blogs");
		}
	});
});


app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirec("/blogs");
		} else{
			res.render("show", {blog: foundBlog});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('edit', {blog: foundBlog});
		}
	});
});


app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate({useFindAndModify: false}, req.params.id, req.body.blog, function(err, UpdatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs" + req.params.id);
		}
	});
});


app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/blogs");
		}
	});
});


app.listen(3000, process.env.PORT, process.env.IP, function(){
	console.log("Blog server on!!!!");
});
	