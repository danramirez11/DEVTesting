interface TextInputFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function TextInputField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: TextInputFieldProps) {
  return (
    <label htmlFor={id} className="text-input-field">
      <span>{label}</span>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
