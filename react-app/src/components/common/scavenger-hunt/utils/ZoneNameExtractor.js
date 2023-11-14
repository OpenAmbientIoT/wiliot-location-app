const extractZoneName = (fullName) => {
    const parts = fullName.split('-');
    if (parts.length >= 3) {
        const mainName = parts[1].replace(/_/g, ' ').split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize each word
        ).join(' ');

        if (parts[2] && /^\d+$/.test(parts[2])) {
            return `${mainName} ${parts[2]}`;
        } else {
            return mainName;
        }
    }
    return fullName; // Return the original name if it doesn't match the expected format
};

export default extractZoneName;