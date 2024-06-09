"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState, useCallback } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
    initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const fetchMoreProducts = useCallback(async () => {
        setIsLoading(true);
        const newProducts = await getMoreProducts(page + 1);
        if (newProducts.length !== 0) {
            setProducts((prev) => {
                const uniqueProductsMap = new Map(prev.map(product => [product.id, product]));
                newProducts.forEach(product => {
                    if (!uniqueProductsMap.has(product.id)) {
                        uniqueProductsMap.set(product.id, product);
                    }
                });
                return Array.from(uniqueProductsMap.values());
            });
            setPage((prev) => prev + 1);
        } else {
            setIsLastPage(true);
        }
        setIsLoading(false);
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries, observer) => {
                const element = entries[0];
                if (element.isIntersecting && trigger.current) {
                    observer.unobserve(trigger.current);
                    await fetchMoreProducts();
                }
            },
            {
                threshold: 1.0,
            }
        );
        if (trigger.current) {
            observer.observe(trigger.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [fetchMoreProducts]);

    return (
        <div className="p-5 flex flex-col gap-5">
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
            {!isLastPage ? (
                <span ref={trigger} />
            ) : (
                <span className="mt-5 text-sm text-neutral-400 inline-block text-center align-middle">End of Products</span>
            )}
        </div>
    );
}
