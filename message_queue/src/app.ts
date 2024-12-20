import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

import helmet from "helmet";
import cors from "cors";
import axios from "axios";
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

app.all("/", async (req: Request, res: Response) => {
  try {
    const action = req.body.action;
    switch (action) {
      case "GET_TEACHERS":
        const teachers = await axios.get("http://localhost:4001/teachers");
        res.status(teachers.status).json(teachers.data);
        return;

      case "GET_TEACHER":
        const teacher = await axios.get(
          `http://localhost:4001/single/${req.body._id}`
        );
        res.status(teacher.status).json(teacher.data);
        return;

      case "GET_ME":
        const currentUser = await axios.get("http://localhost:4001/getMe");
        res.status(currentUser.status).json(currentUser.data);
        return;

      case "GET_CATEGORY":
        const category = await axios.get(
          `http://localhost:4004/single/${req.body._id}`
        );
        res.status(category.status).json(category.data);
        return;

      default:
        res.status(404).json({ msg: "action not found." });
        return;
    }
  } catch (error: any) {
    res
      .status(error.response.status || 500)
      .json(error.response.data || { errors: "queue faild." });
    return;
  }
});

export default app;
