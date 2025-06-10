"use strict";
// import express from "express";
// import { gameStates, keys, scores, ball, leftPaddle, rightPaddle } from "./state.js";
// const app = express();
// const PORT = 3000;
// app.use(express.json());
// app.get("/state", (req, res) => {
//   res.json({ gameStates, keys, scores, ball, leftPaddle, rightPaddle });
// });
// app.get("/update", (req, res) => {
//     const {action, key, player} = req.body;
//     if (player === "left" && key !== "w" && key !== "s")
//         return;
//     if (player === "right" && key !== "Up" && key !== "Down")
//         return;
//     if (action !== "keydown" && action !== "keyup")
//         console.log("Error");
//     action === "down" ? keys[key] = true : false;
//     res.json({ message: "Key update" });
// });
// app.listen(PORT, () => {
//   console.log(`Serveur lancé sur http://localhost:${PORT}`);
// });
// if (gameStates.isRemote) {
//     window.addEventListener("keydown", (event) => {
//         fetch(`http://localhost:3000/update/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "keydown", key: event, player:"left" })
//         });
//     });
//     window.addEventListener("keyup", (event) => {
//         fetch(`http://localhost:3000/update/`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ action: "keyup", key: event, player: "left" })
//         });
//     });
// }
