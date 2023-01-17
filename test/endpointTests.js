const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js'); // import your express app
chai.should();
chai.use(chaiHttp);

let id;
let token;
describe('API endpoint testing', () => {

    describe('/', () => {
        it('Should get all todos', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done()
                });
        })
    })

    describe('/login', () => {

        it ('Should return an unauthorized status when logging user in with wrong credentials', (done) => {
            chai.request(server)
                .post('/login')
                .send({username: 'User100', password: 'Password100'})
                .end((err, res) => {
                    res.should.have.status(401);
                    done()
                });
        })

        it ('Should get user authentication (id and token)', (done) => {
            chai.request(server)
                .post('/login')
                .send({username: 'User1', password: 'Password1'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('token');
                    id = res.body.id;
                    token = res.body.token;
                    done()
                });
        })

        describe('/user', () => {
            it('Should get user todo items', (done) => {
                chai.request(server)
                    .post('/user')
                    .send({id: id})
                    .set({"Authorization": `Bearer ${token}`})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body[0].should.have.property('id');
                        res.body[0].should.have.property('title');
                        res.body[0].should.have.property('completed');
                        res.body[0].should.have.property('userID');
                        res.body[0].should.have.property('createdAt');
                        res.body[0].should.have.property('updatedAt');
                        done()
                    });
            })

            it('Should get an unauthorized error when requesting todo items without a valid token', (done) => {
                chai.request(server)
                    .post('/user')
                    .send({id: id})
                    .set({"Authorization": `Bearer ${null}`})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done()
                    });
            })
        })

        describe('/', () => {
            it('Should create a new todo item', (done) => {
                chai.request(server)
                    .post('/')
                    .send({
                        "title": "Jaluta koeraga ",
                        "completed": "Ei ole ",
                        "userID": 1
                    })
                    .set({ "Authorization": `Bearer ${token}`})
                    .end((err, res) => {
                        res.should.have.status(201);
                        done()
                    });
            })
            it('Should get an unauthorized error when requesting creation of a new todo item without a valid token', (done) => {
                chai.request(server)
                    .post('/')
                    .send({
                        "title": "Jaluta koeraga ",
                        "completed": "Ei ole ",
                        "userID": 1
                    })
                    .set({ "Authorization": `Bearer ${null}`})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done()
                    });
            })
        })

        describe('/{id}', () => {
            it('Should edit a todo item', (done) => {
                chai.request(server)
                    .put(`/${id}`)
                    .send({
                        "title": "Jaluta koeraga ",
                        "completed": "Jah",
                        "userID": 1
                    })
                    .set({ "Authorization": `Bearer ${token}`})
                    .end((err, res) => {
                        res.should.have.status(202);
                        done()
                    });
            })
            it('Should get an unauthorized error when requesting edit of a todo item without a valid token', (done) => {
                chai.request(server)
                    .put(`/${id}`)
                    .send({
                        "title": "Jaluta koeraga ",
                        "completed": "Ei ole ",
                        "userID": 1
                    })
                    .set({ "Authorization": `Bearer ${null}`})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done()
                    });
            })

            it('Should delete a todo item', (done) => {
                chai.request(server)
                    .delete(`/${id}`)
                    .set({ "Authorization": `Bearer ${token}`})
                    .end((err, res) => {
                        res.should.have.status(202);
                        done()
                    });
            })
            it('Should get an unauthorized error when requesting delete of a todo item without a valid token', (done) => {
                chai.request(server)
                    .delete(`/${id}`)
                    .set({ "Authorization": `Bearer ${null}`})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done()
                    });
            })
        })

        describe('/logs', () => {
            it('Should get logs from the server', (done) => {
                chai.request(server)
                    .get('/logs')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        done()
                    });
            })
        })
    })
})

