export function Card(props: { children: React.ReactNode }) {
	return (
		<div className="p-4 border border-primary-100 text-wrap max-w-md">
			{props.children}
		</div>
	);
}