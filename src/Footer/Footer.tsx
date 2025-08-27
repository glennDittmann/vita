import {
	selectShowVertices,
	toggleAxis,
	toggleGrid,
	toggleVertices,
} from "../store/features/experienceSettings/experienceSettingsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import "./Footer.css";
import { Switch } from "@mantine/core";

export default function Footer() {
	const dispatch = useAppDispatch();
	const axisActive = useAppSelector(
		(state) => state.experienceSettings.axisActive,
	);
	const gridActive = useAppSelector(
		(state) => state.experienceSettings.gridActive,
	);
	const showVertices = useAppSelector(selectShowVertices);

	return (
		<footer className="footer">
			<div className="footer-controls">
				<div className="control">
					<Switch
						checked={gridActive}
						onChange={() => dispatch(toggleGrid())}
						label="Grid"
					/>
				</div>
				<div className="control">
					<Switch
						checked={axisActive}
						onChange={() => dispatch(toggleAxis())}
						label="Axis"
					/>
				</div>
				<div className="control">
					<Switch
						checked={showVertices}
						onChange={() => dispatch(toggleVertices())}
						label="Vertices"
					/>
				</div>
			</div>
		</footer>
	);
}
