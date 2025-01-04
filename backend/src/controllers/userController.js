import db from "../config/db.js";
import { hashPassword } from "../utils/bcrypt.js";
import { errorResponse } from "../utils/errorResponse.js";

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await db.user.findUnique({ 
        where: { id },
        include: {
            profile: true
        }
    });
    res.json({ 
        status: true,
        message: "Success",
        data: user,
        error: []
     });
}

export const createUser = async (req, res) => {
    try {
        // Cek apakah email sudah ada
        const findUser = await db.user.findUnique({
            where: {
                email: req.body.email
            }
        });

        if (findUser) {
            return res.status(400).json({
                status: false,
                message: 'Email sudah terdaftar',
                error: ['Email sudah terdaftar'],
                data: null
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(req.body.password);

        // Buat user baru dengan profile
        const user = await db.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
                profile: {
                    create: {
                        firstName: req.body.profile.firstName,
                        lastName: req.body.profile.lastName,
                        phone: req.body.profile.phoneNumber,
                        address: req.body.profile.address
                    }
                }
            },
            include: {
                profile: true
            }
        });

        // Filter data yang akan dikembalikan
        const filteredUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                phoneNumber: user.profile.phoneNumber,
                address: user.profile.address
            }
        };

        return res.status(201).json({
            status: true,
            message: 'Berhasil membuat pengguna baru',
            error: [],
            data: filteredUser
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json(errorResponse(error));
    }
}

export const getAllUser = async (req, res) => {
    const users = await db.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            profile: true
        }
    });

    
    res.json({ 
        status: true,
        message: "Success",
        data: users,
        error: []
     });
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await db.user.delete({ where: { id } });
    res.json({ 
        status: true,
        message: "Success",
        data: user,
        error: []
     });
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Cek apakah user ada
        const existingUser = await db.user.findUnique({
            where: { id },
            include: { profile: true }
        });

        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: 'Pengguna tidak ditemukan',
                error: ['Pengguna tidak ditemukan'],
                data: null
            });
        }

        // Cek email duplikat jika email diubah
        if (req.body.email && req.body.email !== existingUser.email) {
            const emailExists = await db.user.findUnique({
                where: { email: req.body.email }
            });
            if (emailExists) {
                return res.status(400).json({
                    status: false,
                    message: 'Email sudah digunakan',
                    error: ['Email sudah digunakan'],
                    data: null
                });
            }
        }

        // Persiapkan data update
        const updateData = {
            email: req.body.email,
            role: req.body.role,
            profile: {
                update: {
                    firstName: req.body.profile.firstName,
                    lastName: req.body.profile.lastName,
                    phone: req.body.profile.phoneNumber,
                    address: req.body.profile.address
                }
            }
        };

        // Jika ada password baru, hash password
        if (req.body.password) {
            updateData.password = await hashPassword(req.body.password);
        }

        // Update user dan profile
        const updatedUser = await db.user.update({
            where: { id },
            data: updateData,
            include: {
                profile: true
            }
        });

        // Filter data yang akan dikembalikan
        const filteredUser = {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
            profile: {
                firstName: updatedUser.profile.firstName,
                lastName: updatedUser.profile.lastName,
                phoneNumber: updatedUser.profile.phone,
                address: updatedUser.profile.address
            }
        };

        return res.status(200).json({
            status: true,
            message: 'Berhasil memperbarui pengguna',
            error: [],
            data: filteredUser
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json(errorResponse(error));
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                profile: true
            }
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Profil tidak ditemukan',
                error: ['Profil tidak ditemukan'],
                data: null
            });
        }

        // Filter data yang akan dikembalikan
        const filteredUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            profile: {
                firstName: user.profile?.firstName || '',
                lastName: user.profile?.lastName || '',
                phoneNumber: user.profile?.phone || '',
                address: user.profile?.address || ''
            }
        };

        return res.status(200).json({
            status: true,
            message: 'Berhasil mendapatkan profil',
            error: [],
            data: filteredUser
        });
    } catch (error) {
        console.error('Error getting profile:', error);
        return res.status(500).json(errorResponse(error));
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, password, profile } = req.body;

        // Cek apakah user ada
        const existingUser = await db.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        });

        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: 'Profil tidak ditemukan',
                error: ['Profil tidak ditemukan'],
                data: null
            });
        }

        // Cek email duplikat jika email diubah
        if (email && email !== existingUser.email) {
            const emailExists = await db.user.findUnique({
                where: { email }
            });
            if (emailExists) {
                return res.status(400).json({
                    status: false,
                    message: 'Email sudah digunakan',
                    error: ['Email sudah digunakan'],
                    data: null
                });
            }
        }

        // Persiapkan data update
        const updateData = {
            email: email || undefined,
            profile: {
                upsert: {
                    create: {
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        phone: profile.phoneNumber,
                        address: profile.address
                    },
                    update: {
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        phone: profile.phoneNumber,
                        address: profile.address
                    }
                }
            }
        };

        // Jika ada password baru, hash password
        if (password) {
            updateData.password = await hashPassword(password);
        }

        // Update user dan profile
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: updateData,
            include: {
                profile: true
            }
        });

        // Filter data yang akan dikembalikan
        const filteredUser = {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
            profile: {
                firstName: updatedUser.profile?.firstName || '',
                lastName: updatedUser.profile?.lastName || '',
                phoneNumber: updatedUser.profile?.phone || '',
                address: updatedUser.profile?.address || ''
            }
        };

        return res.status(200).json({
            status: true,
            message: 'Berhasil memperbarui profil',
            error: [],
            data: filteredUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json(errorResponse(error));
    }
};
