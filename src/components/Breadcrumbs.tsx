import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center space-x-1 px-10 pt-6 pb-2 text-sm font-semibold text-gray-800">
      {/* pt-6 = padding-top: 1.5rem (~24px) */}
      {/* Красная первая / */}
      <span className="text-[#FF0000]">/</span>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          {item.path ? (
            <Link to={item.path} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800">{item.label}</span>
          )}
          
          {/* Чёрная /, если не последний элемент */}
          {index < items.length - 1 && <span className="text-black">/</span>}
        </div>
      ))}
    </div>
  );
}
