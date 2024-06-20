export interface Todo {
    id?: number,
    title: string,
    description?: string,
    user_uid: string,
    is_done: boolean,
}

export interface User {
    email: string,
    firstname: string,
    lastname: string,
}
