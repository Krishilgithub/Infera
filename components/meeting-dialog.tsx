"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as DateCalendar } from "@/components/ui/calendar";

interface MeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: "instant" | "schedule";
    onSubmit: (data: {
        title: string;
        scheduledAt?: string;
        description?: string;
        participants?: string[];
    }) => void;
}

export function MeetingDialog({
    open,
    onOpenChange,
    type,
    onSubmit,
}: MeetingDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState("");
    const [participantEmail, setParticipantEmail] = useState("");
    const [participants, setParticipants] = useState<string[]>([]);

    const handleAddParticipant = () => {
        if (participantEmail && !participants.includes(participantEmail)) {
            setParticipants([...participants, participantEmail]);
            setParticipantEmail("");
        }
    };

    const handleRemoveParticipant = (email: string) => {
        setParticipants(participants.filter(p => p !== email));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title,
            description,
            participants,
            scheduledAt: selectedDate && selectedTime
                ? `${selectedDate.toISOString().split("T")[0]}T${selectedTime}:00Z`
                : undefined,
        };
        onSubmit(data);
        setTitle("");
        setDescription("");
        setSelectedDate(undefined);
        setParticipants([]);
        setSelectedTime("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader className="pb-4">
                        <DialogTitle>
                            {type === "instant" ? "Start New Meeting" : "Schedule Meeting"}
                        </DialogTitle>
                        <DialogDescription>
                            {type === "instant"
                                ? "Start an instant meeting now"
                                : "Schedule a meeting for later"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4 border-t border-b border-gray-100">
                        <div className="grid gap-2">
                            <label htmlFor="title" className="font-medium text-sm text-gray-700">
                                Meeting Title
                            </label>
                            <Input
                                id="title"
                                placeholder="Enter meeting title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        {type === "schedule" && (
                            <>
                                <div className="grid gap-2">
                                    <label className="font-medium text-sm">Date</label>
                                    <DateCalendar
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={(date) => date < new Date()}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="time" className="font-medium text-sm">
                                        Time
                                    </label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        required={type === "schedule"}
                                    />
                                </div>
                            </>
                        )}
                        <div className="grid gap-2">
                            <label htmlFor="description" className="font-medium text-sm">
                                Description (optional)
                            </label>
                            <Input
                                id="description"
                                placeholder="Add a description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="font-medium text-sm text-gray-700">
                                Participants
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter participant email"
                                    value={participantEmail}
                                    onChange={(e) => setParticipantEmail(e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddParticipant}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Add
                                </Button>
                            </div>
                            {participants.length > 0 && (
                                <div className="space-y-2">
                                    {participants.map((email) => (
                                        <div key={email} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                            <span className="text-sm text-gray-700">{email}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => handleRemoveParticipant(email)}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {type === "instant" ? "Start Meeting" : "Schedule Meeting"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}