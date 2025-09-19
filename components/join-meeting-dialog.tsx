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

interface JoinMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    meetingCode?: string;
    onSubmit: (name: string) => void;
}

export function JoinMeetingDialog({
    open,
    onOpenChange,
    meetingCode,
    onSubmit,
}: JoinMeetingDialogProps) {
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
            setName("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Join Meeting</DialogTitle>
                        <DialogDescription>
                            {meetingCode
                                ? `Enter your name to join meeting ${meetingCode}`
                                : "Enter your name to join the meeting"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="font-medium text-sm">
                                Your Name
                            </label>
                            <Input
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Join Meeting</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}