import type {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export default function Index() {
    return (
        <div className="flex flex-col p-16 gap-8">
            <h1 className="text-6xl font-bold text-center">Welcome to Remix</h1>
            <ul className="flex flex-col gap-3 list-disc ml-3">
                <li>
                    <a
                        target="_blank"
                        href="https://remix.run/tutorials/blog"
                        rel="noreferrer"
                        className="hover:text-blue-600"
                    >
                        15m Quickstart Blog Tutorial
                    </a>
                </li>
                <li>
                    <a
                        target="_blank"
                        href="https://remix.run/tutorials/jokes"
                        rel="noreferrer"
                        className="hover:text-blue-600"
                    >
                        Deep Dive Jokes App Tutorial
                    </a>
                </li>
                <li>
                    <a target="_blank" href="https://remix.run/docs" rel="noreferrer" className="hover:text-blue-600">
                        Remix Docs
                    </a>
                </li>
            </ul>
        </div>
    );
}
