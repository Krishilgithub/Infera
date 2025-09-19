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

interface InviteTeamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { code: string; emails: string[] }) => void;
}

export function InviteTeamDialog({
    open,
    onOpenChange,
    onSubmit,
}: InviteTeamDialogProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [meetingCode, setMeetingCode] = useState("");
    const [emails, setEmails] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && meetingCode) {
            setStep(2);
        } else if (step === 2 && emails) {
            const emailList = emails.split(",").map((e) => e.trim()).filter(Boolean);
            onSubmit({ code: meetingCode, emails: emailList });
            // Reset form
            setMeetingCode("");
            setEmails("");
            setStep(1);
        }
    };

    const handleClose = () => {
        setMeetingCode("");
        setEmails("");
        setStep(1);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Invite Team Members</DialogTitle>
                        <DialogDescription>
                            {step === 1
                                ? "Enter the meeting code to invite team members"
                                : "Enter email addresses of team members"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {step === 1 ? (
                            <div className="grid gap-2">
                                <label htmlFor="code" className="font-medium text-sm">
                                    Meeting Code
                                </label>
                                <Input
                                    id="code"
                                    placeholder="Enter meeting code"
                                    value={meetingCode}
                                    onChange={(e) => setMeetingCode(e.target.value)}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <label htmlFor="emails" className="font-medium text-sm">
                                    Email Addresses
                                </label>
                                <Input
                                    id="emails"
                                    placeholder="Enter email addresses, separated by commas"
                                    value={emails}
                                    onChange={(e) => setEmails(e.target.value)}
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Separate multiple email addresses with commas
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {step === 2 && (
                            <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                Back
                            </Button>
                        )}
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {step === 1 ? "Next" : "Send Invites"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}