export default function timeFormatter(timeString){
    if(!timeString){
        return "";
    }
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return date.toLocaleTimeString('en-us', {
        hour:'numeric',
        minute: '2-digit',
        hour12: true 
    });
}