const request = require('supertest')
// superTest 모듈
const should = require('should')
// should 모듈

const app = require('./index')
// index.js 모듈

describe('GET /users는', () => {
    describe('성공시', () => {
        it('유저 객체를 담은 배열로 응답함', (done) => {
            request(app)
                .get('/users')
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array)
                    done()
                })
        })
        it('최대 limit 갯수만큼 응답한다', (done) => {
            request(app)
                .get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.have.lengthOf(2)
                    done()
                })
        })
    })
    describe('실패시', () => {
        it('limit이 숫자형이 아니면 400을 응답한다', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done)
        })
    })
})
describe('GET /users/:id는', () => {
    describe('성공시', () => {
        it('id가 1인 유저 객체를 반환한다.', (done) => {
            request(app)
                .get('/users/1')
                .end((err, res) => {
                    res.body.should.have.property('id', 1)
                    done()
                })
        })
    })
    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done)
        })
        it('id로 유저를 찾을수 없을 경우 404로 응답한다', (done) => {
            request(app)
                .get('/users/999')
                .expect(404)
                .end(done)
        })
    })
})
describe('DELETE /users/:id', () => {
    describe('성공시', () => {
        it('204를 응답한다.', (done) => {
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done)
        })
    })
    describe('실패시', () => {
        it('400을 응답한다.', (done) => {
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done)
        })
    })
})
describe('POST /users', () => {
    describe('성공시', () => {
        let name = 'daniel',
            body
        before(done => {
          request(app)
            .post('/users')
            .send({name})
            .expect(201)
            .end((err, res) => {
                body = res.body
                done()
            })
        })
        it('생성된 유저 객체를 반환한다', () => {
            body.should.have.property('id')
        })
        it('입력한 name을 반환한다', () => {
            body.should.have.property('name', name)
        })
    })
    describe('실패시', () => {
        it('name 파라메터 누락시 400을 반환한다', done => {
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done)
        })
        it('name이 중복일 경우 409를 반환한다.', done => {
            request(app)
                .post('/users')
                .send({name: 'daniel'})
                .expect(409)
                .end(done)
        })
    })
})
describe('PUT /users/:id', () => {
    describe('성공시', () => {
        it('변경된 name을 응답한다.', (done) => {
            const name = 'chally'
            request(app)
                .put('/users/3')
                .send({name})
                .end((err, res) => {
                    res.body.should.have.property('name',name)
                    done()
                })
        })
    })
})