import {ActionFunctionArgs, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, useLoaderData, useNavigate} from "@remix-run/react";
import {getContact, updateContact} from "../data";

export const loader = async ({params}: LoaderFunctionArgs) => {
    const contact = await getContact(params.contactId as string);
    if (!contact) {
        throw new Response("Not Found", {status: 404});
    }
    return json({contact});
};

export const action = async ({params, request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId as string, updates);
    return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
    const {contact} = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <Form key={contact.id} method="post" className="flex flex-col gap-6 m-10 text-xl">
            <p className="flex gap-6 items-center">
                <span className="w-40 text-2xl">Name</span>
                <input
                    defaultValue={contact.first}
                    aria-label="First name"
                    name="first"
                    type="text"
                    placeholder="First"
                    className="border border-gray-300 rounded-md p-2"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last}
                    name="last"
                    placeholder="Last"
                    type="text"
                    className="border border-gray-300 rounded-md p-2"
                />
            </p>
            <label className="flex items-center gap-6">
                <span className="w-40 text-2xl">Twitter</span>
                <input
                    defaultValue={contact.twitter}
                    name="twitter"
                    placeholder="@jack"
                    type="text"
                    className="border border-gray-300 rounded-md p-2 flex-1"
                />
            </label>
            <label className="flex items-center gap-6">
                <span className="w-40 text-2xl">Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                    className="border border-gray-300 rounded-md p-2 flex-1"
                />
            </label>
            <label className="flex items-center gap-6">
                <span className="w-40 text-2xl">Notes</span>
                <textarea
                    defaultValue={contact.notes}
                    name="notes"
                    rows={6}
                    className="border border-gray-300 rounded-md p-2 flex-1"
                />
            </label>
            <p className="ml-[182px] flex gap-3 items-center">
                <button type="submit"
                        className="border border-gray-300 rounded-md bg-white text-blue-600 py-1 p-2 font-medium">Save
                </button>
                <button type="button"
                        className="border border-gray-300 rounded-md bg-white text-black py-1 p-2 font-medium"
                        onClick={() => navigate(-1)}>Cancel
                </button>
            </p>
        </Form>
    );
}
