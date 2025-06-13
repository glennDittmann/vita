import type SlAlertElement from "@shoelace-style/shoelace/dist/components/alert/alert.js";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";
import { useEffect, useRef } from "react";

type variant = "primary" | "success" | "neutral" | "warning" | "danger";

export default function Alert(props: {
	title: string;
	message: string;
	variant: variant;
}) {
	const ref = useRef<SlAlertElement | null>(null);

	useEffect(() => {
		if (ref.current !== null) {
			ref.current.toast();
		}
	}, []);

	return (
		<SlAlert ref={ref} variant={props.variant} duration={3000} closable>
			<SlIcon slot="icon" name="check2-circle" />
			<strong>{props.title}</strong>
			<br />
			{props.message}
		</SlAlert>
	);
}
