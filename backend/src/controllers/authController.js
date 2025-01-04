import db from "../config/db.js";
import { loginValidation, registerValidation } from "../validation/authValidation.js";
import { errorResponse } from "../utils/errorResponse.js";
import validateRequest from "../validation/validation.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../config/jwt.js";


export const register = async (req, res) => {
  console.log(req.body)
  const validationError = validateRequest(registerValidation, req.body);
  if (validationError) {
    return res.status(400).json({
      status: false,
      message: validationError.message,
      error: [validationError.error],
      data: []
    });
  }

  try {
    const findUser = await db.user.findUnique({
      where: {
        email: req.body.email
      }
    });

    if (findUser) {
      return res.status(400).json({
        status: false,
        message: 'Email already exists',
        error: ['Email already exists'],
        data: []
      });
    }

    const hashedPassword = await hashPassword(req.body.password);
    const user = await db.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
          }
        }
      }
    });

    const filteredUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }

    return res.status(200).json({
      status: true,
      message: 'Register successfully',
      error: [],
      data: filteredUser
    });



  } catch (error) {
    return res.status(500).json(errorResponse(error));
  }
};


export const login = async (req, res) => { 

  const validationError = validateRequest(loginValidation, req.body);
  if (validationError) {
    return res.status(400).json({
      status: false,
      message: validationError.message,
      error: [validationError.error],
      data: []
    });
  }

  try {

    const findUser = await db.user.findUnique({
      where: {
        email: req.body.email
      },
      include: {
        profile: true
      }
    });

    if (!findUser) {
      return res.status(400).json({
        status: false,
        message: 'User not found',
        error: ['User not found'],
        data: []
      });
    }

    const isPasswordCorrect = await comparePassword(req.body.password, findUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: 'Invalid password',
        error: ['Invalid password'],
        data: []
      });
    }

    const accessToken = generateAccessToken(findUser.id);
    const refreshToken = generateRefreshToken(findUser.id);

    return res.status(200).json({
      status: true,
      message: 'Login successful',
      error: [],
      data: {
        user: {
          id: findUser.id,
          email: findUser.email,
          firstName: findUser.profile.firstName,
          lastName: findUser.profile.lastName,
          role: findUser.role
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    return res.status(500).json(errorResponse(error));
  }
}

export const refreshToken = async (req, res) => {
  console.log(req.body)
  const decoded = verifyRefreshToken(req.body.refreshToken);
  console.log(decoded)
  const accessToken = generateAccessToken(decoded.userId);
  return res.status(200).json({
    status: true,
    message: 'Refresh token successful',
    error: [],
    data: { accessToken }
  });
}
