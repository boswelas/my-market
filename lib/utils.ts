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
