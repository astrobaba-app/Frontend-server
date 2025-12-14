import React from 'react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

interface FormFieldProps {
  type: 'input' | 'select' | 'textarea';
  name: string;
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function FormField({
  type,
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  disabled,
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  if (type === 'select') {
    return (
      <Select
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        options={options}
        required={required}
        error={error}
        disabled={disabled}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#F0DF20] focus:border-transparent transition-all resize-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <Input
      type={type}
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      error={error}
      disabled={disabled}
    />
  );
}
