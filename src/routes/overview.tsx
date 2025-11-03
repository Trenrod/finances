import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/overview")({
	component: OverView,
});

export function OverView() {
	return (
		<div className="alert"></div>
	);
}