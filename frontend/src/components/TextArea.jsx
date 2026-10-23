

export default function TextArea({label, isRequired, ...props}){
   
    return (
        <div className="mb-3">
            <label
                htmlFor={props.id}
                className="form-label"
            >{label ? label : ''}{isRequired ? <span className="text-danger"> *</span>: ''}</label>
            
            <textarea 
                className={`form-control shadow-none`}
                {...props}
                style={{ borderColor: '#dee2e6' }} 
            />
               
        </div>
    )
}