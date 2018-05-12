module.exports = (Models) => {
   /** 每个雇员唯一属于一个授权账号 */
  Models.employee.belongsTo(Models.team);

  /** 每个雇员唯一属于一个用户 */
  Models.employee.belongsTo(Models.user);
  Models.employee.belongsTo(Models.user, {
    as: 'creator',
    foreignKey: 'creatorId',
  });

  Models.team.belongsTo(Models.user, {
    as: 'creator',
    foreignKey: 'creatorId',
  });
};
