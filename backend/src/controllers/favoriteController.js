import db from "../config/db.js";

export const addToFavorites = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        // Cek apakah buku ada dan sudah dipublikasikan
        const book = await db.book.findUnique({
            where: { 
                id: bookId,
                isPublished: true
            }
        });

        if (!book) {
            return res.status(404).json({
                status: false,
                error: ['Buku tidak ditemukan atau belum dipublikasikan'],
                message: 'Buku tidak ditemukan atau belum dipublikasikan',
                data: null
            });
        }

        // Cek apakah buku sudah ada di favorit
        const existingFavorite = await db.favorite.findUnique({
            where: {
                userId_bookId: {
                    userId: userId,
                    bookId: bookId
                }
            }
        });

        if (existingFavorite) {
            // Jika sudah ada, hapus dari favorit
            await db.favorite.delete({
                where: {
                    userId_bookId: {
                        userId: userId,
                        bookId: bookId
                    }
                }
            });

            return res.status(200).json({
                status: true,
                error: [],
                message: 'Buku berhasil dihapus dari favorit',
                data: {
                    isFavorite: false
                }
            });
        }

        // Jika belum ada, tambahkan ke favorit
        const favorite = await db.favorite.create({
            data: {
                userId: userId,
                bookId: bookId
            },
            include: {
                book: {
                    select: {
                        title: true,
                        author: true,
                        coverImage: true,
                        publisher: true,
                        isbn: true
                    }
                }
            }
        });

        res.status(201).json({
            status: true,
            error: [],
            message: 'Buku berhasil ditambahkan ke favorit',
            data: {
                isFavorite: true,
                favorite
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: [error.message],
            message: 'Gagal menambahkan buku ke favorit',
            data: null
        });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        // Ambil semua buku favorit user
        const favorites = await db.favorite.findMany({
            where: {
                userId: userId
            },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        description: true,
                        coverImage: true,
                        publishedAt: true,
                        isbn: true,
                        publisher: true,
                        totalPages: true,
                        categories: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            status: true,
            error: [],
            message: 'Berhasil mendapatkan daftar buku favorit',
            data: favorites
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: [error.message],
            message: 'Gagal mendapatkan daftar buku favorit',
            data: null
        });
    }
};

export const checkFavorite = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        // Cek apakah buku ada di favorit
        const favorite = await db.favorite.findUnique({
            where: {
                userId_bookId: {
                    userId: userId,
                    bookId: bookId
                }
            }
        });

        res.status(200).json({
            status: true,
            error: [],
            message: 'Berhasil mengecek status favorit',
            data: {
                isFavorite: !!favorite
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: [error.message],
            message: 'Gagal mengecek status favorit',
            data: null
        });
    }
}; 