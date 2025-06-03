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
