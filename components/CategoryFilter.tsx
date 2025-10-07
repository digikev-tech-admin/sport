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
  subscriptionOptions: string[];
}

const CategoryFilter = ({ title = "Level",value, onChange,subscriptionOptions }: CategoryFilterProps) => {
  return (
    <div>
      <h3 className="text-[#742193] font-semibold text-sm">{title}</h3>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className=" border-[#742193] focus:ring-[#742193]">
          <SelectValue placeholder={`Select ${title}`} />
        </SelectTrigger>
        <SelectContent>
          {subscriptionOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
