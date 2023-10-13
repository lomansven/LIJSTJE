import { hashPassword } from "../../utils";
import { User } from "../entities/user.entity";

type CreateUserProps = {
    name: string;
    email: string;
    password: string;
}
export async function CreateUser(props: CreateUserProps) {
    // Hash password
    const hashedPassword = hashPassword(props.password);
    return User.create({
        ...props,
        password: hashedPassword
    });
}

type RetrieveUserProps = {
    email: string;
}
export async function RetrieveUser(props: RetrieveUserProps) {
    return (await User.scan("email").eq(props.email).exec()).pop();
}

type UpdateUserProps = {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
}
export async function UpdateUser(props: UpdateUserProps) {
    // WIP...
}

type DeleteUserProps = {
    _id: string;
}
export async function DeleteUser(props: DeleteUserProps) {
    // WIP...
}