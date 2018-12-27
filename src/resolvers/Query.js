const { forwardTo } = require("prisma-binding");

// item: responsible to display single item.
// TODO: custom resolver to send error to frontend if no single item found

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  // itemsConnection exposes aggregate data to frontend.
  // Here to enable pagination
  itemsConnection: forwardTo("db")
  // async items(parent, args, ctx, info) {
  // const items = await ctx.db.query.items()
  // return items
  // }
};

module.exports = Query;
