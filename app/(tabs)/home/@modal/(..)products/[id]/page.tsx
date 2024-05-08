import ProductDetail from "@/app/products/[id]/page";
import CloseButton from "@/components/close-button";

export default async function Modal({ params }: { params: { id: string } }) {
    const productId = params.id;
    let productDetails = ProductDetail({ params: { id: productId } });

    return (
        <div className="absolute w-full h-full  flex items-center justify-center 
        bg-black bg-opacity-60 left-0 top-0 mb-50 ">
            <CloseButton />
            {productDetails}
        </div>
    )
}
