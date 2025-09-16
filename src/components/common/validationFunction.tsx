import React from 'react'

interface Error {
    [key: string]: string
}
interface Data {
    [key: string]: string
}
export const validationFunction = (data: Data) => {
   let error: Error = {}
   function validateName(name: string) {
    if (!name) {
        error.name = 'Name is required'
    }
   }
    function validateEmail(email: string) {
        if (!email) {
            error.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            error.email = 'Please enter a valid email address'
        }
    }
   function validatePassword(password: string) {
    if (!password) {
        error.password = 'Password is required'
    }
   }
   function validateConfirmPassword(confirmPassword: string) {
    if (!confirmPassword) {
        error.confirmPassword = 'Confirm Password is required'
    }
    if (confirmPassword !== data.password) {
        error.confirmPassword = 'Passwords do not match'
    }
   }
   function validateContact(contact: string) {
    if (!contact) {
        error.contact = 'Contact is required'
    }
   }
validateName(data.name)
validateEmail(data.email)
validatePassword(data.password)
validateConfirmPassword(data.confirmPassword)
validateContact(data.contact)
return error
}

// Login validation function
export const loginValidationFunction = (data: { email: string; password: string }) => {
   let error: Error = {}
   
   function validateEmail(email: string) {
        if (!email) {
            error.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            error.email = 'Please enter a valid email address'
        }
    }
    
   function validatePassword(password: string) {
    if (!password) {
        error.password = 'Password is required'
    }
   }
   
   validateEmail(data.email)
   validatePassword(data.password)
   
   return error
}