import { Clock, Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
  }
  
  export interface WeeklySchedule {
    [key: string]: TimeSlot[];
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
    const generateTimeSlotId = () => {
      return `timeslot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleTimeChange = (day: string, slotId: string, field: "startTime" | "endTime", time: string) => {
      const newSchedule = { ...value };
      if (!newSchedule[day]) {
        newSchedule[day] = [];
      }
      
      const slotIndex = newSchedule[day].findIndex(slot => slot.id === slotId);
      if (slotIndex !== -1) {
        newSchedule[day][slotIndex][field] = time;
        onChange(newSchedule);
      }
    };

    const addTimeSlot = (day: string) => {
      const newSchedule = { ...value };
      if (!newSchedule[day]) {
        newSchedule[day] = [];
      }
      
      const newSlot: TimeSlot = {
        id: generateTimeSlotId(),
        startTime: "09:00",
        endTime: "10:00"
      };
      
      newSchedule[day].push(newSlot);
      onChange(newSchedule);
    };

    const removeTimeSlot = (day: string, slotId: string) => {
      const newSchedule = { ...value };
      if (newSchedule[day]) {
        newSchedule[day] = newSchedule[day].filter(slot => slot.id !== slotId);
        if (newSchedule[day].length === 0) {
          delete newSchedule[day];
        }
        onChange(newSchedule);
      }
    };

    const toggleDay = (day: string) => {
      const newSchedule = { ...value };
      if (newSchedule[day] && newSchedule[day].length > 0) {
        delete newSchedule[day];
      } else {
        newSchedule[day] = [{
          id: generateTimeSlotId(),
          startTime: "09:00",
          endTime: "10:00"
        }];
      }
      onChange(newSchedule);
    };
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekly Schedule</h3>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`p-3 rounded-lg transition
                  ${value[day] && value[day].length > 0 ? "bg-purple-50 border border-purple-200" : "hover:bg-gray-50"}
                `}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className={`capitalize font-medium px-3 py-1 rounded transition
                        ${value[day] && value[day].length > 0
                          ? "bg-purple-600 text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-purple-100"}
                      `}
                      onClick={() => toggleDay(day)}
                      disabled={disabled}
                    >
                      {day}
                    </button>
                    {value[day] && value[day].length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(day)}
                        disabled={disabled}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {value[day] && value[day].length > 0 && (
                    <div className="space-y-2">
                      {value[day].map((slot) => (
                        <div key={slot.id} className="flex items-center gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => handleTimeChange(day, slot.id, "startTime", e.target.value)}
                              className="w-full sm:w-28 border-gray-300"
                              disabled={disabled}
                            />
                            <span className="text-gray-500 font-medium">to</span>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => handleTimeChange(day, slot.id, "endTime", e.target.value)}
                              className="w-full sm:w-28 border-gray-300"
                              disabled={disabled}
                            />
                          </div>
                          {value[day].length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(day, slot.id)}
                              disabled={disabled}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
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
  