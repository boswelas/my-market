"use client"

import { giveRating } from "@/app/chats/[id]/actions";
import Rating from "@mui/material/Rating";
import { useState } from "react";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

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
            <div className="flex flex-col justify-center items-center">
                <Rating
                    name="simple-controlled"
                    size="medium"
                    emptyIcon={<StarBorderOutlinedIcon style={{ color: 'gray' }} fontSize="inherit" />}
                    value={rating}
                    onChange={(event, newValue) => updateRating(newValue)}
                />
            </div>
        )
    }
    else {
        return (
            <div className="flex flex-col justify-center items-center">
                <Rating
                    name="simple-controlled"
                    size="medium"
                    emptyIcon={<StarBorderOutlinedIcon style={{ color: 'gray' }} fontSize="inherit" />}
                    value={0}
                    onChange={(event, newValue) => updateRating(newValue)}
                />
            </div>
        )
    }
}
