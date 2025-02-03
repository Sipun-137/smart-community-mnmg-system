import React from "react";
interface ContentDisplayProps {
    links: { label: string; url: string }[];
  }
const Navbar: React.FC<ContentDisplayProps> = ({ links }) => {
  return (
    <>
      <ul className="mt-4 space-y-2 text-white overflow-auto ">
        {links.map((item) => (
          <li key={item.label} className="p-2">
            <a href={item.url} className=" hover:text-gray-900">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Navbar;