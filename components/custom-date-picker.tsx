import React, { forwardRef, MouseEventHandler } from 'react';
// Removed unused useState import
// Removed unused DatePicker import (assuming this component is only the input)
import 'react-datepicker/dist/react-datepicker.css';

// 1. Define an interface for the props expected by CustomDateInput
interface CustomDateInputProps {
  value?: string; // The formatted date string (optional if nothing selected)
  onClick?: MouseEventHandler<HTMLInputElement>; // Function to open the picker
  placeholder?: string; // Placeholder text
  // You can add any other standard input attributes if needed, e.g.:
  // id?: string;
  // name?: string;
}

// 2. Specify the element type (HTMLInputElement) and the props type (CustomDateInputProps) in forwardRef
export const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, placeholder }, ref) => { // Destructure the typed props
    console.log('CustomDateInput received props:', { value, onClick, placeholder }); 

    return (
        <div className="relative">
        <input
            ref={ref} // Assign the ref passed down by DatePicker (now correctly typed)
            type="text"
            className="w-full text-sm text-black border border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-3 px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            onClick={onClick} // This opens the date picker calendar
            value={value || ''} // Use value, default to empty string if undefined/null
            placeholder={placeholder} // Show the placeholder text
            readOnly // Prevent manual text input, force selection via picker
        />
        {/* Position the icon inside the input */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {/* Calendar Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5v-.008ZM7.5 12h.008v.008H7.5v-.008ZM9.75 12h.008v.008H9.75v-.008ZM14.25 15h.008v.008H14.25v-.008ZM14.25 12h.008v.008H14.25v-.008ZM16.5 15h.008v.008H16.5v-.008ZM16.5 12h.008v.008H16.5v-.008Z" />
            </svg>
        </span>
        </div>
    )
    
    }
);

// Optional: Add display name for better debugging in React DevTools
CustomDateInput.displayName = 'CustomDateInput';
