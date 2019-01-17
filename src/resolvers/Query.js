const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  // forwardTo exposes aggregate data to frontend.
  items: forwardTo("db"),
  item: forwardTo("db"),
  // Here to enable pagination
  itemsConnection: forwardTo("db"),
  // es6 syntax - me: function(parent...)
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // check if logged in
    if (!ctx.request.userId) {
      throw new Error("Please log in to continue");
    }
    // check if user has permissions to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    // if they do, query all the users
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error("You aren't logged in");
    }
    // query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );
    // check if they have the permissions to see this order
    const ownsOrder = (order.user.id = ctx.request.userId);
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("Not authorized");
    }
    // return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in.");
    }
    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId }
        }
      },
      info
    );
  }
};

module.exports = Query;
