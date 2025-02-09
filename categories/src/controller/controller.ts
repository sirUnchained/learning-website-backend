import { NextFunction, Request, Response } from "express";
import categoryModel from "../model/model";
import CategoryService from "../service/service";

const categoryService = new CategoryService();

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryModel.find({}).lean();
    res.status(200).json({ status: 200, result: categories });
    return;
  } catch (error) {
    next(error);
  }
};

export const getSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryID } = req.params;

    const data = await categoryService.getSingle(categoryID);

    res.status(data.status).json(data.result);
    return;
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await categoryService.create(req.body);

    res.status(data.status).json(data);
    return;
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryID } = req.params;

    const data = await categoryService.remove(categoryID);

    res.status(data.status).json(data.result);
    return;
  } catch (error) {
    next(error);
  }
};
