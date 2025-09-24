import React from 'react'

interface Error {
    [key: string]: string
}
interface Data {
    [key: string]: string
}
// Reusable validation functions
const required = (value: string, fieldName: string): string => {
    if (!value) {
        return `${fieldName} is required`
    }
    return ''
}

const email = (value: string): string => {
    if (!value) {
        return 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address'
    }
    return ''
}

const passwordMatch = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) {
        return 'Confirm Password is required'
    }
    if (confirmPassword !== password) {
        return 'Passwords do not match'
    }
    return ''
}

export const validationFunction = (data: Data) => {
    console.log(data)
    let error: Error = {}
    
    error.name = required(data.name, 'Name')
    error.email = email(data.email)
    error.password = required(data.password, 'Password')
    error.confirmPassword = passwordMatch(data.password, data.confirmPassword)
    
    // Remove empty error messages
    Object.keys(error).forEach(key => {
        if (!error[key]) {
            delete error[key]
        }
    })
    
    return error
}

// Login validation function
export const loginValidationFunction = (data: { email: string; password: string }) => {
    let error: Error = {}
    
    error.email = email(data.email)
    error.password = required(data.password, 'Password')
    
    // Remove empty error messages
    Object.keys(error).forEach(key => {
        if (!error[key]) {
            delete error[key]
        }
    })
    
    return error
}

// Additional validation functions
const number = (value: string, fieldName: string): string => {
    if (!value) {
        return `${fieldName} is required`
    } else if (isNaN(Number(value)) || Number(value) <= 0) {
        return `Please enter a valid number greater than 0`
    }
    return ''
}

const dateRange = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) {
        return '' // Let required validation handle empty dates
    }
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start > end) {
        return 'Start date must be before end date'
    }
    return ''
}

// Event creation validation function
export const eventValidationFunction = (data: Data) => {
    let error: Error = {}
    
    error.title = required(data.title, 'Event title')
    error.description = required(data.description, 'Event description')
    error.maxAttendance = number(data.maxAttendance, 'Max attendance')
    error.startDate = required(data.startDate, 'Start date')
    error.endDate = required(data.endDate, 'End date')
    error.startTime = required(data.startTime, 'Start time')
    error.endTime = required(data.endTime, 'End time')
    error.street = required(data.street, 'Street address')
    error.city = required(data.city, 'City')
    error.state = required(data.state, 'State/Province')
    error.zip = required(data.zip, 'Postal code')
    
    // Date range validation
    const dateRangeError = dateRange(data.startDate, data.endDate)
    if (dateRangeError) {
        error.endDate = dateRangeError // Show error on end date field
    }
    
    // Remove empty error messages
    Object.keys(error).forEach(key => {
        if (!error[key]) {
            delete error[key]
        }
    })
    
    return error
}