const { z } = require("zod");

const userSchema = z.object({
  username: z.string().min(3).nullable(),
});

const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8), // TODO: contains number
});

const loginSchema = z.object({
  username: z.string().min(3), // TODO: or email
  password: z.string().min(8), // TODO: contains number
});

const taskSchema = z.object({
  name: z.string().min(3),
});

module.exports = { userSchema, signupSchema, loginSchema, taskSchema };
