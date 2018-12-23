const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  }
};

module.exports = Mutations;
