const express = require('express');
const bodyParser = require('body-parser');
const fs = require('file-system');
const moment = require('moment');
moment().format();

var data = require('./data.json');

const application = express();

application.use(bodyParser.json());

application.get('/api/customer/items', (request, response) => {
    return response.status(200).json(data.items);
});

application.get('/api/vendor/purchases', (request, response) => {
    return response.status(200).json(data.purchases);
});

application.get('/api/vendor/money', (request, response) => {
    return response.status(200).json(data.money);
});

application.post('/api/vendor/items', (request, response) => {
    var description = request.body.description;
    var cost = request.body.cost;
    var quantity = request.body.quantity;

    // Create a new item based off the body information
    var newItem = {
        id: data.items.length + 1,
        description: description,
        cost: cost,
        quantity: quantity
    }

    // Conditional to check if the item has all the required fields
    // If database structure, the condition would be if there's an error based on what fields are required
    if (description && cost && quantity) {
        var addItem = data.items.push(newItem);

        var statusModel = {
            status: "success",
            data: addItem
        }

        // Stringify the new updated data and then write it to the JSON file
        var itemsJSON = JSON.stringify(data);
        fs.writeFile('./data.json', itemsJSON, function (err) { })
        return response.status(200).json(statusModel);
    } else {
        var statusModel = {
            status: "fail",
            data: newItem
        }
        return response.status(200).json(statusModel);
    }
});

application.put('/api/vendor/items/:itemId', (request, response) => {
    var description = request.body.description;
    var cost = request.body.cost;
    var quantity = request.body.quantity;
    var itemId = parseInt(request.params.itemId);

    // Model for updating an item based off the body information and route
    var updateItem = {
        id: itemId,
        description: description,
        cost: cost,
        quantity: quantity
    }

    // Conditional to check if the item has all the required fields
    // If database structure, the condition would be if there's an error based on what fields are required
    var itemIndex = data.items.findIndex(q => q.id == itemId);

    if (itemIndex != -1 && cost && quantity && description) {
        data.items[itemIndex] = updateItem;

        var statusModel = {
            status: "success",
            data: updateItem
        }

        // Stringify the new updated data and then write it to the JSON file
        var itemsJSON = JSON.stringify(data);
        fs.writeFile('./data.json', itemsJSON, function (err) { })
        response.json(statusModel);
    } else {

        var failedItem = {
            id: itemIndex,
            description: description,
            cost: cost,
            quantity: quantity
        }

        var statusModel = {
            status: "fail",
            data: failedItem
        }

        response.json(statusModel);
    }
});

application.post('/api/customer/items/:itemId/purchase', (request, response) => {
    var itemId = parseInt(request.params.itemId);
    var payment = parseInt(request.body.payment);
    var item = data.items.find(q => q.id === itemId);

    // another if statement to check if item exists
    if (item && item.quantity > 0) {

        if (item.cost > payment) {
            var statusModel = {
                status: "fail",
                data: {
                    amount_given: payment,
                    amount_needed: item.cost
                }
            }

            response.status(200).json(statusModel);
        } else if (item.cost === payment) {
            item.quantity -= 1;

            var purchase = {
                item_purchased: item.description,
                price: item.cost,
                date: moment().format("ddd, MMM Do YYYY, h:mm a")
            }

            data.purchases.push(purchase);
            data.money += item.cost;

            var statusModel = {
                status: "success",
                data: item.description + " vended, no change dispensed."
            }

            var itemsJSON = JSON.stringify(data);
            fs.writeFile('./data.json', itemsJSON, function (err) { })
            response.status(200).json(statusModel);

        } else if (payment > item.cost) {
            item.quantity -= 1;

            var purchase = {
                item_purchased: item.description,
                price: item.cost,
                date: moment().format("ddd, MMM Do YYYY, h:mm a")
            }

            data.purchases.push(purchase);
            data.money += item.cost;

            var change = payment - item.cost;

            var statusModel = {
                status: "success",
                data: item.description + " vended. " + change + " cents dispensed as change."
            }

            var itemsJSON = JSON.stringify(data);
            fs.writeFile('./data.json', itemsJSON, function (err) { })
            response.status(200).json(statusModel);
        }
    } else {
        var statusModel = {
            status: "fail",
            data: {
                information: "Item is unavailable"
            }
        }
        response.status(200).json(statusModel);
    }
});


application.listen(3000);

module.exports = application;