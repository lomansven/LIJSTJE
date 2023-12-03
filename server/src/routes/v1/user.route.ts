import { Request, Response, Router } from 'express';
import { CreateUser, DeleteUser, RetrieveAllUsers, RetrieveUser, UpdateUser } from '../../database/operations/user.operations';
import { LijstjeError } from '../../lijstjeError';
import { comparePassword, generateLoginToken, processError } from '../../utils';
import { Authentication } from '../../middleware';

const router = Router();

/** /v1/user/ */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await RetrieveAllUsers();
    res.status(200).send(users);
  } catch (error) {
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

/** /v1/user/register */
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
        message: "Email not available."
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

/** /v1/user/login */
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
      const token = generateLoginToken(user._id);
      res.status(200).json({ token });
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

/** /v1/user/update */
router.put('/update', Authentication, async (req: Request, res: Response) => {
  try {
    // Parse & check request body and headers
    const { email, name, password } = req.body;
    const _id = req.headers.userId as string;
    if (!_id) {
      throw new LijstjeError({
        status: 400,
        message: "User _id not found, cannot update an unknown User."
      });
    }
    if (!email && !name && !password) {
      throw new LijstjeError({
        status: 400,
        message: "Request body is missing required data.",
      });
    }
    // Update User using provided data
    await UpdateUser({ _id, email, name, password });
    const updatedUser = await RetrieveUser({ _id });
    // Respond with updated User
    res.status(200).json(updatedUser);
  } catch (error) {
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

/** /v1/user/delete */
router.delete('/delete', Authentication, async (req: Request, res: Response) => {
  try {
    const _id = req.headers.userId as string;
    if (!_id) {
      throw new LijstjeError({
        status: 400,
        message: "User _id not found, cannot delete an unknown User."
      });
    }
    // Delete the User
    await DeleteUser(_id);
    // DeleteUser throws an error on failure, error will be caught & responded accordingly
    // At this point User should be deleted succesfully
    res.status(200).json({
      message: "User deleted succesfully."
    });
  } catch (error) {
    // Process LijstjeError/generic error
    processError(res, error);
  }
});

export default router;