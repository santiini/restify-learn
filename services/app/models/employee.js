const U = require('../lib/utils');
const ModelBase = require('./base');

const Sequelize = U.rest.Sequelize;

module.exports = (sequelize) => {
  const Employee = U._.extend(sequelize.define('employee', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      unique: 'team',
    },
    userId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      unique: 'team',
    },
    role: {
      type: Sequelize.ENUM,
      values: ['member', 'analysts', 'admin'],
      allowNull: false,
      defaultValue: 'member',
    },
    isDelete: {
      type: Sequelize.ENUM,
      values: ['yes', 'no'],
      defaultValue: 'no',
      allowNull: false,
      comment: '是否被删除',
    },
    creatorId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
  }, {
    comment: '组织雇员表',
    freezeTableName: true,
    hooks: {},
    instanceMethods: {},
    classMethods: {},
  }), ModelBase, {
    includes: {
      team: 'team',
      user: 'user',
      creator: 'user',
    },
    sort: {
      default: 'id',
      allow: ['id', 'updatedAt', 'createdAt'],
    },
    unique: ['userId', 'teamId'],
    writableCols: ['teamId', 'userId', 'role'],
    editableCols: ['role'],
  });

  return Employee;
};
