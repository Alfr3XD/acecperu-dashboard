import ContentPage from "./content";
import { getProduct, getProductList } from "@Controller/producto/get";

export default async function ProductPage({params}: {params: {slug: string}}) {
    const data = await getProduct(Number(params.slug))
    
    if(data.status === "error" || data.data === null) {
        return <div className="h-full">
            <h1 className="text-4xl text-center font-bold px-8 pt-40">
                ESTE USUARIO NO SE ENCUENTRA
            </h1>
        </div>
    }

    return (
        <ContentPage product={data.data} />
    )
}

export async function generateStaticParams() {
    const product = await getProductList();

    if(product.status === "ok") {
        return product.data ? 
        product.data.map((x) => ({ slug: `${x.id}` })) : 
        []
    } else {
        return [] 
    }
}