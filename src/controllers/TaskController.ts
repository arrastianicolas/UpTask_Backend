import type { Request, Response } from "express";

import Task from "../models/Task";
import path from "node:path";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);

      // Promise.allSettled se encarga de que se ejecuten al mismo tiempo SI TODOS los promises se cumplen
      await Promise.allSettled([task.save(), req.project.save()]);

      res.send("Tarea creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const task = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id)
        .populate({
          path: "completedBy.user",
          select: "id name email",
        })
        .populate({
          path: "notes",
          populate: { path: "createdBy", select: "id name email" },
        });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.send("Tarea Actualizada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      res.send("Tarea Eliminada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;

      const data = {
        user: req.user.id,
        status,
      };
      req.task.completedBy.push(data);
      await req.task.save();

      res.send("Estado de la Tarea Actualizada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
}
