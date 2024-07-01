'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.hasMany(models.Rating, { foreignKey: 'bookId', as: 'ratings' });
    }
  }
  Book.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    ISBN: DataTypes.STRING,
    publicationYear: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
