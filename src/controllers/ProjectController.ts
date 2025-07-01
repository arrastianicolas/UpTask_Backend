import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    //Asigna un manager

    project.manager = req.user.id;
    try {
      await project.save();
      //  await Project.create(req.body);
      res.send("Proyecto Creando Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks"); //la funcion populate permite traer los datos de las tareas asociadas al proyecto
      if (!project) {
        const error = new Error("Proyecto No encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error("Acción no valida");
        res.status(404).json({ error: error.message });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static updateProject = async (req: Request, res: Response) => {
    try {
      req.project.projectName = req.body.projectName;
      req.project.clientName = req.body.clientName;
      req.project.description = req.body.description;
      await req.project.save();
      res.send("Proyecto Actualizado!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();

      res.send("Proyecto Eliminado!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un Error" });
    }
  };
}
