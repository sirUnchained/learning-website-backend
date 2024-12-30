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
