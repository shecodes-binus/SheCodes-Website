import React, { forwardRef, MouseEventHandler } from 'react';
import 'react-datepicker/dist/react-datepicker.css'; // Keep this if styles are global

// 1. Define an interface for the props expected by CustomTimeInput
interface CustomTimeInputProps {
  value?: string; // The formatted time string (optional if nothing selected)
  onClick?: MouseEventHandler<HTMLInputElement>; // Function to open the time picker
  placeholder?: string; // Placeholder text
  // Include other potential input props if needed
  // id?: string;
  // name?: string;
}

// 2. Specify the element type (HTMLInputElement) and the props type (CustomTimeInputProps) in forwardRef
export const CustomTimeInput = forwardRef<HTMLInputElement, CustomTimeInputProps>(
  ({ value, onClick, placeholder }, ref) => { // Destructure the typed props
    // Optional: log props for debugging
    // console.log('CustomTimeInput received props:', { value, onClick, placeholder });

    return (
      <div className="relative">
        <input
          ref={ref} // Assign the ref passed down by DatePicker
          type="text"
          // Use the exact same styling as CustomDateInput for consistency
          className="w-full text-sm text-black border border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-3 px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          onClick={onClick} // This opens the time picker dropdown
          value={value || ''} // Use value, default to empty string if undefined/null
          placeholder={placeholder} // Show the placeholder text
          readOnly // Prevent manual text input, force selection via picker
        />
        {/* Position the icon inside the input */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {/* Clock Icon SVG (Example from Heroicons) */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
      </div>
    );
  }
);

// Optional: Add display name for better debugging in React DevTools
CustomTimeInput.displayName = 'CustomTimeInput';