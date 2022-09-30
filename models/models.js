const seq = require('../db')
const {DataTypes} = require('sequelize')

const Events = seq.define("events", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ref_video: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ref_buy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

});

module.exports = Events