export const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(
        {
            status: false,
            message: 'Forbidden',
            error: [],
            data: []
        }
    );
  }
  next();
}

export default isAdmin;