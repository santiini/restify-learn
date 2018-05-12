const ModelBase = require('./base');
const U = require('../lib/utils');

const Sequelize = U.rest.Sequelize;

module.exports = (sequelize) => {
  const Team = U._.extend(sequelize.define('team', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.type('string', 30),
      allowNull: true,
      set(val) { this.setDataValue('name', U.nt2space(val)); },
      validate: {
        len: [0, 30],
      },
      unique: 'advertiser',
    },
    status: {
      type: Sequelize.ENUM,
      values: ['enabled', 'disabled'],
      defaultValue: 'enabled',
      comment: '团队状态',
    },
    expiredAt: {
      type: Sequelize.DATE,
      comment: '团队的到期时间',
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
      comment: '创建者ID',
    },
  }, {
    comment: '团队表',
    freezeTableName: true,
    hooks: {},
    instanceMethods: {},
    classMethods: {},
  }), ModelBase, {
    includes: {
      creator: 'user',
      owner: 'user',
    },
    sort: {
      default: 'id',
      allow: ['id', 'updatedAt', 'createdAt'],
    },
    writableCols: [
      'name', 'status', 'expiredAt',
    ],
    editableCols: [
      'name', 'status', 'expiredAt',
    ],
    onlyAdminCols: [
      'status', 'expiredAt',
    ],
  });

  return Team;
};
