import db from "../config/db.js";
export const listCategories = async (req, res) => {
    const categories = await db.category.findMany();
    res.json({
        status: true,
        message: "Success",
        data: categories,
        error: null
    });
}

export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    const category = await db.category.create({ data: { name, description } });
    res.json({
        status: true,
        message: "Success",
        data: category,
        error: null
    });
}

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const category = await db.category.findUnique({ where: { id } });
    res.json({
        status: true,
        message: "Success",
        data: category,
        error: null
    });
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await db.category.update({ where: { id }, data: { name, description } });
    res.json({
        status: true,
        message: "Success",
        data: category,
        error: null
    });
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const category = await db.category.delete({ where: { id } });
    res.json({
        status: true,
        message: "Success",
        data: category,
        error: null
    });
}
