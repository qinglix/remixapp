import {Form, json, useFetcher, useLoaderData} from "@remix-run/react";
import type {FunctionComponent} from "react";

import {ContactRecord, getContact, updateContact} from "../data";
import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";

export const loader = async ({params}: LoaderFunctionArgs) => {
    const contact = await getContact(params.contactId as string);
    if (!contact) throw new Response("Not Found", {status: 404});
    return json({contact});
}

export const action = async ({params, request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    return updateContact(params.contactId as string, {
        favorite: formData.get("favorite") === "true",
    });
};

export default function Contact() {
    const {contact} = useLoaderData<typeof loader>();

    // const contact = {
    //     first: "Your",
    //     last: "Name",
    //     avatar: "https://www.media.io/lab/ai-face-editor/app_static/portrait.png",
    //     twitter: "your_handle",
    //     notes: "Some notes",
    //     favorite: true,
    // };

    return (
        <div className="flex gap-6 m-6">
            <div className="ml-10">
                <img
                    alt={`${contact.first} ${contact.last} avatar`}
                    key={contact.avatar}
                    src={contact.avatar}
                    className="rounded-2xl w-60 h-60 object-cover"
                />
            </div>
            <div className="flex flex-col gap-4 py-5">
                <h1 className="flex gap-3 text-xl font-bold">
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact}/>
                </h1>

                {contact.twitter ? (
                    <p className="text-blue-500">
                        <a
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                ) : null}

                {contact.notes ? <p>{contact.notes}</p> : null}

                <div className="flex gap-3">
                    <Form action="edit">
                        <button type="submit"
                                className="border border-gray-300 rounded-md bg-white text-blue-600 py-1 p-2 font-medium">Edit
                        </button>
                    </Form>

                    <Form
                        action="destroy"
                        method="post"
                        onSubmit={(event) => {
                            const response = confirm(
                                "Please confirm you want to delete this record."
                            );
                            if (!response) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit"
                                className="border border-gray-300 rounded-md bg-white text-red-500 py-1 p-2 font-medium">Delete
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

const Favorite: FunctionComponent<{
    contact: Pick<ContactRecord, "favorite">;
}> = ({contact}) => {
    const fetcher = useFetcher();
    const favorite = fetcher.formData
        ? fetcher.formData.get("favorite") === "true"
        : contact.favorite;

    return (
        <fetcher.Form method="post">
            <button
                className="text-amber-500 text-xl"
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
                name="favorite"
                value={favorite ? "false" : "true"}
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
};
