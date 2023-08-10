/* eslint-disable react/jsx-key */
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Line,
	LineChart,
	Cell,
} from "recharts";
import jsonData from "../data/compiled/compiled-scouting/compiled.json";
import { ResponsiveContainer } from "recharts";
import React, { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
	Button,
	Container,
	Divider,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";

export const processData = () => {
	const processedData = {};
	jsonData.forEach((entry) => {
		const team = entry.team.split(" ")[0];
		const teleopPoints = entry["Teleop Points"];
		const autonPoints = entry["Auton Points"];
		const totalCones =
			entry["Auton Cones Lower"] +
			entry["Auton Cones Mid"] +
			entry["Auton Cones Upper"] +
			entry["Teleop Cones Lower"] +
			entry["Teleop Cones Mid"] +
			entry["Teleop Cones Upper"];
		const totalCubes =
			entry["Auton Cubes Lower"] +
			entry["Auton Cubes Mid"] +
			entry["Auton Cubes Upper"] +
			entry["Teleop Cubes Lower"] +
			entry["Teleop Cubes Mid"] +
			entry["Teleop Cubes Upper"];
		const totalHigh =
			entry["Auton Cubes Upper"] +
			entry["Teleop Cubes Upper"] +
			entry["Auton Cones Upper"] +
			entry["Teleop Cones Upper"];
		const totalMiddle =
			entry["Auton Cubes Mid"] +
			entry["Teleop Cubes Mid"] +
			entry["Auton Cones Mid"] +
			entry["Teleop Cones Mid"];
		const totalLow =
			entry["Auton Cubes Lower"] +
			entry["Teleop Cubes Lower"] +
			entry["Auton Cones Lower"] +
			entry["Teleop Cones Lower"];

		if (!processedData[team]) {
			processedData[team] = {
				team,
				teleopPoints: [teleopPoints],
				autonPoints: [autonPoints],
				totalCones: [totalCones],
				totalCubes: [totalCubes],
				totalHigh: [totalHigh],
				totalMiddle: [totalMiddle],
				totalLow: [totalLow],
			};
		} else {
			processedData[team].teleopPoints.push(teleopPoints);
			processedData[team].autonPoints.push(autonPoints);
			processedData[team].totalCones.push(totalCones);
			processedData[team].totalCubes.push(totalCubes);
			processedData[team].totalHigh.push(totalHigh);
			processedData[team].totalMiddle.push(totalMiddle);
			processedData[team].totalLow.push(totalLow);
		}
	});

	return Object.values(processedData).map((teamData) => {
		const avgTeleopPoints = Math.round(
			teamData.teleopPoints.reduce((acc, val) => acc + val, 0) /
				teamData.teleopPoints.length,
		);
		const avgAutonPoints = Math.round(
			teamData.autonPoints.reduce((acc, val) => acc + val, 0) /
				teamData.autonPoints.length,
		);
		const avgTotalCones = Math.round(
			teamData.totalCones.reduce((acc, val) => acc + val, 0) /
				teamData.totalCones.length,
		);
		const avgTotalCubes = Math.round(
			teamData.totalCubes.reduce((acc, val) => acc + val, 0) /
				teamData.totalCubes.length,
		);
		const avgHigh = Math.round(
			teamData.totalHigh.reduce((acc, val) => acc + val, 0) /
				teamData.totalHigh.length,
		);
		const avgMiddle = Math.round(
			teamData.totalMiddle.reduce((acc, val) => acc + val, 0) /
				teamData.totalMiddle.length,
		);
		const avgLow = Math.round(
			teamData.totalLow.reduce((acc, val) => acc + val, 0) /
				teamData.totalLow.length,
		);
		return {
			team: teamData.team,
			avgTeleopPoints,
			avgAutonPoints,
			avgTotalCones,
			avgTotalCubes,
			avgHigh,
			avgMiddle,
			avgLow,
			numPlayed: teamData.teleopPoints.length,
		};
	});
};

export const chargeData = (team) => {
	const teamData = jsonData.filter(
		(entry) => entry.team.split(" ")[0] === team,
	);

	const autonEngageCount = teamData.reduce(
		(count, entry) =>
			count + (entry["Auton Charge Station"] === "Engaged" ? 1 : 0),
		0,
	);
	const autonNotAttemptedCount = teamData.reduce(
		(count, entry) =>
			count + (entry["Auton Charge Station"] === "Not Attempted" ? 1 : 0),
		0,
	);
	const autonDockedCount = teamData.reduce(
		(count, entry) =>
			count +
			(entry["Auton Charge Station"] === "Docked" ||
			entry["Auton Charge Station"] === "Engaged"
				? 1
				: 0),
		0,
	);
	const totalAutonMatches = teamData.length - autonNotAttemptedCount;
	let autonEngagePercentage = 0;
	if (totalAutonMatches !== 0) {
		autonEngagePercentage = Math.round(
			(autonEngageCount / totalAutonMatches) * 100,
		);
	}

	let autonDockedPercentage = 0;
	if (totalAutonMatches !== 0) {
		autonDockedPercentage = Math.round(
			(autonDockedCount / totalAutonMatches) * 100,
		);
	}

	const teleopEngageCount = teamData.reduce(
		(count, entry) => count + (entry["Charge Station"] === "Engaged" ? 1 : 0),
		0,
	);
	const teleopNotAttemptedCount = teamData.reduce(
		(count, entry) =>
			count + (entry["Charge Station"] === "Not Attempted" ? 1 : 0),
		0,
	);
	const teleopDockedCount = teamData.reduce(
		(count, entry) =>
			count +
			(entry["Charge Station"] === "Docked" ||
			entry["Charge Station"] === "Engaged"
				? 1
				: 0),
		0,
	);
	const totalTeleopMatches = teamData.length - teleopNotAttemptedCount;
	let teleopEngagePercentage = 0;
	if (totalTeleopMatches !== 0) {
		teleopEngagePercentage = Math.round(
			(teleopEngageCount / totalTeleopMatches) * 100,
		);
	}

	let teleopDockedPercentage = 0;
	if (totalTeleopMatches !== 0) {
		teleopDockedPercentage = Math.round(
			(teleopDockedCount / totalTeleopMatches) * 100,
		);
	}

	return {
		autonEngagePercentage,
		autonDockedPercentage,
		teleopEngagePercentage,
		teleopDockedPercentage,
	};
};

export const matchTrends = (team) => {
	const teamData = jsonData.filter(
		(entry) => entry.team.split(" ")[0] === team,
	);

	const data = teamData.map((entry) => ({
		match: entry.match,
		Auton: entry["Auton Points"],
		Teleop: entry["Teleop Points"],
		Total: entry["Auton Points"] + entry["Teleop Points"],
		"Total Cones":
			entry["Auton Cones Lower"] +
			entry["Auton Cones Mid"] +
			entry["Auton Cones Upper"] +
			entry["Teleop Cones Lower"] +
			entry["Teleop Cones Mid"] +
			entry["Teleop Cones Upper"],
		"Total Cubes":
			entry["Auton Cubes Lower"] +
			entry["Auton Cubes Mid"] +
			entry["Auton Cubes Upper"] +
			entry["Teleop Cubes Lower"] +
			entry["Teleop Cubes Mid"] +
			entry["Teleop Cubes Upper"],
		"Total Low":
			entry["Auton Cubes Lower"] +
			entry["Teleop Cubes Lower"] +
			entry["Auton Cones Lower"] +
			entry["Teleop Cones Lower"],
		"Total Middle":
			entry["Auton Cubes Mid"] +
			entry["Teleop Cubes Mid"] +
			entry["Auton Cones Mid"] +
			entry["Teleop Cones Mid"],
		"Total Upper":
			entry["Auton Cubes Upper"] +
			entry["Teleop Cubes Upper"] +
			entry["Auton Cones Upper"] +
			entry["Teleop Cones Upper"],
		"Under Defense": entry["Under Defense"].split(" ")[0],
		"Defense Comments": entry["Defense Notes"],
		"Other Notes": entry["Other Notes"],
		"Defense Rating": entry["Defense Rating"].split(" ")[0],
		"Robot Rating": entry["Robot Rating"].split(" ")[0],
	}));
	return [...data].sort((a, b) => a.match - b.match);
};

function GroupChart({ data }) {
	const [selectedTeam, setSelectedTeam] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [inputValue, setInputValue] = useState("");
	

	const handleBarClick = (team) => {
		setSelectedTeam(team);
    setInputValue(team.team);
	};

	const sortedData = [...data].sort(
		(a, b) =>
			b.avgTeleopPoints +
			b.avgAutonPoints -
			(a.avgTeleopPoints + a.avgAutonPoints),
	);
	const sortByPieces = [...data].sort(
		(a, b) =>
			b.avgTotalCones + b.avgTotalCubes - (a.avgTotalCones + a.avgTotalCubes),
	);
	const sortedHeight = [...data].sort(
		(a, b) =>
			b.avgHigh + b.avgMiddle + b.avgLow - (a.avgHigh + a.avgMiddle + a.avgLow),
	);
	const handleTeamChange = (event) => {
		setInputValue(event.target.value);
		const team = event.target.value;
		const teamExists = sortedData.find((data) => data.team === team);
		if (teamExists) {
			setSelectedTeam({ team });
		} else {
			setSelectedTeam("");
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleClearClick = () => {
		setInputValue("");
		setSelectedTeam("");
	};

	return (
		<div style={{ marginTop: "20px", marginBottom: "20px" }}>
			<Container
				maxWidth="xl"
				style={{ backgroundColor: "white", paddingBottom: "10px" }}
				paddingBottom="10px"
			>
				<Grid
					container
					spacing={3}
					direction="row"
					alignItems="center"
					justifyContent="center"
				>
					<Grid item xs="auto">
						<TextField
							focused
							sx={{ input: { color: "black" } }}
							margin="normal"
							color="primary"
							paddingTop="30px"
							id="team-input"
							value={inputValue}
							onChange={handleTeamChange}
							label="Select A Team"
						/>
					</Grid>

					<Grid item xs="auto">
						<Button
							variant="contained"
							size="large"
							margin="normal"
							onClick={handleClearClick}
						>
							Clear
						</Button>
					</Grid>
				</Grid>
				<ResponsiveContainer width="100%" aspect={3}>
					<BarChart
						width={500}
						height={300}
						data={sortedData}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="team" />
						<YAxis />
						<Tooltip contentStyle={{backgroundColor: "black"}} active />
						<Legend />
						<Bar
							dataKey="avgAutonPoints"
							stackId="a"
							fill={"#82ca9d"}
							onClick={handleBarClick}
						>
							{sortedData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										sortedData[index].team === selectedTeam.team
											? "#178541"
											: "#82ca9d"
									}
								/>
							))}
						</Bar>
						<Bar
							dataKey="avgTeleopPoints"
							stackId="a"
							fill="#8884d8"
							onClick={handleBarClick}
						>
							{sortedData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										sortedData[index].team === selectedTeam.team
											? "#262194"
											: "#8884d8"
									}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>

				<Divider
					style={{
						marginTop: "15px",
						marginBottom: "15px",
						background: "black",
					}}
				/>

				<Grid container spacing={3}>
					<Grid item xs>
						<Typography color="black" textAlign="center" variant="h6">
							Game Piece
						</Typography>
						<ResponsiveContainer width="100%" aspect={3}>
							<BarChart
								width={500}
								height={300}
								data={sortByPieces}
								margin={{
									top: 20,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="team" />
								<YAxis />
								<Tooltip contentStyle={{backgroundColor: "black"}} />
								<Legend />
								<Bar
									dataKey="avgTotalCones"
									stackId="a"
									fill={"#fcba03"}
									onClick={handleBarClick}
								>
									{sortByPieces.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												sortByPieces[index].team === selectedTeam.team
													? "#916b01"
													: "#fcba03"
											}
										/>
									))}
								</Bar>
								<Bar
									dataKey="avgTotalCubes"
									stackId="a"
									fill="#8884d8"
									onClick={handleBarClick}
								>
									{sortByPieces.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												sortByPieces[index].team === selectedTeam.team
													? "#060078"
													: "#8884d8"
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</Grid>
					<Grid item xs>
						<Typography color="black" textAlign="center" variant="h6">
							Piece Placement
						</Typography>
						<ResponsiveContainer width="100%" aspect={3}>
							<BarChart
								width={500}
								height={300}
								data={sortedHeight}
								margin={{
									top: 20,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="team" />
								<YAxis />
								<Tooltip contentStyle={{backgroundColor: "black"}} />
								<Legend />
								<Bar
									dataKey="avgLow"
									stackId="a"
									fill={"#fcba03"}
									onClick={handleBarClick}
								>
									{sortedHeight.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												sortedHeight[index].team === selectedTeam.team
													? "#a67a02"
													: "#fcba03"
											}
										/>
									))}
								</Bar>

								<Bar
									dataKey="avgMiddle"
									stackId="a"
									fill="#057be3"
									onClick={handleBarClick}
								>
									{sortedHeight.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												sortedHeight[index].team === selectedTeam.team
													? "#035296"
													: "#057be3"
											}
										/>
									))}
								</Bar>
								<Bar
									dataKey="avgHigh"
									stackId="a"
									fill="#8884d8"
									onClick={handleBarClick}
								>
									{sortedHeight.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												sortedHeight[index].team === selectedTeam.team
													? "#262194"
													: "#8884d8"
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</Grid>
				</Grid>

				{selectedTeam && (
					<div>
						<Divider
							style={{
								marginTop: "15px",
								marginBottom: "15px",
								background: "black",
							}}
						/>
						<Typography
							paddingBottom="20px"
							fontWeight="bold"
							textAlign="center"
							variant="h5"
							color="black"
						>
							Robot Info for Team {selectedTeam.team}
						</Typography>

						<Grid container spacing={3}>
							<Grid item xs="auto">
								<Typography color="black" textAlign="center" variant="h6">
									Match Trends
								</Typography>
								<LineChart
									width={425}
									height={300}
									data={matchTrends(selectedTeam.team)}
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="match" />
									<YAxis />
									<Tooltip contentStyle={{backgroundColor: "black"}} />
									<Legend />
									<Line type="monotone" dataKey="Auton" stroke="#00adfc" />
									<Line type="monotone" dataKey="Teleop" stroke="#00fc15" />
									<Line type="monotone" dataKey="Total" stroke="#fc006d" />
								</LineChart>
							</Grid>
							<Grid item xs="auto">
								<Typography color="black" textAlign="center" variant="h6">
									Piece Placement
								</Typography>
								<LineChart
									width={425}
									height={300}
									data={matchTrends(selectedTeam.team)}
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="match" />
									<YAxis />
									<Tooltip contentStyle={{backgroundColor: "black"}} />
									<Legend />
									<Line
										type="monotone"
										dataKey="Total Cones"
										stroke="#00adfc"
									/>
									<Line
										type="monotone"
										dataKey="Total Cubes"
										stroke="#00fc15"
									/>
								</LineChart>
							</Grid>
							<Grid item xs="auto">
								<Typography color="black" textAlign="center" variant="h6">
									Placement Level
								</Typography>
								<LineChart
									width={425}
									height={300}
									data={matchTrends(selectedTeam.team)}
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="match" />
									<YAxis />
									<Tooltip contentStyle={{backgroundColor: "black"}} />
									<Legend />
									<Line type="monotone" dataKey="Total Low" stroke="#00adfc" />
									<Line
										type="monotone"
										dataKey="Total Middle"
										stroke="#00fc15"
									/>
									<Line
										type="monotone"
										dataKey="Total Upper"
										stroke="#fc006d"
									/>
								</LineChart>
							</Grid>
						</Grid>

						<Divider
							style={{
								marginTop: "15px",
								marginBottom: "15px",
								background: "black",
							}}
						/>
						<Typography
							paddingBottom="20px"
							fontWeight="bold"
							textAlign="center"
							variant="subtitle1"
							color="black"
						>
							Match Info
						</Typography>

						<Grid
							container
							spacing={3}
							direction="row"
							alignItems="center"
							justifyContent="center"
							paddingTop="10px"
							paddingBottom="15px"
						>
							<Grid item xs="auto" style={{ textAlign: "center" }}>
								<Typography color="black" textAlign="center" variant="p">
									Auton Docked
								</Typography>
								<div style={{ width: 75, height: 75 }}>
									<CircularProgressbar
										value={chargeData(selectedTeam.team).autonDockedPercentage}
										text={`${
											chargeData(selectedTeam.team).autonDockedPercentage
										}%`}
									/>
								</div>
							</Grid>
							<Grid item xs="auto">
								<Typography color="black" textAlign="center" variant="p">
									Auton Engage
								</Typography>
								<div style={{ width: 75, height: 75 }}>
									<CircularProgressbar
										value={chargeData(selectedTeam.team).autonEngagePercentage}
										text={`${
											chargeData(selectedTeam.team).autonEngagePercentage
										}%`}
									/>
								</div>
							</Grid>
							<Grid item xs="auto">
								<Typography color="black" textAlign="center" variant="p">
									Teleop Docked
								</Typography>
								<div style={{ width: 75, height: 75 }}>
									<CircularProgressbar
										value={chargeData(selectedTeam.team).teleopDockedPercentage}
										text={`${
											chargeData(selectedTeam.team).teleopDockedPercentage
										}%`}
									/>
								</div>
							</Grid>
							<Grid item xs="auto">
								<Typography color="black" textAlign="center" variant="p">
									Teleop Engage
								</Typography>
								<div style={{ width: 75, height: 75 }}>
									<CircularProgressbar
										value={chargeData(selectedTeam.team).teleopEngagePercentage}
										text={`${
											chargeData(selectedTeam.team).teleopEngagePercentage
										}%`}
									/>
								</div>
							</Grid>
						</Grid>

						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Match</TableCell>
										<TableCell align="right">Auton Points</TableCell>
										<TableCell align="right">Teleop Points</TableCell>
										<TableCell align="right">Total Points</TableCell>
										<TableCell align="right">Under Defense</TableCell>
										<TableCell align="right">Defense Rating</TableCell>
										<TableCell align="right">Robot Rating</TableCell>
										<TableCell align="right">Defense Comments</TableCell>
										<TableCell align="right">Other Notes</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{matchTrends(selectedTeam.team).map((match) => (
										<TableRow key={match.match}>
											<TableCell component="th" scope="row">
												{match.match}
											</TableCell>
											<TableCell align="right">{match["Auton"]}</TableCell>
											<TableCell align="right">{match["Teleop"]}</TableCell>
											<TableCell align="right">{match["Total"]}</TableCell>
											<TableCell align="right">
												{match["Under Defense"]}
											</TableCell>
											<TableCell align="right">
												{match["Defense Rating"]}
											</TableCell>
											<TableCell align="right">
												{match["Robot Rating"]}
											</TableCell>
											<TableCell align="right">
												{match["Defense Comments"]}
											</TableCell>
											<TableCell align="right">
												{match["Other Notes"]}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				)}

				<div style={{ marginBottom: "15px" }}>
					<Divider
						style={{
							marginTop: "15px",
							marginBottom: "15px",
							background: "black",
						}}
					/>
					<Typography
						paddingBottom="20px"
						textAlign="center"
						variant="h5"
						fontWeight="bold"
						color="black"
					>
						Team Averages
					</Typography>
					<TableContainer component={Paper}>
						<Table
							sx={{ minWidth: 650 }}
							stickyHeader
							aria-label="simple table"
						>
							<TableHead>
								<TableRow>
									<TableCell>Team</TableCell>
									<TableCell align="right">Auton Points</TableCell>
									<TableCell align="right">Teleop Points</TableCell>
									<TableCell align="right">Total Points</TableCell>
									<TableCell align="right">Num Scouted</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((team) => (
										<TableRow key={team.team}>
											<TableCell component="th" scope="row">
												{team.team}
											</TableCell>
											<TableCell align="right">
												{team["avgAutonPoints"]}
											</TableCell>
											<TableCell align="right">
												{team["avgTeleopPoints"]}
											</TableCell>
											<TableCell align="right">
												{team["avgTeleopPoints"] + team["avgAutonPoints"]}
											</TableCell>
											<TableCell align="right">{team["numPlayed"]}</TableCell>
										</TableRow>
									))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TablePagination
										rowsPerPageOptions={[
											5,
											10,
											25,
											{ label: "All", value: -1 },
										]}
										colSpan={3}
										count={data.length}
										rowsPerPage={rowsPerPage}
										page={page}
										SelectProps={{
											inputProps: {
												"aria-label": "rows per page",
											},
											native: true,
										}}
										onPageChange={handleChangePage}
										onRowsPerPageChange={handleChangeRowsPerPage}
									/>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</div>
			</Container>
		</div>
	);
};

export default function Viewer() {
	const data = processData();
  
	if (!data) {
	  return <div>Loading...</div>;
	}
  
	return (
	  <div>
		<GroupChart data={data} />
	  </div>
	);
}