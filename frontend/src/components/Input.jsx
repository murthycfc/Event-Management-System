import { useState } from "react"

export default function Input({icon, label, isRequired, error,eye, ...props}){
   
    return (
        <div className="mb-3">
            <label
                htmlFor={props.id}
                className="form-label"
            >{label ? label : ''} {isRequired? <span className="text-danger">*</span>: ''}</label>
            
            <div className="input-group">
                { icon && (
                    <span className="input-group-text bg-white border-end-0 text-muted">{icon}</span>
                )}
                <input 
                    className={`form-control shadow-none  ${icon ? 'border-start-0 ps-0': ''}`}
                    {...props}
                    style={{ borderColor: '#dee2e6' }} 
                />
                { eye && (
                    <span className="input-group-text bg-white text-muted">{eye}</span>
                )

                }
            </div>
            
            {   error && (
                <div className="text-danger small mt-1">
                    {error}
                </div>
            ) 
            }
        </div>
    )
}