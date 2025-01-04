const validateRequest = (validation, data) => {
    const { error } = validation.validate(data);
    if (error) {
      return {
        success: false,
        message: "Validation Error", 
        error: error.details[0].message.replace(/['"]/g, '')
      };
    }
    return null;
  };

export default validateRequest;