import SlSwitch from "@shoelace-style/shoelace/dist/react/switch/index.js";
import {
	toggleAxis,
	toggleGrid,
} from "../store/features/experienceSettings/experienceSettingsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import "./Footer.css";

export default function Footer() {
	const dispatch = useAppDispatch();
	const axisActive = useAppSelector(
		(state) => state.experienceSettings.axisActive,
	);
	const gridActive = useAppSelector(
		(state) => state.experienceSettings.gridActive,
	);

	return (
		<footer className="footer">
			<div className="footer-controls">
				<div className="control">
					<SlSwitch
						checked={gridActive}
						onSlChange={() => dispatch(toggleGrid())}
					>
						Grid
					</SlSwitch>
				</div>
				<div className="control">
					<SlSwitch
						checked={axisActive}
						onSlChange={() => dispatch(toggleAxis())}
					>
						Axis
					</SlSwitch>
				</div>
			</div>
		</footer>
	);
}
