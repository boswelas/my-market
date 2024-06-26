export function formatToDollar(price: number) {
    return price.toLocaleString("en-US")
}

export function formatToTimeAgo(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.round((time - now) / dayInMs);
    const formatter = new Intl.RelativeTimeFormat("en-US")
    return formatter.format(diff, "days");
}

export function GetPostTime(timestamp: Date): string {
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

export function GetChatTime(timestamp: Date): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const differenceInMilliseconds = now.getTime() - messageTime.getTime();
    const oneHourInMilliseconds = 1000 * 60 * 60;
    const oneDayInMilliseconds = oneHourInMilliseconds * 24;
    const oneWeekInMilliseconds = oneDayInMilliseconds * 7;
    if (differenceInMilliseconds < oneDayInMilliseconds) {
        return GetChatMessageTime(timestamp)
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

export function GetChatMessageTime(timestamp: Date): string {
    const time = new Date(timestamp);
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? 'AM' : 'PM';
    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes} ${period}`;
    return timeString;
}
