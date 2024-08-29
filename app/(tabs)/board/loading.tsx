
"use client"
import { ThreeDots } from "react-loader-spinner";


export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#737373"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}
