import type {ActionFunctionArgs} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {deleteContact} from "../data";

export const action = async ({params}: ActionFunctionArgs) => {
    await deleteContact(params.contactId as string);
    return redirect("/");
};
