export const errorResponse = (error) => {
    return {
        status: false,
        message: error.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.stack : [],
        data: []
    };
};