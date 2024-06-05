"use client"

import { giveRating } from "@/app/chats/[id]/actions";
import Rating from "@mui/material/Rating";
import { revalidatePath } from "next/cache";
import { useState } from "react";

interface ratingProps {
    rater: number,
    ratee: number,
    productId: number,
    existingRating: number,
    chatPath: string,
}

export default function UserRating({ rater, ratee, productId, existingRating, chatPath }: ratingProps) {
    const [rating, setRating] = useState(existingRating);

    const updateRating = async (newRating: number | null) => {
        if (newRating !== null) {
            setRating(newRating);
            console.log(newRating);
            await giveRating(rater, ratee, productId, newRating, chatPath);
        }
    }
    if (rating !== 0) {
        return (
            <div>
                <Rating
                    name="simple-controlled"
                    size="small"
                    value={rating}
                    onChange={(event, newValue) => updateRating(newValue)}
                />
            </div>
        )
    }
    else {
        return (
            <div>
                <Rating
                    name="simple-controlled"
                    size="small"
                    value={0}
                    onChange={(event, newValue) => updateRating(newValue)}
                />
            </div>
        )
    }
}
