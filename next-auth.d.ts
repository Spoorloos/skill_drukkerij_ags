import { DefaultSession } from "next-auth";
import { type Database } from "@/../database";

type DatabaseUser = Database["public"]["Tables"]["user"]["Row"];

declare module "next-auth" {
    type User = Omit<DatabaseUser, "password">;

    type Session = {
        user: User;
    }
}

declare module "next-auth/jwt" {
    type JWT = {
        user: User;
    }
}