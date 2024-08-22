import { formatToDollar, formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
    title: string;
    price: number;
    created_at: Date;
    photo: string;
    id: number;
}

export default function ListProduct({ title, price, created_at, photo, id }: ListProductProps) {
    return (
        <Link href={`/products/${id}`} className="">
            <div className="flex md:flex-col bg-neutral-800 rounded-lg w-96 md:w-[17em] md:h-96 shadow-xl hover:shadow-2xl">
                <div className="flex items-center justify-center md:w-full md:h-80 md:mt-[3%]">
                    <div className="relative md:w-60 md:h-72 size-28">
                        <Image fill src={photo} alt={title} className="object-cover rounded-md md:rounded-lg" />
                    </div>
                </div>
                <div className="flex flex-col ml-5 md:ml-0  md:items-center md:text-center justify-center text-white p-2 w-full">
                    <span className="text-lg font-normal w-[10.5em] overflow-hidden text-ellipsis whitespace-nowrap">
                        {title}
                    </span>
                    <span className="text-sm text-neutral-400">{formatToTimeAgo(created_at.toString())}</span>
                    <span className="text-md ">${formatToDollar(price)}</span>
                </div>
            </div>
        </Link>
    );
}
