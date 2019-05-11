
export default (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    uuid: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });
  };

  return Team;
};
