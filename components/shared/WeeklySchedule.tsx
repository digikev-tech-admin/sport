import { Clock } from "lucide-react";
import { Input } from "../ui/input";


interface TimeSlot {
    startTime: string;
    endTime: string;
  }
  
  export interface WeeklySchedule {
    [key: string]: TimeSlot;
  }


  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];
  


export const WeeklyScheduleComponent = ({ 
    value, 
    onChange,
    disabled
  }: { 
    value: WeeklySchedule;
    onChange: (schedule: WeeklySchedule) => void;
    disabled?: boolean;
  }) => {
    const handleTimeChange = (day: string, field: "startTime" | "endTime", time: string) => {
      const newSchedule = { ...value };
      if (!newSchedule[day]) {
        newSchedule[day] = { startTime: "", endTime: "" };
      }
      newSchedule[day][field] = time;
      onChange(newSchedule);
    };
  
    const toggleDay = (day: string) => {
      const newSchedule = { ...value };
      if (newSchedule[day]) {
        delete newSchedule[day];
      } else {
        newSchedule[day] = { startTime: "09:00", endTime: "10:00" };
      }
      onChange(newSchedule);
    };
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekly Schedule</h3>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`p-2 rounded-lg transition
                  ${value[day] ? "bg-purple-50 border border-purple-200" : "hover:bg-gray-50"}
                `}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <button
                    type="button"
                    className={`capitalize font-medium px-3 py-1 rounded transition w-full sm:w-auto
                      ${value[day]
                        ? "bg-purple-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-100"}
                    `}
                    onClick={() => toggleDay(day)}
                    disabled={disabled}
                  >
                    {day}
                  </button>
                  {value[day] && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <Input
                          type="time"
                          value={value[day].startTime}
                          onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                          className="w-full sm:w-28 border-gray-300"
                          disabled={disabled}
                        />
                      </div>
                      <span className="text-gray-500 font-medium text-center sm:text-left">to</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={value[day].endTime}
                          onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                          className="w-full sm:w-28 border-gray-300"
                          disabled={disabled}
                        />
                        {/* <Clock className="h-4 w-4 text-gray-400" /> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  