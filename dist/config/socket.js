"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketFunction = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const user_model_1 = require("../app/modules/user/user.model");
const socketFunction = async (app) => {
    const server = http_1.default.createServer(app);
    // Attach Socket.IO
    const io = new socket_io_1.Server(server, {
        cors: { origin: "http://localhost:5173" },
    });
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        // Listen for location updates
        socket.on("update-location", async (data) => {
            console.log("Received location:", data);
            try {
                const locationPayload = {
                    type: 'Point',
                    coordinates: [data.coordinates[0], data.coordinates[1]],
                    address: data.address
                };
                // Save/update in DB
                const user = await user_model_1.User.findOneAndUpdate({ _id: data.userId }, { $set: { location: locationPayload } }, { upsert: true, new: true });
                console.log(locationPayload);
            }
            catch (err) {
                console.error("Failed to save location:", err);
            }
            // Broadcast to other clients
            socket.broadcast.emit("user-location-updated", data);
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};
exports.socketFunction = socketFunction;
