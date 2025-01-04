import db from "../config/db.js";
import path from "path";
import fs from "fs";

export const getAllBooks = async (req, res) => {
    const books = await db.book.findMany({
        include: {
            categories: {
                include: {
                    category: true
                }
            }
        }
    });
    res.status(200).json({
        status: true,
        error: [],
        message: 'Success get all books',
        data: books
    });
}

export const getBookById = async (req, res) => {
    const book = await db.book.findUnique({
        where: { id: req.params.id },
        include: {
            categories: {
                include: {
                    category: true
                }
            }
        }
    });

    if (!book) {
        return res.status(404).json({
            status: false,
            error: ['Book not found'],
            message: 'Book not found',
            data: []
        });
    }

    res.status(200).json({
        status: true,
        error: [],
        message: 'Success get book by id',
        data: book
    });
}

export const createBook = async (req, res) => {
    try {
        const { title, author, description, categories, isbn, publisher, totalPages, isPublished, publishedAt } = req.body;
        const parsedCategories = JSON.parse(categories);

        // Get file paths and modify to start from public/
        const coverImage = req.files['coverImage'] ?
            req.files['coverImage'][0].path.split('public')[1] : null;
        const fileBook = req.files['epubFile'] ?
            req.files['epubFile'][0].path.split('public')[1] : null;

        console.log(coverImage);
        console.log(fileBook);
        console.log(req.body);

        // Create book
        const book = await db.book.create({
            data: {
                title,
                author,
                description,
                coverImage,
                fileBook,
                isbn,
                publisher,
                totalPages: totalPages ? parseInt(totalPages) : 0,
                isPublished: isPublished === 'true',
                publishedAt: publishedAt ? new Date(publishedAt) : null,
                categories: {
                    create: parsedCategories.map(categoryId => ({
                        category: {
                            connect: { id: categoryId }
                        }
                    }))
                }
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        res.status(201).json({
            status: true,
            error: [],
            message: 'Success create book',
            data: book
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: [error.message],
            message: 'Failed to create book',
            data: null
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { title, author, description, categories, isbn, publisher, totalPages, isPublished, publishedAt } = req.body;
        const parsedCategories = JSON.parse(categories);
        const bookId = req.params.id;

        // Ambil data buku yang akan diupdate
        const existingBook = await db.book.findUnique({
            where: { id: bookId },
            include: {
                categories: true
            }
        });

        if (!existingBook) {
            return res.status(404).json({
                status: false,
                error: ['Buku tidak ditemukan'],
                message: 'Buku tidak ditemukan',
                data: null
            });
        }

        // Hapus file lama jika ada file baru yang diupload
        if (req.files['coverImage'] && existingBook.coverImage) {
            const oldCoverPath = path.join(process.cwd(), 'public', existingBook.coverImage);
            if (fs.existsSync(oldCoverPath)) {
                fs.unlinkSync(oldCoverPath);
            }
        }

        if (req.files['epubFile'] && existingBook.fileBook) {
            const oldFilePath = path.join(process.cwd(), 'public', existingBook.fileBook);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Get file paths and modify to start from public/
        const coverImage = req.files['coverImage'] ?
            req.files['coverImage'][0].path.split('public')[1] : existingBook.coverImage;
        const fileBook = req.files['epubFile'] ?
            req.files['epubFile'][0].path.split('public')[1] : existingBook.fileBook;

        // Update book with new data
        const updatedBook = await db.book.update({
            where: { id: bookId },
            data: {
                title,
                author,
                description,
                coverImage,
                fileBook,
                isbn,
                publisher,
                totalPages: totalPages ? parseInt(totalPages) : 0,
                isPublished: isPublished === 'true',
                publishedAt: publishedAt ? new Date(publishedAt) : null,
                categories: {
                    deleteMany: {},
                    create: parsedCategories.map(categoryId => ({
                        category: {
                            connect: { id: categoryId }
                        }
                    }))
                }
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        res.status(200).json({
            status: true,
            error: [],
            message: 'Berhasil memperbarui buku',
            data: updatedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: [error.message],
            message: 'Gagal memperbarui buku',
            data: null
        });
    }
}

export const deleteBook = async (req, res) => {
    const book = await db.book.delete({
        where: { id: req.params.id }
    });
    res.status(200).json({
        status: true,
        error: [],
        message: 'Success delete book',
        data: book
    });
}


export const addRead = async (req, res) => {
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

        // Cek apakah user sudah pernah membaca buku ini
        const existingRead = await db.read.findUnique({
            where: {
                userId_bookId: {
                    userId: userId,
                    bookId: bookId
                }
            }
        });

        let read;
        if (existingRead) {
            // Jika sudah pernah membaca, increment readCount
            read = await db.read.update({
                where: {
                    userId_bookId: {
                        userId: userId,
                        bookId: bookId
                    }
                },
                data: {
                    readCount: {
                        increment: 1
                    }
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            profile: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    },
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
        } else {
            // Jika belum pernah membaca, buat record baru
            read = await db.read.create({
                data: {
                    userId: userId,
                    bookId: bookId,
                    readCount: 1
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            profile: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    },
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
        }

        // Format response data
        const responseData = {
            id: read.id,
            readCount: read.readCount,
            lastRead: read.updatedAt,
            reader: {
                email: read.user.email,
                name: read.user.profile ? `${read.user.profile.firstName || ''} ${read.user.profile.lastName || ''}`.trim() : 'Anonymous'
            },
            book: {
                title: read.book.title,
                author: read.book.author,
                coverImage: read.book.coverImage,
                publisher: read.book.publisher,
                isbn: read.book.isbn
            }
        };

        res.status(200).json({
            status: true,
            error: [],
            message: 'Berhasil menambahkan riwayat baca',
            data: responseData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            error: [error.message],
            message: 'Gagal menambahkan riwayat baca',
            data: null
        });
    }
};
