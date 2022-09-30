const Events = require("../models/models");
const ApiError = require("../error/ApiError");
const EditDefault = require('./editDefault')
const uuid = require("uuid");
const path = require('path')
const fs = require('fs')

class EventsController {
    async getAll(req, res, next) {
        await Events.findAll().then(e => {
            return res.json(e);
        }).catch(err => {
            console.log(err)
            return next(ApiError.internal(err))
        });
    }

    async createEvent(req, res, next) {

        if (!req.files) return next(ApiError.badRequest('Не заполенено поле img'))

        const {img} = req.files
        const fileName = uuid.v4() + ".jpg"
        img.mv(path.resolve(__dirname, '..', 'static', fileName)).catch(e => next(ApiError.internal(e)))

        await Events.create({
            name: req.body.name,
            description: req.body.description,
            ref_video: req.body.ref_video,
            ref_buy: req.body.ref_buy,
            price: req.body.price,
            img: fileName
        }).then(data => {
            return res.json({message: 'Мероприятие добавлено'})
        }).catch(e => {
            console.log(e)
            return next(ApiError.badRequest('Не заполенены все поля'))
        })
    }

    async editEvent(req, res, next) {

        const arr = req.body
        const img = req.files

        if (!arr['id']) return next(ApiError.badRequest('id не задан'))
        if (img) {
            const fileName = uuid.v4() + '.jpg'
            arr['img'] = fileName

            await Events.findOne({where: {id: arr['id']}}).then(async data => {
                if (data !== null) {
                    await fs.unlink(`../events/static/${data.img}`, err => console.log(err))
                    await img.img.mv(path.resolve(__dirname, '..', 'static', fileName)).catch(e => {
                        return next(ApiError.internal())
                    })
                } else return next(ApiError.badRequest('Нет ивента с таким id'))
            }).catch(e => {
                return next(ApiError.internal(e))
            })

            return EditDefault(res, req, next, arr)
        }
        else {
            return EditDefault(res, req, next, arr)
        }

    }


    async deleteEvents(req, res, next) {
        const {id} = req.body

        await Events.destroy({where: {id: id}}).then(data => {
            return res.json({message: `Мероприятие с номером ${id} удалено успешно`})
        }).catch(err => {
            console.log(err)
            return next(ApiError.badRequest('Мероприятия с таким номером не существует'))
        })
    }
}

module.exports = new EventsController()