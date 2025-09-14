"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

export interface Participant {
	id: string;
	name: string;
	role: "host" | "member";
	video: boolean;
	audio: boolean;
	avatar: string;
	isCurrentUser?: boolean;
	joinedAt?: Date;
}

export interface Meeting {
	id: string;
	title: string;
	hostId: string;
	participants: Participant[];
	isLive: boolean;
	createdAt: Date;
	meetingCode?: string;
}

interface MeetingContextType {
	currentMeeting: Meeting | null;
	participants: Participant[];
	isHost: boolean;
	isMuted: boolean;
	isVideoOff: boolean;
	meetingCode: string | null;
	createMeeting: (title: string) => Promise<string>;
	joinMeeting: (
		meetingCode: string,
		participantName: string
	) => Promise<boolean>;
	leaveMeeting: () => void;
	toggleMute: () => void;
	toggleVideo: () => void;
	addParticipant: (participant: Participant) => void;
	removeParticipant: (participantId: string) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: ReactNode }) {
	const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [isHost, setIsHost] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOff, setIsVideoOff] = useState(false);
	const [meetingCode, setMeetingCode] = useState<string | null>(null);

	// Generate a random meeting code
	const generateMeetingCode = (): string => {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let result = "";
		for (let i = 0; i < 6; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	};

	const createMeeting = async (title: string): Promise<string> => {
		const code = generateMeetingCode();
		const meetingId = `meeting_${Date.now()}`;

		const newMeeting: Meeting = {
			id: meetingId,
			title,
			hostId: "current_user", // In a real app, this would be the actual user ID
			participants: [],
			isLive: true,
			createdAt: new Date(),
			meetingCode: code,
		};

		setCurrentMeeting(newMeeting);
		setMeetingCode(code);
		setIsHost(true);

		// Add the host as the first participant
		const hostParticipant: Participant = {
			id: "current_user",
			name: "You",
			role: "host",
			video: true,
			audio: true,
			avatar: "🧑‍💻",
			isCurrentUser: true,
			joinedAt: new Date(),
		};

		setParticipants([hostParticipant]);

		// Store meeting in localStorage for persistence
		localStorage.setItem("currentMeeting", JSON.stringify(newMeeting));
		localStorage.setItem("meetingCode", code);

		return code;
	};

	const joinMeeting = async (
		meetingCode: string,
		participantName: string
	): Promise<boolean> => {
		try {
			// In a real app, this would validate the meeting code with a backend
			// For now, we'll simulate joining an existing meeting
			const meetingId = `meeting_${meetingCode}`;

			const newParticipant: Participant = {
				id: `participant_${Date.now()}`,
				name: participantName,
				role: "member",
				video: true,
				audio: true,
				avatar: "👤",
				isCurrentUser: true,
				joinedAt: new Date(),
			};

			// Create or update meeting
			const meeting: Meeting = {
				id: meetingId,
				title: `Meeting ${meetingCode}`,
				hostId: "other_host",
				participants: [newParticipant],
				isLive: true,
				createdAt: new Date(),
				meetingCode,
			};

			setCurrentMeeting(meeting);
			setParticipants([newParticipant]);
			setMeetingCode(meetingCode);
			setIsHost(false);

			// Store in localStorage
			localStorage.setItem("currentMeeting", JSON.stringify(meeting));
			localStorage.setItem("meetingCode", meetingCode);

			return true;
		} catch (error) {
			console.error("Failed to join meeting:", error);
			return false;
		}
	};

	const leaveMeeting = () => {
		setCurrentMeeting(null);
		setParticipants([]);
		setIsHost(false);
		setMeetingCode(null);
		setIsMuted(false);
		setIsVideoOff(false);

		// Clear localStorage
		localStorage.removeItem("currentMeeting");
		localStorage.removeItem("meetingCode");
	};

	const toggleMute = () => {
		setIsMuted(!isMuted);
		// Update participant audio status
		setParticipants((prev) =>
			prev.map((p) => (p.isCurrentUser ? { ...p, audio: !isMuted } : p))
		);
	};

	const toggleVideo = () => {
		setIsVideoOff(!isVideoOff);
		// Update participant video status
		setParticipants((prev) =>
			prev.map((p) => (p.isCurrentUser ? { ...p, video: !isVideoOff } : p))
		);
	};

	const addParticipant = (participant: Participant) => {
		setParticipants((prev) => [...prev, participant]);
	};

	const removeParticipant = (participantId: string) => {
		setParticipants((prev) => prev.filter((p) => p.id !== participantId));
	};

	// Load meeting from localStorage on mount
	useEffect(() => {
		const savedMeeting = localStorage.getItem("currentMeeting");
		const savedCode = localStorage.getItem("meetingCode");

		if (savedMeeting && savedCode) {
			try {
				const meeting = JSON.parse(savedMeeting);
				setCurrentMeeting(meeting);
				setMeetingCode(savedCode);
				setIsHost(meeting.hostId === "current_user");
			} catch (error) {
				console.error("Failed to load saved meeting:", error);
			}
		}
	}, []);

	const value: MeetingContextType = {
		currentMeeting,
		participants,
		isHost,
		isMuted,
		isVideoOff,
		meetingCode,
		createMeeting,
		joinMeeting,
		leaveMeeting,
		toggleMute,
		toggleVideo,
		addParticipant,
		removeParticipant,
	};

	return (
		<MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
	);
}

export function useMeeting() {
	const context = useContext(MeetingContext);
	if (context === undefined) {
		throw new Error("useMeeting must be used within a MeetingProvider");
	}
	return context;
}
