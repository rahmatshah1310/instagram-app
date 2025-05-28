import { forwardRef } from "react";

const InputField = forwardRef(
  ({ type, id, name, className, label, ...rest }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          // value={value}
          // onChange={onChange}
          ref={ref}
          {...rest}
          className={`peer block py-2 w-full appearance-none border bg-transparent px-2.5 text-sm text-white border-[#555555] focus:outline-none focus:ring-0 focus:border-[#555555] ${className}`}
          placeholder=" "
        />
        <label
          htmlFor={id}
          className="absolute top-2 left-2.5 z-10 origin-[0] transform text-base text-[#F5F5F5] transition-all duration-300
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
          peer-focus:-translate-y-3 peer-focus:scale-75
          peer-not-placeholder-shown:-translate-y-3 peer-not-placeholder-shown:scale-75"
        >
          {label}
        </label>
      </div>
    );
  }
);
export default InputField;
