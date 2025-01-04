import Joi from "joi";

export const createBookValidation = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().allow('', null),
    categories: Joi.string().required(), // JSON string of category IDs
    isbn: Joi.string().allow('', null),
    publisher: Joi.string().allow('', null),
    totalPages: Joi.number().integer().min(0).default(0),
    isPublished: Joi.boolean().default(false),
    publishedAt: Joi.date().allow(null)
});

export const updateBookValidation = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    description: Joi.string().allow('', null),
    categories: Joi.string(), // JSON string of category IDs
    isbn: Joi.string().allow('', null),
    publisher: Joi.string().allow('', null),
    totalPages: Joi.number().integer().min(0),
    isPublished: Joi.boolean(),
    publishedAt: Joi.date().allow(null)
});

