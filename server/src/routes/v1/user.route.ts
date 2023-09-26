import { Request, Response, Router } from 'express';
import { CreateUser } from '../../database/operations/user.operations';
import { LijstjeError } from '../../lijstjeError';
import { IUser } from '../../database/entities/user.entity';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send("Welcome to the Lijstje backend API!");
  } catch (error) {
    console.error('An error ocurred:', error);
    res.status(500).json(error);
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    // Parse & check request body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new LijstjeError({
        status: 400,
        message: "Username and/or password was not provided."
      });
    }
    // Create user with provided username and password
    const user = await CreateUser({
      name,
      email,
      password
    });
    // Omit some details from the User entity & return result
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user._createdAt
    });
  } catch (error) {
    // Parse & respond with error
    const { status, message } = error as LijstjeError;
    res.status(status ? status : 500).json(message ? message : error);
  }
});

export default router;