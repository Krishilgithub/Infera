"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
    const generateTimeOptions = () => {
        const options: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const formattedHour = hour.toString().padStart(2, "0");
                const formattedMinute = minute.toString().padStart(2, "0");
                options.push(`${formattedHour}:${formattedMinute}`);
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Select time</option>
                    {timeOptions.map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
                <Clock className="absolute right-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
        </div>
    );
}