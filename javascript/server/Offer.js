const uuid = require('node-uuid');

function Offer(db) {

    this.getAllAvailable = function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        db.get(
            [
                { field: 'booker', operator: 'IS NULL' },
                { field: 'available', operator: '>', value: (new Date().getTime()) - 86400000 }
            ],
            { field: 'available', 'direction': 'ASC' }
        ).then(
            function(result) { res.send(result); },
            function() { res.status(500).send({ message: 'error' }); }
        );
    };
    
    this.addAvailable = function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        db.insert(
            Object.assign(
                req.body,
                {
                    uuid: uuid.v4(),
                    booker: null,
                    booked: null,
                    created: new Date().getTime(),
                    updated: new Date().getTime()
                })
        ).then(
            function() { res.send({ message: 'okay' }); },
            function() { res.status(409).send({ message: 'offer for parking space at selected date already exists' }); }
        );
    };

}

module.exports = Offer;