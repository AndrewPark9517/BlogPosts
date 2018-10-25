const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHTTP);

describe("Blog Post", function() {

    //make sure to run server before tests
    before(function() {
        return runServer();
    });

    //make sure to close server after
    after(function() {
        return closeServer();
    });

    // test strategy: 
    // 1. Make request to '/'
    // 2. check received file and file body
    // 3. make sure all keys are included in each post
    it('Should list posts on GET', function() {
        return chai
        .request(app)
        .get('/')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);

            const expectedKeys = ['title', 'content', 'author'];
            res.body.forEach(function(post) {
                expect(post).to.be.a('object');
                expect(post).to.include.keys(expectedKeys);
            });
        });
    });

    // test strategy: 
    // 1. create new post w/ title, content author
    // 2. send it to POST and grab the returned post object
    // 3. returned post should deep equal the given object 
    //    after the id/publishDate from the return object has been added to the initial object
    //    Assumes a publish Date has not been manually inputted
    it('Should create new blog post on POST', function() {
      const post= {
          title: "Welcome to UCLA",
          content: "All freshman are welcome to the Dining Halls",
          author: "UCLA"
      };

    return chai
        .request(app)
        .post('/')
        .send(post)
        .then(function(res) {
          console.log("post: ", post);
          console.log("res: ", res.body);
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('title', 'content', 'author', 'id', 'publishDate');
          expect(res.body.id).to.not.equal(null);

          //created post should equal given post once id/publishDate has been added to given post
          expect(res.body).to.deep.equal(Object.assign(post, {id: res.body.id, publishDate: res.body.publishDate})
          );
        });
    });

    // test strategy: 
    // need to test res, res.body, make sure has all keys, make sure the id's are the same
    // 1. make new post to pass 
    // 2. make a get call to grab id of one of the given posts from local memory 
    // 3. make a put request with new post to that same id
    // 4. make sure new post has correct keys with the same id as before
    it('Should update blog post on PUT', function() {
      const post = {
        title: "Welcome to UCLA",
        content: "All freshman are welcome to the Dining Halls",
        author: "UCLA"
      };

      /*
      //grab id of post to update
      chai.request(app).get('/')
      .then(function(res) {
        post.id = res.body[0].id;
      });

      return chai
      .request(app)
      .put(`/${post.id}`)
      .send(post)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(
          Object.assign(post, {publishDate: res.body.publishDate})
        );
      });
      */

      return chai
      .request(app)
      .get('/')
      .then(function(res) {
        // transfer id/publishDate of first post from get to the new post
        post.id = res.body[0].id;
        post.publishDate = res.body[0].publishDate;

        // send new post to PUT
        return chai
        .request(app)
        .put(`/${post.id}`)
        .send(post)
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.deep.equal(post);
      });
    });
    
    // test strategy:
    // 1. make a get request and grab id of the first post
    // 2. send a delete request for that id
    // 3. check status code to make sure it's been done
    it('Should delete post on DELETE', function() {
      return chai
      .request(app)
      .get('/')
      .then(function(res) {
      // delete first post from received list
        return chai.request(app).delete(`/${res.body[0].id}`)
      })
      // check status
      .then(function(res) {
        expect(res).to.have.status(204);
      });
    });
})
