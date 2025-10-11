import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  interface CategoryFilterProps {
    title?: string;
    value: string;
    onChange: (value: string) => void;
    subscriptionOptions: string[] | Array<{ id: string; name?: string; title?: string }>;
  }
  
  const CategoryFilter = ({ title = "Level", value, onChange, subscriptionOptions }: CategoryFilterProps) => {
    const handleValueChange = (newValue: string) => {
      console.log(`${title} filter changed:`, newValue);
      onChange(newValue);
    };
  
    // Check if subscriptionOptions is an array of strings or objects
    const isStringArray = subscriptionOptions.length > 0 && typeof subscriptionOptions[0] === 'string';
  
  return (
    <div className="mb-2">
      <h3 className="text-[#742193] font-semibold text-sm mb-1">{title}</h3>

      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="border-[#742193] focus:ring-[#742193] w-full min-w-[120px]">
          <SelectValue placeholder={`Select ${title}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {title}</SelectItem>
          {isStringArray ? (
            // Handle string array (for backward compatibility)
            (subscriptionOptions as string[]).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))
          ) : (
            // Handle object array (for new usage)
            (subscriptionOptions as Array<{ id: string; name?: string; title?: string }>).map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name || option.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
  };
  
  export default CategoryFilter;
  