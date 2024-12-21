import { NextFunction, Request, Response } from "express";
import categoryModel from "../model/model";
import { isValidObjectId } from "mongoose";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryModel.find({}).lean();
    res.status(200).json(categories);
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
    if (!isValidObjectId(categoryID)) {
      res.status(404).json({ msg: "category not found." });
      return;
    }

    const category = await categoryModel.findById(categoryID).lean();
    if (!category) {
      res.status(404).json({ msg: "category not found." });
      return;
    }

    res.status(200).json(category);
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
    const title: string | undefined = req.body.title;
    const icon: string | undefined = req.body.icon;

    const slug = title?.trim().replace(/[\s\._]/g, "-");

    if (!slug) {
      res
        .status(409)
        .json({ msg: "category title is not valid or may already exist." });
      return;
    }

    const checkCategory = await categoryModel.findOne({ slug }).lean();
    if (checkCategory) {
      res
        .status(409)
        .json({ msg: "category title is not valid or may already exist." });
      return;
    }

    const category = await categoryModel.create({
      title,
      slug,
      icon: icon || "",
    });

    res.status(201).json(category);
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
    if (!isValidObjectId(categoryID)) {
      res.status(404).json({ msg: "category not found." });
      return;
    }

    const category = await categoryModel.findOneAndDelete({ _id: categoryID });
    if (!category) {
      res.status(404).json({ msg: "category not found." });
      return;
    }

    res.status(200).json(category);
    return;
  } catch (error) {
    next(error);
  }
};
