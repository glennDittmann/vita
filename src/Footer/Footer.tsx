import SlSwitch from "@shoelace-style/shoelace/dist/react/switch/index.js";
import { useDispatch, useSelector } from "react-redux";
import { toggleAxis, toggleGrid } from "../store/features/experienceSettings/experienceSettingsSlice";
import "./Footer.css";

export default function Footer() {
	const dispatch = useDispatch();
	const axisActive = useSelector(
		(state: any) => state.experienceSettings.axisActive,
	);
	const gridActive = useSelector(
		(state: any) => state.experienceSettings.gridActive,
	);

	return (
		<footer className="footer">
			<div className="footer-controls">
				<div className="control">
					<SlSwitch checked={gridActive} onSlChange={() => dispatch(toggleGrid())}>
						Grid
					</SlSwitch>
				</div>
				<div className="control">
					<SlSwitch checked={axisActive} onSlChange={() => dispatch(toggleAxis())}>
						Axis
					</SlSwitch>
				</div>
			</div>
		</footer>
	);
}
