export function unslugify(text) {
    return text.split('-').map(part =>
        part
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    )
}
