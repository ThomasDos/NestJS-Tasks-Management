
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export abstract class IQuery {
    abstract getUser(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract task(taskId?: Nullable<string>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract tasks(): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;
}

export class User {
    id: string;
    username: string;
    password: string;
    created_at: Date;
    updated_at?: Nullable<Date>;
    tasks: Nullable<Task>[];
}

export class Task {
    id: string;
    user: User;
    userId: string;
    title: string;
    description: string;
    status: TaskStatus;
    picture_url?: Nullable<string>;
    created_at: Date;
    updated_at?: Nullable<Date>;
}

type Nullable<T> = T | null;
