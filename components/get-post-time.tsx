export default function GetPostTime(timestamp: Date): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const differenceInMilliseconds = now.getTime() - messageTime.getTime();
    const oneHourInMilliseconds = 1000 * 60 * 60;
    const oneDayInMilliseconds = oneHourInMilliseconds * 24;
    const oneWeekInMilliseconds = oneDayInMilliseconds * 7;

    if (differenceInMilliseconds < oneHourInMilliseconds) {
        const diffInMinutes = Math.round(differenceInMilliseconds / (1000 * 60));
        return diffInMinutes === 0 ? 'just now' : `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (differenceInMilliseconds < oneDayInMilliseconds) {
        const diffInHours = Math.round(differenceInMilliseconds / oneHourInMilliseconds);
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (differenceInMilliseconds < oneWeekInMilliseconds) {
        const diffInDays = Math.floor(differenceInMilliseconds / oneDayInMilliseconds);
        return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else {
        return messageTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
}
