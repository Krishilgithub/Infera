"use client";

import { validateColorContrast } from "@/lib/accessibility-checker";
import { useEffect, useState } from "react";

export default function AccessibilityTest() {
	const [results, setResults] = useState<any>(null);

	useEffect(() => {
		const testResults = validateColorContrast();
		setResults(testResults);
		console.log("🎨 INFERA Color Accessibility Report:", testResults);
	}, []);

	if (!results) return <div>Running accessibility tests...</div>;

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">
				INFERA Color Accessibility Report
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<div className="bg-green-100 p-4 rounded-lg text-center">
					<div className="text-2xl font-bold text-green-800">
						{results.passed}
					</div>
					<div className="text-green-600">Passed</div>
				</div>
				<div className="bg-red-100 p-4 rounded-lg text-center">
					<div className="text-2xl font-bold text-red-800">
						{results.failed}
					</div>
					<div className="text-red-600">Failed</div>
				</div>
				<div className="bg-blue-100 p-4 rounded-lg text-center">
					<div className="text-2xl font-bold text-blue-800">
						{Math.round(
							(results.passed / (results.passed + results.failed)) * 100
						)}
						%
					</div>
					<div className="text-blue-600">Pass Rate</div>
				</div>
			</div>

			<div className="space-y-4">
				{results.results.map((result: any, index: number) => (
					<div
						key={index}
						className={`p-4 rounded-lg border-2 ${
							result.passed
								? "border-green-200 bg-green-50"
								: "border-red-200 bg-red-50"
						}`}
					>
						<div className="flex justify-between items-start mb-2">
							<h3 className="font-semibold">{result.name}</h3>
							<span
								className={`px-2 py-1 rounded text-xs font-bold ${
									result.grade === "AAA"
										? "bg-green-200 text-green-800"
										: result.grade === "AA"
										? "bg-blue-200 text-blue-800"
										: "bg-red-200 text-red-800"
								}`}
							>
								{result.grade}
							</span>
						</div>

						<div className="text-sm text-gray-600 mb-2">{result.usage}</div>

						<div className="flex items-center gap-4">
							<div
								className="w-16 h-8 rounded border"
								style={{
									backgroundColor: result.background,
									color: result.foreground,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "12px",
								}}
							>
								Text
							</div>
							<div className="text-sm">
								<strong>Ratio:</strong> {result.actualRatio}:1 (Required:{" "}
								{result.expectedRatio}:1)
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
