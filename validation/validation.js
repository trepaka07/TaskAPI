const validateBody = (schema, body) => {
  const validate = schema.safeParse(body);
  if (!validate.success) {
    return { error: validate.error.flatten().fieldErrors };
  }
  return null;
};

module.exports = validateBody;
