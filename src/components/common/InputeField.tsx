import React from 'react'
import { TextField, Typography } from '@mui/material'

interface InputFieldProps{
    type: string
    label: string
    value: string
    placeholder?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    error?: boolean
    helperText?: string
    name?: string

}

export const InputField=({type, label, value, placeholder, onChange, error, helperText, name}: InputFieldProps)=>{
    return (

        <>

        <Typography variant="h6">{label}</Typography>
        <TextField
            fullWidth
            type={type === "textarea" ? undefined : type}
            multiline={type === "textarea"}
            rows={type === "textarea" ? 4 : undefined}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            name={name}
            variant="outlined"
            error={error}
            helperText={helperText}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                },
                '& .MuiInputLabel-root': {
                    color: '#666',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#007bff',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#007bff',
                },
            }}
        />
        </>
    )
}