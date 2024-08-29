export default function Loading() {
    return (
        <div className="p-5 animate-pulse flex justify-center gap-5">
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                {[...Array(8)].map((_, index) => (
                    <div key={index} className="flex md:flex-col bg-neutral-800 rounded-lg w-80 sm:w-96 md:w-[17em] md:h-96 shadow-xl hover:shadow-2xl">
                        <div className="flex items-center justify-center md:w-full md:h-80 md:mt-[3%]">
                            <div className="relative bg-neutral-700 md:w-60 md:h-72 size-28 rounded-lg" />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex flex-col ml-5 md:ml-0 bg-neutral-700 justify-center rounded-lg p-2 w-[10em] md:w-[70%] mb-1" />
                            <div className="flex flex-col ml-5 md:ml-0 bg-neutral-700 justify-center rounded-lg p-2 w-[5em] md:w-[60%] mb-1" />
                            <div className="flex flex-col ml-5 md:ml-0 bg-neutral-700 justify-center rounded-lg p-2 w-[2em] md:w-[50%] mb-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
