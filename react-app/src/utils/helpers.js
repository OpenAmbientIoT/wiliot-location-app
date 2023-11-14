export const capitalizeWords = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function debounce(func, wait) {
    let timeoutID

    if (!Number.isInteger(wait)) {
        console.warn("Called debounce without a valid number");
        wait = 300;
    }

    // conversion through any necessary as it won't satisfy criteria otherwise
    return function (debounce, ...args) {
        clearTimeout(timeoutID);
        const context = this;

        timeoutID = window.setTimeout(function () {
            func.apply(context, args);
        }, wait);
    }
        ;
}

export const getSpacing = (theme, value) => Number(theme.spacing(value).slice(0, -2))
