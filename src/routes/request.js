const express = require("express");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connection-request");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id.toString();

      //    only allowed status request acknowledged
      const allowedStatus = new Set(["ignored", "interested"]);
      if (!allowedStatus.has(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      //   valid toUserID check
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      //   Checking previous requests
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { toUserId, fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequestModel({
        toUserId,
        fromUserId,
        status,
      });

      //connection request to yourself not allowed and handled in schema pre function
      const data = await connectionRequest.save();
      res.json({ message: "Acknowledged", data });
    } catch (err) {
      res.status(400).send("Error in Connection Requests!" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const user = req.user;
    const { status, requestId } = req.params;

    // status should be accepted or ignore only
    const allowedStatus = new Set(["accepted", "rejected"]);
    if (!allowedStatus.has(status)) {
      return res.status(400).json({ messaage: "Status not allowed!" });
    }

    // requestId's toUserId should be logged-in user
    // requestId's status should be interested only
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: user._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ message: "Connection request " + status, data });
  },
);

module.exports = requestRouter;
