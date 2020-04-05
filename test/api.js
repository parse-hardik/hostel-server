const request = require('supertest');
const server = require('../server');
const expect = require('chai').expect;

describe('Login API', function(){
    it('Should access if the credentials are true', function(done){
        request(server)
        .post('/signIn')
        .set('Accept', "application/json")
        .set('Content-Type', 'application/json')
        .send({username: 'kriti', password: 'kriti'})
        .expect(200)
        .expect('Content-Type',/json/)
        .expect(function(res){
            expect(res.body).not.to.be.empty;
            expect(res.body).to.be.an('object')
        })
        .end(done);
    })

})