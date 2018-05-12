const U = require('../lib/utils');
const ModelBase = require('./base');

const Sequelize = U.rest.Sequelize;

module.exports = (sequelize) => {
  const Config = U._.extend(sequelize.define('config', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: {
      type: Sequelize.INTEGER.UNSIGNED,
      defaultValue: 0,
      unique: 'team',
    },
    key: {
      type: Sequelize.ENUM,
      values: ['blackKeyword', 'switchs'],
      allowNull: false,
      unique: 'team',
    },
    value: {
      type: Sequelize.STRING,
      unique: 'team',
    },
    creatorId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    isDelete: {
      type: Sequelize.ENUM,
      values: ['yes', 'no'],
      defaultValue: 'no',
      comment: '是否被删除',
    },
  }, {
    comment: '配置信息表',
    freezeTableName: true,
    hooks: {},
    instanceMethods: {},
    classMethods: {},
  }), ModelBase, {
    sort: {
      default: 'id',
      allow: ['id', 'updatedAt', 'createdAt'],
    },
    unique: ['teamId', 'key', 'value'],
    writableCols: ['teamId', 'key', 'value'],
    editableCols: ['value'],
  });

  return Config;
};
