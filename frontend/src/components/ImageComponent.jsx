export default function ImageComponent({...props}){
    return(
        <div className="">
            <img 
                src="/stand-up-comedy.jpg"
                alt="event name"
                style={{
                        height:"300px",
                    }}
                {...props}
            />
        </div>
    )
}