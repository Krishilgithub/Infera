import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export interface CalendarProps {
    selected: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    disabled?: (date: Date) => boolean;
}

export function Calendar({ selected, onSelect, disabled }: CalendarProps) {
    return (
        <DayPicker
            mode="single"
            selected={selected}
            onSelect={onSelect}
            disabled={disabled}
            fromDate={new Date()}
            showOutsideDays
        />
    );
}
