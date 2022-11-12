const Thing = require('../models/thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    thing.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getOne = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
        res.status(200).json(thing);
        }
    ).catch(
        (error) => {
        res.status(404).json({
            error: error
        });
        }
    );
};

exports.modifyOne = (req, res, next) => {
    const thing = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    Thing.updateOne({_id: req.params.id}, thing).then(
        () => {
        res.status(201).json({
            message: 'Thing updated successfully!'
        });
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};

exports.deleteOne = (req, res, next) => {
    Thing.findOne({_id: req.params.id})
        .then(thing => {
            if( thing.userId !== req.auth.userId) {
                res.status(400).json({ message: 'Not authorized'});
            }
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id})
                    .then(() => { res.status(200).json({ message: 'Objet deleted'})})
                    .catch(error => res.status(401).json({ error }));
            });
        })
        .catch(error => res.status(401).json({ error }));
};

exports.getAll = (req, res, next) => {
    Thing.find().then(
        (things) => {
        res.status(200).json(things);
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
};