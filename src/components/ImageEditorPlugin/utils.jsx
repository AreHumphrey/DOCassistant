export function formatDate(dateStr) {
    if (dateStr == undefined) {
        return dateStr
    } else if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4)
        const month = dateStr.substring(4, 6)
        const day = dateStr.substring(6, 8)

        return `${year}/${month}/${day}`
    } else {
        return dateStr
    }
}