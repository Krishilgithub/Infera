import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MeetingAnalysis, ParticipantSentiment } from '@/lib/types/meeting-analysis';

interface MeetingAnalyticsProps {
    meetingId: string;
}

export default function MeetingAnalytics({ meetingId }: MeetingAnalyticsProps) {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
    const [sentiments, setSentiments] = useState<ParticipantSentiment[]>([]);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await fetch(`/api/meetings/analysis?meetingId=${meetingId}`);
                const data = await response.json();

                if (data.success) {
                    setAnalysis(data.data.analysis);
                    setSentiments(data.data.sentiments);
                }
            } catch (error) {
                console.error('Error fetching meeting analysis:', error);
            } finally {
                setLoading(false);
            }
        };

        if (meetingId) {
            fetchAnalysis();
        }
    }, [meetingId]);

    if (loading) {
        return <div>Loading analysis...</div>;
    }

    if (!analysis) {
        return <div>No analysis available</div>;
    }

    const getSentimentEmoji = (score: number) => {
        if (score >= 0.5) return '😊';
        if (score >= 0) return '🙂';
        if (score >= -0.5) return '😐';
        return '😕';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Meeting Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="summary">
                    <TabsList>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                        <TabsTrigger value="keyPoints">Key Points</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="mt-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Meeting Summary</h3>
                            <p className="text-gray-600 dark:text-gray-300">{analysis.summary}</p>

                            <h4 className="font-semibold mt-4">Action Items:</h4>
                            <ul className="list-disc list-inside space-y-2">
                                {analysis.action_items.map((item, index) => (
                                    <li key={index} className="text-gray-600 dark:text-gray-300">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>

                    <TabsContent value="sentiment" className="mt-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold">Overall Sentiment</h3>
                                <span className="text-2xl">{getSentimentEmoji(analysis.overall_sentiment)}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Score: {(analysis.overall_sentiment * 100).toFixed(1)}%
                            </p>

                            <h4 className="font-semibold mt-4">Individual Sentiments:</h4>
                            <div className="space-y-2">
                                {sentiments.map((sentiment) => (
                                    <div key={sentiment.id} className="flex items-center justify-between">
                                        <span>{sentiment.participant_id}</span>
                                        <div className="flex items-center space-x-2">
                                            <span>{getSentimentEmoji(sentiment.sentiment_score)}</span>
                                            <span>{(sentiment.sentiment_score * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="keyPoints" className="mt-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Key Discussion Points</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {analysis.key_points.map((point, index) => (
                                    <li key={index} className="text-gray-600 dark:text-gray-300">{point}</li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}