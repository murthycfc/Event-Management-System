import ReactSelect from "react-select";

export default function Select({label, initial ,options=[], ...props}){
    return(
        <div className="mb-3">
            <label
                htmlFor={props.id}
                className="form-label"
            >{label}</label>

            {/* <select className="form-select" {...props}>
                <option value="">{initial}</option>
                {options.map((option)=>(
                    <option key={option.id || option} value={option.id || option}>
                        {option.name || option}
                    </option>
                ))}
            </select> */}

            <ReactSelect
                options={options}
                {...props}
            />
        </div>
    )
}