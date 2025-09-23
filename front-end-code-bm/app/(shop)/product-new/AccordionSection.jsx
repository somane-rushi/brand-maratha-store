import { useState } from "react";

const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        className="w-full text-left font-semibold py-2"
        onClick={() => setOpen(!open)}
      >
        {title} {open ? "▲" : "▼"}
      </button>
      {open && <div className="pl-4 mt-2">{children}</div>}
      <hr className="mt-3" />
    </div>
  );
};

export default AccordionSection;
