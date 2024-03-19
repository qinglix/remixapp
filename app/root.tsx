import {cssBundleHref} from "@remix-run/css-bundle";
import {LinksFunction, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {
    Form, json,
    Links,
    LiveReload,
    Meta, NavLink,
    Outlet,
    Scripts,
    ScrollRestoration, useLoaderData, useNavigation, useSubmit,
} from "@remix-run/react";
import mainStyle from "./main.css";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {createEmptyContact, getContacts} from "~/data";
import {useEffect} from "react";

export const links: LinksFunction = () => [
    {rel: "stylesheet", href: mainStyle},
    ...(cssBundleHref ? [{rel: "stylesheet", href: cssBundleHref}] : []),
];

export const loader = async ({request}: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return json({contacts, q});
}

export const action = async () => {
    const contact = await createEmptyContact();
    // return json({contact});
    return redirect(`/contacts/${contact.id}/edit`);
}

export default function App() {
    const {contacts, q} = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const submit = useSubmit();

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q])

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body className="flex h-full w-full">
        <div className="h-screen w-88 bg-gray-100 flex flex-col border-r border-gray-300">
            <h1 className="text-lg font-bold flex items-center p-4 border-t border-gray-300 order-1">
                Remix Contacts
            </h1>
            <div className="flex items-center gap-2 p-4 border-b border-gray-300">
                <Form role="search" className="relative" onChange={(event) => {
                    const isFirstSearch = q === null;
                    submit(event.currentTarget, {
                        replace: !isFirstSearch,
                    });
                }}>
                    <MagnifyingGlassIcon className="h-5 w-5 absolute top-2 left-2"/>
                    <input
                        aria-label="Search contacts"
                        defaultValue={q || ""}
                        id="q"
                        name="q"
                        placeholder="Search"
                        type="search"
                        className="box-border w-full pl-8 pr-3 py-2 leading-5 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </Form>
                <Form method="post">
                    <button type="submit"
                            className="border border-gray-300 rounded-md bg-white text-blue-600 py-1 p-2 font-medium">
                        New
                    </button>
                </Form>
            </div>
            <nav className="p-4 flex-1 overflow-y-scroll overflow-x-hidden">
                {contacts.length ? (
                    <ul>
                        {contacts.map((contact) => (
                            <li className="my-1" key={contact.id}>
                                <NavLink
                                    className={({
                                                    isActive,
                                                    isPending
                                                }) => `flex items-center overflow-hidden whitespace-nowrap p-2 rounded-lg text-black no-underline transition-colors duration-100 hover:bg-gray-300 ${
                                        isActive
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : isPending
                                                ? "text-black"
                                                : "text-black"
                                    }`}
                                    to={`/contacts/${contact.id}`}>
                                    {contact.first || contact.last ? (
                                        <>
                                            {contact.first} {contact.last}
                                        </>
                                    ) : (
                                        <i>No Name</i>
                                    )}{" "}
                                    {contact.favorite ? (
                                        <span className="ml-2">★</span>
                                    ) : null}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        <i>No contacts</i>
                    </p>
                )}
            </nav>
        </div>
        <div className={navigation.state === "loading" ? "loading" : ""}>
            <Outlet/>
        </div>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
