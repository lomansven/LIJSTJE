import { User } from "../entities/user.entity";

type CreateUserProps = {
    name: string;
    email: string;
    password: string;
}
export async function CreateUser(props: CreateUserProps) {
    try {
        const user = await User.create({
            ...props // TODO: hash password
        });
        console.log('CreateUser::user', user);
        return user;
    } catch (error) {
        // Pass error back so endpoint can use it
        throw error;
    }
}

type RetrieveUserProps = {
    _id: string;
}
export async function RetrieveUser(props: RetrieveUserProps) {
    try {
        // WIP...
    } catch (error) {

    }
}

type UpdateUserProps = {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
}
export async function UpdateUser(props: UpdateUserProps) {
    try {
        // WIP...
    } catch (error) {

    }
}

type DeleteUserProps = {
    _id: string;
}
export async function DeleteUser(props: DeleteUserProps) {
    try {
        // WIP...
    } catch (error) {

    }
}