function Button({
  children,
  type = "button",
  textColor = "text-[#0a0a0a]",
  bgColor = "bg-[#f5f5f0] hover:bg-white",
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      <button
        type={type}
        className={`${bgColor} px-8 py-3 ${textColor} font-bold ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
