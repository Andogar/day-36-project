const request = require("supertest");
const assert = require("assert");
const application = require('./server.js');

describe("Get a list of items", function () {
    it("Should return a list of all the items", function (done) {
        request(application)
            .get("/api/customer/items")
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(done);
    })
})

describe("Get a list of purchases", function () {
    it("Should return a list of all purchases", function (done) {
        request(application)
            .get("/api/vendor/purchases")
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(done);
    })
})

describe("Get vendor money route", function () {
    it("Should return vendor money", function (done) {
        request(application)
            .get("/api/vendor/money")
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .end(done);
    })
})

describe("Post a new item", function () {
    it("Should pass with all items", function (done) {
        request(application)
            .post("/api/vendor/items")
            .send({ description: "oreos", cost: 100, quantity: 5 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })

    it("Should fail with missing items", function (done) {
        request(application)
            .post("/api/vendor/items")
            .send({ description: "oreos", quantity: 5 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })
})

describe("Update an item", function () {
    it("Should pass with all items", function (done) {
        request(application)
            .put("/api/vendor/items/3")
            .send({ description: "Wavy Lays", cost: 100, quantity: 3 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })

    it("Should fail with missing items", function (done) {
        request(application)
            .put("/api/vendor/items/1")
            .send({ description: "oreos", quantity: 5 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })
})

describe("Purchasing an item", function () {
    it("Should pass with exact amount", function (done) {
        request(application)
            .post("/api/customer/items/1/purchase")
            .send({ payment: 100 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })

    it("Should pass and give change with more than amount", function (done) {
        request(application)
            .post("/api/customer/items/1/purchase")
            .send({ payment: 125 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "success");
            })
            .end(done);
    })

    it("Should fail with less than cost", function (done) {
        request(application)
            .post("/api/customer/items/1/purchase")
            .send({ payment: 75 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail with no quantity", function (done) {
        request(application)
            .post("/api/customer/items/2/purchase")
            .send({ payment: 100 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })

    it("Should fail with no item existing", function (done) {
        request(application)
            .post("/api/customer/items/500/purchase")
            .send({ payment: 100 })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {
                assert.equal(response.body['status'], "fail");
            })
            .end(done);
    })
})