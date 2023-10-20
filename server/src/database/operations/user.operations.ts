import { LijstjeError } from "../../lijstjeError";
import { hashPassword, omitUndefined } from "../../utils";
import { IUser, User } from "../entities/user.entity";

export async function RetrieveAllUsers(): Promise<IUser[]> {
    return User.scan().attributes(["email","name","_createdAt"]).all().exec();
}

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

type CreateUserProps = {
    name: string;
    email: string;
    password: string;
}
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

type UpdateUserProps = {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
}
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