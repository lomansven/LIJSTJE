import { LijstjeError } from "../../lijstjeError";
import { hashPassword, omitUndefined } from "../../utils";
import { IUser, User } from "../entities/user.entity";

/**
 * Operation to retrieve all Users from database
 * @returns Obfuscated User list
 */
export async function RetrieveAllUsers(): Promise<IUser[]> {
    return User.scan().attributes(["email","name","_createdAt"]).all().exec();
}

/**
 * Operation to retrieve a single User by a query on a single attribute
 * @param query Query to retrieve user by a single attribute
 * @param allowUndefined Boolean to determine whether operation may return undefined if User is not found or throw an error if User is not found
 * @returns User or undefined based on ``allowUndefined``
 * @throws LijstjeError if invalid query was provided, or if User does not exist (based on ``allowUndefined``)
 */
export async function RetrieveUser(query: any, allowUndefined: boolean | undefined = false): Promise<IUser | undefined> {
    try {
        // Get first key from query object, will be used to find User (example: _id / email)
        const [key, value] = Object.entries(query)[0];
        if (!key || !value) {
            console.error("RetrieveUser retrieved invalid query object", query);
            throw new LijstjeError({
                status: 500,
                message: "Internal server error occured while trying to retrieve a User."
            });
        }
        // If valid key and value are provided, retrieve User by that data
        const user = (await User.scan(key).eq(value).exec()).pop();
        if (!user && !allowUndefined) {
            // Throw an error if allowed & user not found, will be caught in request
            throw new LijstjeError({
                status: 404,
                message: `Could not find user with ${key} ${value}.`
            });
        }
        // Return User scan result (could be undefined based on allowUndefined)
        return user;
    } catch (error) {
        // Throw error so endpoint can return it
        throw error;
    }
}

/** Data to be provided for CreateUser operation */
type CreateUserProps = {
    name: string;
    email: string;
    password: string;
}
/**
 * Creates a single User entity based on provided data
 * @param props Required data to create User entity
 * @returns New User entity
 * @throws LijstjeError if creating User fails
 */
export async function CreateUser(props: CreateUserProps): Promise<IUser> {
    try {
        // Hash password
        const hashedPassword = hashPassword(props.password);
        return User.create({
            ...props,
            password: hashedPassword,
            _createdAt: Date.now()
        });
    } catch (error) {
        // Throw error so endpoint can return it
        throw error;
    }
}

/** Data to be provided for UpdateUser operation */
type UpdateUserProps = {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
}
/**
 * Updates single User entity using provided datas
 * @param props Data to identify and update User entity
 * @returns Updated User
 * @throws LijstjeError if User does not exist
 */
export async function UpdateUser(props: UpdateUserProps): Promise<IUser> {
    try {
        // Assert user exists (throws an error otherwise so can cast to IUser)
        const user = await RetrieveUser({ _id: props._id }, false) as IUser;
        // Update found user with composes props excluding _id
        const hashedPassword = props.password ? hashPassword(props.password) : undefined;
        const updateProps = omitUndefined({
            name: props.name,
            email: props.email,
            password: hashedPassword
        });
        // Update User entity
        return User.update({ _id: user._id }, { ...updateProps });
    } catch (error) {
        // Throw error so endpoint can return it
        throw error;
    }
}

/**
 * Deletes single User entity based on provided id
 * @param _id Id to identify User that must be deleted
 * @returns Deletion result
 * @throws LijstjeError if User is not found
 */
export async function DeleteUser(_id: string): Promise<void> {
    try {
        // Assert user exists (throws an error otherwise)
        await RetrieveUser({ _id }, false);
        // Delete user by _id
        return User.delete({ _id });
    } catch (error) {
        // Throw error so endpoint can return it
        throw error;
    }
}