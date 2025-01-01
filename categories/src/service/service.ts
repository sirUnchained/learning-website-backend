import { isValidObjectId } from "mongoose";
import categoryModel from "../model/model";

class CategoryService {
  async getSingle(catID: string): Promise<{ status: number; result: any }> {
    if (!isValidObjectId(catID)) {
      return { status: 404, result: "category not found." };
    }

    const category = await categoryModel.findById(catID).lean();
    console.log(category);
    if (!category) {
      return { status: 404, result: "category not found." };
    }

    return { status: 200, result: category };
  }

  async create(body: {
    title: string;
    icon: string | undefined;
  }): Promise<{ status: number; result: any }> {
    const { title, icon } = body;

    const slug = title?.trim().replace(/[\s\._]/g, "-");

    if (!slug) {
      return {
        status: 409,
        result: "category title is not valid or may already exist.",
      };
    }

    const checkCategory = await categoryModel.findOne({ slug }).lean();
    if (checkCategory) {
      return {
        status: 409,
        result: "category title is not valid or may already exist.",
      };
    }

    const category = await categoryModel.create({
      title,
      slug,
      icon: icon || "",
    });

    return { status: 201, result: category };
  }

  async remove(catID: string): Promise<{ status: number; result: any }> {
    if (!isValidObjectId(catID)) {
      return { status: 404, result: "category not found." };
    }

    const category = await categoryModel.findByIdAndDelete(catID).lean();
    if (!category) {
      return { status: 404, result: "category not found." };
    }

    return { status: 200, result: category };
  }
}

export default CategoryService;
