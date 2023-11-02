import {
    getUser,
    getUsers
} from "@Controller/usuario/get";
import ContentPage from "./content";

export default async function UserPage({params}: {params: {slug: string}}) {
    const data = await getUser(Number(params.slug))
    
    if(data.status === "error") {
        return <div className="h-full">
            <h1 className="text-4xl text-center font-bold px-8 pt-40">
                ESTE USUARIO NO SE ENCUENTRA
            </h1>
        </div>
    }

    return (
        <ContentPage user={data.data} />
    )
}

export async function generateStaticParams() {
    const users = await getUsers();

    if(users.status === "ok") {
        return users.data ? 
        users.data.map((x) => ({ slug: `${x.id}` })) : 
        []
    } else {
        return [] 
    }
}