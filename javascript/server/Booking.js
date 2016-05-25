function Booking(db) {
    var defaultGetParams = [
        { field: 'booker', operator: 'IS NOT NULL' },
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


    this.getBookedByOwner = function (req, res) {
        get(res, [{ field: 'owner', operator: '=', value: req.params.owner }]);
    };

    this.getBookedByBooker = function (req, res) {
        get(res, [{ field: 'booker', operator: '=', value: req.params.booker }]);
    };

    this.book = function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        // check if in db
        db.select([{ field: 'uuid', operator: '=', value: req.params.uuid }], {})
            .then(
                function(result) {
                    if(result.length == 0) { // send 404 if not in db
                        res.status(404).send({ message: 'offer for parking space not found' });
                    } else if(result.booker) { // if already booked 409
                        res.status(409).send({ message: 'offer for parking space has been booked and is not available any more' });
                    } else { // update
                        db.update(
                            Object.assign(
                                req.body, { uuid: req.params.uuid })
                            )
                            .then(
                                function() { res.send({ message: 'okay' }); },
                                function() { res.status(500).send({ message: 'error' }); }
                            );
                    }
                }
            );
    };

    this.revoke = function(req, res) {
        res.setHeader('Content-Type', 'application/json');

        // check if in db
        db.select([{ field: 'uuid', operator: '=', value: req.params.uuid }], {})
            .then(
                function(result) {

                    if(result.length == 0) { // send 404 if not in db
                        res.status(404).send({ message: 'offer for parking space not found' });
                    } else if(!result.booker) { // if already booked 409
                        res.status(409).send({ message: 'offer for parking space was already available' });
                    } else { // update
                        db.update(
                            Object.assign(
                                req.body,
                                {
                                    uuid: req.params.uuid,
                                    booker: null,
                                    booked: null
                                })
                        )
                        .then(
                            function() { res.send({ message: 'okay' }); },
                            function() { res.status(500).send({ message: 'error' }); }
                        );
                    }
                }
            );
    };

    this.deleteBookedByUuid = function(req, res) {
        res.setHeader('Content-Type', 'application/json');

        // check if in db
        db.select([{ field: 'uuid', operator: '=', value: req.params.uuid }], {})
        .then(
            function(result) {
                if(result.length == 0) { // send 404 if not in db
                    res.status(404).send({ message: 'offer for parking space not found' });
                } else if(!result.booker) { // if already booked 409
                    res.status(409).send({ message: 'offer for parking space is not booked anymore, please delete via deleteAvailable' });
                } else { // delete it
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

module.exports = Booking;