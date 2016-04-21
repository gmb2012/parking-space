const uuid = require('node-uuid');

function Offer(db) {
    var defaultGetParams = [
        { field: 'booker', operator: 'IS NULL' },
        { field: 'available', operator: '>', value: (new Date().getTime()) - 86400000 }
    ];

    var defaultSort = { field: 'available', 'direction': 'ASC' };


    var get = function(res, filtersToAdd) {
        res.setHeader('Content-Type', 'application/json');

        db.select(defaultGetParams.concat(filtersToAdd), defaultSort)
        .then(
            function(result) { res.send(result); },
            function() { res.status(500).send({ message: 'error' }); }
        );
    };


    this.getAvailableByOwner = function (req, res) {
        get(res, [{ field: 'owner', operator: '=', value: req.params.owner }]);
    };

    this.getAllAvailable = function (req, res) {
        get(res, []);
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

    this.deleteAvailableByUuid = function(req, res) {
        res.setHeader('Content-Type', 'application/json');

        // check if in db
        db.select([{ field: 'uuid', operator: '=', value: req.params.uuid }], {})
        .then(
            function(result) {
                // send 404 if not in db
                if(result.length == 0) {
                    res.status(404).send({ message: 'offer for parking space not found' });
                // if already booked 409
                } else if(result.booker) {
                    res.status(409).send({ message: 'offer for parking space has been booked and is not deletable any more' });
                // delete it
                } else {
                    db.delete([{ field: 'uuid', operator: '=', value: req.params.uuid }])
                    .then(
                        function() { res.send({ message: 'okay' }); },
                        function() { res.status(500).send({ message: 'error' }); }
                    );
                }
            }


        );
    };
}

module.exports = Offer;