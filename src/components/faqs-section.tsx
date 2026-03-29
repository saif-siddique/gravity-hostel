import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqsSection() {
	return (
		<div className="mx-auto w-full max-w-3xl space-y-7 px-4 pt-16">
			<div className="space-y-2">
				<h2 className="font-semibold text-3xl md:text-4xl">
					Frequently Asked Questions
				</h2>
				<p className="max-w-2xl text-muted-foreground">
					Here are some common questions and answers about our hostel
					management services. If you don't find the answer you're looking
					for, feel free to reach out.
				</p>
			</div>
			<Accordion
				className="-space-y-px w-full rounded-lg bg-card shadow dark:bg-card/50"
				collapsible
				defaultValue="item-1"
				type="single"
			>
				{questions.map((item) => (
					<AccordionItem
						className="relative border-x first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b"
						key={item.id}
						value={item.id}
					>
						<AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
							{item.title}
						</AccordionTrigger>
						<AccordionContent className="px-4 pb-4 text-muted-foreground">
							{item.content}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<p className="text-muted-foreground">
				Can't find what you're looking for? Contact our{" "}
				<a className="text-primary hover:underline" href="#">
					customer support team
				</a>
			</p>
		</div>
	);
}

const questions = [
	{
		id: "item-1",
		title: "What is Gravity Hostel Management Platform?",
		content:
			"Gravity is a next-generation, AI-powered hostel management platform designed to streamline operations, automate billing, and enhance the resident experience. It is trusted by 500+ forward-thinking hostels including Taqwa, Rehmani, and Subhan hostels.",
	},
	{
		id: "item-2",
		title: "How does the Intelligent Room Management work?",
		content:
			"Our system uses smart allocation algorithms to optimize occupancy and match compatible roommates. It features real-time vacancy tracking, instant assignment, and automates the entire room assignment workflow.",
	},
	{
		id: "item-3",
		title: "Is there any advance payment or security fee required?",
		content:
			"No! Gravity operates with a flexible model designed for hostel owners—there is no advance payment required, no security fee, and you can cancel anytime. We believe in earning your trust through our software's performance.",
	},
	{
		id: "item-4",
		title: "What features are included in the Gravity platform?",
		content:
			"The platform offers a comprehensive suite of tools including automated smart billing, real-time analytics dashboards, mobile-first design for anywhere access, a dedicated staff portal for wardens, and enterprise-grade security with IoT integration.",
	},
	{
		id: "item-5",
		title: "How does the automated billing system work?",
		content:
			"Gravity provides streamlined billing and payment processing with automated invoicing, real-time tracking, and automatic payment reminders. It ensures zero hidden charges and complete transparency for both administration and residents.",
	},
	{
		id: "item-6",
		title: "How reliable is the Gravity platform?",
		content:
			"Gravity delivers enterprise-grade reliability with 99.9% system uptime. Our robust infrastructure ensures that your data is secure and accessible 24/7 from any device.",
	},
	{
		id: "item-7",
		title: "What kind of support do you provide?",
		content:
			"We offer round-the-clock 24/7 concierge support from our trained team. Whether it's a technical query, setup concern, or an emergency, our help is always just a message away.",
	},
];
