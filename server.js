const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

//log http layer using morgan logger middleware
app.use(morgan('common'));

BlogPosts.create("UCLA Job", "Front Dev Avaialbe", "UCLA Career Center");
BlogPosts.create("Greetings", "I'm an aspiring full stack dev", "Andrew");

//for app.get, is there a better way than to split it into two? 
//tried just having one w/ /:id but seems like the value is not "null" so it 
//doesn't function properly. gives a error 404
app.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

app.get('/:id', (req, res) => {
  res.json(BlogPosts.get(req.params.id));
});

//need to include content-type and application/json for key/value in headers
//portion of postman when sending post request
app.post('/', jsonParser, (req, res) => {
  const requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body `;
      console.log(message);
      res.status(400).send(message);
    }
  }

  const post = BlogPosts.create(
    req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).send(post);
});

app.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted post \`${req.params.id}\``);
  res.status(204).end();
});

app.put('/:id', jsonParser, (req,res) => {
  const requiredFields = ["title", "content", "author", "id"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.log(message);
      res.status(400).send(message);
    }
  }

  if (req.body.id !== req.params.id) {
    const message = `Request path id and request body id are not equal`;
    console.error(message);
    res.status(400).send(message);
  }

  console.log(`Updating shopping list item \`${req.params.id}\``)
  BlogPosts.update({
    "title": req.body.title,
    "content": req.body.content,
    "author": req.body.author,
    "id": req.body.id
  });
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });

