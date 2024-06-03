import db from "@/lib/database";

export async function getRatings(userId: number) {
    const userRatings = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            receivedRatings: {
                select: {
                    rating: true,
                }
            },
        },
    });
    if (!userRatings || userRatings.receivedRatings.length === 0) {
        return 0;
    }
    const ratings = userRatings.receivedRatings.map(r => r.rating);
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / ratings.length;
    return average;

}
