process.env.NODE_ENV = 'test';
const expect = require('chai').expect
const request = require('supertest');
const chaiParam = require('chai-param').param;

// console.log(process.env.NODE_ENV)
const app = require('../app');
const conn = require('../db/index')

describe("Testing RestApi ", () => {
    let userId = '';
    let postId = '';
    let commentId = '';
    before((done) => {
        conn.connect()
        .then(() => done())
        .catch(done)
    });

    after((done) => {

        conn.dropDB()
        .then
        (() =>{
        
        conn.close()
        .then(() => done())
        .catch((err) => done(err))
        
        done()})
        .catch(done)

      });

    it('should register a new user', (done)=>{

        const newUser = {
            firstName: "matt",
            lastName: "pall",
            password: "password",
            email: "mattt@email.com" 
        }
        request(app)
        .post('/api/auth/register')
        .send(newUser)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            userId = body._id;

    
            expect(body).to.contain.property('_id')
            expect(body).to.contain.property('firstName')
            expect(body).to.contain.property('lastName')
            expect(body).to.contain.property('email')
            expect(body).to.contain.property('password')
            expect(body).to.contain.property('date')
            expect(body).to.contain.property('following')
            expect(body).to.contain.property('followers')
            expect(res.statusCode).to.equal(201);


            done();
        })
        .catch(done)
        
        
    })

    it('should fail to register a new user with empty fields', (done)=>{


        request(app)
        .post('/api/auth/register')
        .send({})
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;

    
            expect(body).to.contain.property('error')
            expect(body.error).to.be.equal('missing fields');
            expect(res.statusCode).to.equal(409);
    

            done();
        })
        .catch(done)
        
        
    })

    it('should return Email taken', (done)=>{

        const newUser = {
            firstName: "matt",
            lastName: "pall",
            password: "password",
            email: "mattt@email.com" 
        }
        request(app)
        .post('/api/auth/register')
        .send(newUser)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;

    
            expect(body).to.contain.property('error')
            expect(body.error).to.be.equal('Email taken');
            expect(res.statusCode).to.equal(409);
            

            done();
        })
        .catch(done)
        
        
    })



    it('should log in a user succefully', (done)=>{

        const user = {
            email: "mattt@email.com",
            password: "password"
        }

        request(app)
        .post('/api/auth/login')
        .send(user)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;

    
            expect(body.msg).to.be.equal('logged in')
            expect(res.statusCode).to.equal(200);
            expect(body).to.contain.property('msg')


            done();
        })
        .catch(done)
        
        
    })
    

    it('should return account not found', (done)=>{

        const user = {
            email: "mat@email.com",
            password: "password"
        }

        request(app)
        .post('/api/auth/login')
        .send(user)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;

    
            expect(body).to.contain.property('error')
            expect(body.error).to.be.equal('account no found')
            expect(res.statusCode).to.equal(404);
            

            done();
        })
        .catch(done)
        
        
    })

    it('should return wrong password', (done)=>{

        const user = {
            email: "mattt@email.com",
            password: "pasword"
        }

        request(app)
        .post('/api/auth/login')
        .send(user)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;


            expect(body).to.contain.property('error')
            expect(body.error).to.be.equal('wrong password')
            expect(res.statusCode).to.equal(400);


            done();
        })
        .catch(done)
        
        
    })

    it('should return a single user', (done)=>{

        request(app)
        .get(`/api/users/profile/${userId}`)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId)
            expect(body).to.contain.property('_id')
            expect(body).to.contain.property('firstName')
            expect(body).to.contain.property('lastName')
            expect(body).to.contain.property('email')
            expect(body).to.contain.property('password')
            expect(body).to.contain.property('date')
            expect(body).to.contain.property('following')
            expect(body).to.contain.property('followers')


            done();
        })
        .catch(done)
        
        
    })


    it('should update a single user', (done)=>{

        const user = {
            lastName: "mart",
            email: "matt@email.com" 
        }

        request(app)
        .put(`/api/users/profile/${userId}`)
        .send(user)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId)
            // expect(body).to.contain.property('msg');
            expect(res.statusCode).to.equal(200);
            // expect(body.msg).to.equal(200);



            done();
        })
        .catch(done)
        
        
    })

    it('should return the form is empty', (done)=>{


        request(app)
        .put(`/api/users/profile/${userId}`)
        .send({})
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId)
            expect(body).to.contain.property('error');
            expect(res.statusCode).to.equal(409);
            expect(body.error).to.be.equal("no empty fields")



            done();
        })
        .catch(done)
        
        
    })


    it('should delete a user', (done)=>{


        request(app)
        .delete(`/api/users/profile/${userId}`)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId)
            expect(body).to.contain.property('msg');
            expect(res.statusCode).to.equal(200);
            expect(body.msg).to.be.equal("user deleted")



            done();
        })
        .catch(done)
        
        
    })

    it('should create a new post', (done)=>{

        const post = {
            whoPosted: userId,
            title: "Looking for roommate!!",
            body: "I'm looking for new roommates asap"
    
        }

        request(app)
        .post(`/api/posts/post/${userId}`)
        .send(post)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;
            postId = body._id;
            expect(header).to.include(userId)
            expect(body).to.contain.property('_id');
            expect(body).to.contain.property('likes');
            expect(body).to.contain.property('whoPosted');
            expect(body).to.contain.property('title');
            expect(body).to.contain.property('body');
            expect(body).to.contain.property('date');
            expect(res.statusCode).to.equal(201);
            expect(body.body).to.be.equal(post.body);
            expect(body.title).to.be.equal(post.title);
            expect(body.whoPosted).to.be.equal(post.whoPosted);
            expect(body.comments).to.eql([]);
            expect(body.likes).to.eql([]);



            done();
        })
        .catch(done)
        
        
    })

    it('should return no empty post', (done)=>{


        request(app)
        .post(`/api/posts/post/${userId}`)
        .send()
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId);
            expect(body).to.contain.property('error');
            expect(body.error).to.equal("empty post");
            expect(res.statusCode).to.equal(409);
    
            done();
        })
        .catch(done)
        
        
    })

    it('should return no empty fields', (done)=>{

        
        const post = {
            whoPosted: userId,
            title: "Looking for roommate!!!",
            body: "I'm looking for new roommates in UH campus area "
    
        }
        request(app)
        .put(`/api/posts/post/61a01f6def34871efb50ae14/${postId}`)
        .send(post)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.not.include(userId);
            expect(body).to.contain.property('error');
            expect(body.error).to.equal("Dont have permission to edit this post");
            expect(res.statusCode).to.equal(403);
    
            done();
        })
        .catch(done)
        
        
    })

    it('should return post no found due to invalid postId', (done)=>{

        const post = {
            whoPosted: userId,
            title: "Looking for roommate!!!",
            body: "I'm looking for new roommates in UH campus area "
    
        }
        request(app)
        .put(`/api/posts/post/${userId}/61a01f6def34871efb50ae14`)
        .send(post)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId);
            expect(body).to.contain.property('error');
            expect(body.error).to.equal("post not found");
            expect(res.statusCode).to.equal(404);
    
            done();
        })
        .catch(done)
        
        
    })


    it('should update a given post', (done)=>{

        const post = {
            whoPosted: userId,
            title: "Looking for roommate!!!",
            body: "I'm looking for new roommates in UH campus area "
    
        }

        request(app)
        .put(`/api/posts/post/${userId}/${postId}`)
        .send(post)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId)
            expect(header).to.include(postId)
            expect(body).to.contain.property('_id');
            expect(body).to.contain.property('likes');
            expect(body).to.contain.property('whoPosted');
            expect(body).to.contain.property('title');
            expect(body).to.contain.property('body');
            expect(body).to.contain.property('date');
            expect(body).to.contain.property('createdAt');
            expect(body).to.contain.property('updatedAt');
            expect(res.statusCode).to.equal(201);
            expect(body.body).to.be.equal(post.body);
            expect(body.title).to.be.equal(post.title);
            expect(body.whoPosted).to.be.equal(post.whoPosted);
            expect(body.comments).to.eql([]);
            expect(body.likes).to.eql([]);



            done();
        })
        .catch(done)
        
        
    })

    
    it('should return dont have permission to delete a post', (done)=>{
        
        request(app)
        .delete(`/api/posts/post/61a01f6def34871efb50ae14/${postId}`)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;
            
            expect(header).to.not.include(userId)
            expect(header).to.include(postId)
            expect(body).to.contain.property('error');
            expect(body.error).to.be.equal("Dont have permission to delete this post");
            expect(res.statusCode).to.equal(403);
            
            
            
            
            done();
        })
        .catch(done)
        
        
    })
    
    it('should delete a given post', (done)=>{

        request(app)
        .delete(`/api/posts/post/${userId}/${postId}`)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId)
            expect(header).to.include(postId)
            expect(body).to.contain.property('msg');
            expect(body.msg).to.be.equal("post deleted");
            expect(res.statusCode).to.equal(200);
            



            done();
        })
        .catch(done)
        
        
    })

    it('shoudl return post no found due to being deleted', (done)=>{

        request(app)
        .delete(`/api/posts/post/${userId}/${postId}`)
        .set('Accept', 'application/json')
        .buffer(true)
        .expect('Content-Type', /json/)
        .then((res)=>{
            const body = res.body;
            const header= res.req._header;

            expect(header).to.include(userId)
            expect(header).to.include(postId)
            expect(body).to.contain.property('error');
            expect(body.error).to.be.equal("post not found");
            expect(res.statusCode).to.equal(404);
            



            done();
        })
        .catch(done)
        
        
    })
});