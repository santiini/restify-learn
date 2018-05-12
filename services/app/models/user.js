const U = require('../lib/utils');
const ModelBase = require('./base');
const config = require('../configs');

const Sequelize = U.rest.Sequelize;
const AVATAR_ROOT = config.avatar.uri;
const AVATAR_PATH = config.avatar.path;

module.exports = (sequelize) => {
  const User = U._.extend(sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.type('string', 30),
      allowNull: false,
      set(val) {
        this.setDataValue('name', U.nt2space(val));
      },
      validate: {
        len: [2, 30],
      },
    },
    avatar: {
      type: Sequelize.type('string', 255),
      allowNull: true,
      validate: {
        len: [1, 255],
      },
      get() {
        if (!this.getDataValue('avatar')) return null;
        return `${AVATAR_ROOT}/${this.getDataValue('avatar')}`;
      },
      set(val) {
        const image = U.decodeBase64Image(val);
        if (!image) return;
        const value = User.avatarPath(`${this.id}_${U.randStr(10)}`, image.type);
        const origFile = `${AVATAR_PATH}/${this.getDataValue('avatar')}`;
        if (U.fs.existsSync(origFile)) U.fs.unlinkSync(origFile);
        const filepath = `${AVATAR_PATH}/${value}`;
        U.mkdirp(U.path.dirname(filepath));
        U.fs.writeFileSync(filepath, image.data);
        this.setDataValue('avatar', value);
      },
      comment: '用户头像',
    },
    email: {
      type: Sequelize.type('string', 100),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
      comment: '用户email地址',
    },
    qq: {
      type: Sequelize.type('string', 20),
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumber: true,
      },
      comment: '用户qq号码',
    },
    wechat: {
      type: Sequelize.type('string', 30),
      allowNull: true,
      defaultValue: null,
      validate: {
        isNumber: true,
      },
      comment: '用户微信账号',
    },
    role: {
      type: Sequelize.ENUM,
      values: ['admin', 'member'],
      defaultValue: 'member',
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      values: ['disabled', 'enabled'],
      defaultValue: 'enabled',
      allowNull: false,
      comment: '是否可用',
    },
    language: {
      type: Sequelize.STRING,
      defaultValue: 'zh',
      allowNull: false,
      comment: '当前用户的语言设置',
    },
    isDelete: {
      type: Sequelize.ENUM,
      values: ['yes', 'no'],
      defaultValue: 'no',
      allowNull: false,
      comment: '是否被删除',
    },
  }, {
    comment: '系统用户表',
    freezeTableName: true,
    hooks: {},

    instanceMethods: {
    },

    classMethods: {
      /** 计算头像路径 */
      avatarPath: (id, type) => {
        const t = type.split('/');
        const md5str = U.md5(id);
        return [
          'users',
          md5str.substr(0, 2),
          md5str.substr(2, 3),
          `${id}.${t[1] || t}`,
        ].join('/');
      },

      findByEmail(email) {
        return this.findOne({ where: { email } });
      },
    },

  }), ModelBase, {
    unique: ['email'],
    sort: {
      default: 'createdAt',
      allow: ['name', 'updatedAt', 'createdAt'],
    },
    writableCols: [
      'email', 'name', 'role',
      'status', 'avatar',
    ],
    editableCols: [
      'name', 'role', 'status', 'avatar',
    ],
    /** 只有管理员才可以修改的字段 */
    onlyAdminCols: ['role', 'status'],

    /** 定义允许包含返回的字段，不设置为全部 */
    allowIncludeCols: [
      'name', 'role', 'status', 'isDelete',
      'createdAt', 'avatar', 'email',
      'language',
    ],
  });

  return User;
};
