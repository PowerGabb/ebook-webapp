import db from "../config/db.js";

export const getDashboardData = async (req, res) => {


    const totalBook = await db.book.count();
    const totalCategory = await db.category.count();
    const totalUser = await db.user.count();

    res.json({
        status: true,
        message: "Success",
        data: {
            totalBook,
            totalCategory,
            totalUser
        },
        error: []
    });
}