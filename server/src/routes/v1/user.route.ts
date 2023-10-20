import { Request, Response, Router } from 'express';
import { CreateUser, DeleteUser, RetrieveAllUsers, RetrieveUser, UpdateUser } from '../../database/operations/user.operations';
import { LijstjeError } from '../../lijstjeError';
import { comparePassword, processError } from '../../utils';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await RetrieveAllUsers();
    res.status(200).send(users);
  } catch (error) {
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    // Parse & check request body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new LijstjeError({
        status: 400,
        message: "Request body is missing required data.",
      });
    }
    // Check if email is already in use
    const existingUser = await RetrieveUser({ email }, true);
    if (existingUser) {
      throw new LijstjeError({
        status: 400,
        message: "Email already in use."
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
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    // Parse & check request body
    const { email, password } = req.body;
    if (!email || !password) {
      throw new LijstjeError({
        status: 400,
        message: "Request body is missing required data.",
      });
    }
    // Retrieve user from db & check if received password matches one in db
    const user = await RetrieveUser({ email }, true);
    if (user && comparePassword(password, user.password)) {
      // User exists && password is correct
      res.status(200).json("Logged in successfully. TODO: return token...");
    } else {
      // User not found or password is incorrect
      throw new LijstjeError({
        status: 401,
        message: "Incorrect email and/or password provided."
      });
    }
  } catch (error) {
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

router.put('/update', async (req: Request, res: Response) => {
  try {
    // Parse & check request body
    const { _id, email, name, password } = req.body;
    if (!_id) {
      throw new LijstjeError({
        status: 400,
        message: "User _id not provided, cannot update an unknown User."
      });
    }
    if (!email && !name && !password) {
      throw new LijstjeError({
        status: 400,
        message: "Request body is missing required data.",
      });
    }
    // Update User using provided data
    const updatedUser = await UpdateUser({ _id, email, name, password });
    // Respond with updated User
    res.status(200).json(updatedUser);
  } catch (error) {
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

router.delete('/delete', async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      throw new LijstjeError({
        status: 400,
        message: "User _id not provided, cannot delete an unknown User."
      });
    }
    // Delete the User
    await DeleteUser(_id);
    // DeleteUser throws an error on failure, error will be caught & responded accordingly
    // At this point User should be deleted succesfully
    res.status(200).json("User deleted succesfully");
  } catch (error) {
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

export default router;