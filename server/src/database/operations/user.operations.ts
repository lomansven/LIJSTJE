import { pickBy } from "lodash";
import { LijstjeError } from "../../lijstjeError";
import { hashPassword, omitUndefined } from "../../utils";
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
        password: hashedPassword,
        _createdAt: Date.now()
    });
}

export async function RetrieveUserByEmail(email: string) {
    return (await User.scan("email").eq(email).exec()).pop();
}

export async function RetrieveUserById(_id: string) {
    return (await User.scan("_id").eq(_id).exec()).pop();
}

type UpdateUserProps = {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
}
export async function UpdateUser(props: UpdateUserProps) {
    // Check if user exists
    const user = await RetrieveUserById(props._id);
    if (!user) {
        throw new LijstjeError({
            status: 400,
            message: `Could not find user with _id ${props._id}.`
        });
    }
    // Update found user with composes props excluding _id
    const hashedPassword = props.password ? hashPassword(props.password) : undefined;
    const updateProps = omitUndefined({
        name: props.name,
        email: props.email,
        password: hashedPassword
    });
    // Update User entity
    return User.update({ _id: user._id }, { ...updateProps });
}

type DeleteUserProps = {
    _id: string;
}
export async function DeleteUser(props: DeleteUserProps) {
    // WIP...
}