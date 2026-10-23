export default function formatDate(dateString){
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-us", {
        weekday: "short"
    })

    const dayOfMonth = date.toLocaleDateString("en-US", {
        day: "numeric"
    });

    const month = date.toLocaleDateString("en-US", {
        month: "short"
    });

    return `${day}, ${dayOfMonth} ${month}`;
}

export function formatDate1(dateString){
    const date = new Date(dateString);

    // const day = date.toLocaleDateString("en-us", {
    //     weekday: ""
    // })

    const dayOfMonth = date.toLocaleDateString("en-US", {
        day: "numeric"
    });

    const month = date.toLocaleDateString("en-US", {
        month: "short"
    });

    const year = date.toLocaleDateString("en-us",{
        year: "numeric"
    })

    return `${dayOfMonth} ${month} ${year}`;
}