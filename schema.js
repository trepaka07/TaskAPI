const { z } = require("zod");

const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8), // TODO: contains number
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8), // TODO: contains number
});

const taskSchema = z.object({
  name: z.string().min(3),
});

module.exports = { signupSchema, loginSchema, taskSchema };
