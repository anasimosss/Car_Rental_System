const { Model } = require('sequelize');

class BaseModel extends Model {
  get _id() {
    return this.getDataValue('id');
  }

  toJSON() {
    const values = this.get({ plain: true });
    values._id = values.id;
    return values;
  }
}

const jsonField = (DataTypes, fieldName, allowNull = true) => ({
  type: DataTypes.TEXT,
  allowNull,
  get() {
    const value = this.getDataValue(fieldName);
    if (value == null || typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  set(value) {
    this.setDataValue(
      fieldName,
      value == null ? null : typeof value === 'string' ? value : JSON.stringify(value)
    );
  },
});

module.exports = { BaseModel, jsonField };