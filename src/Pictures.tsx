import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export async function getPictures(rover:string, date:string, setPicturesHandle:any):Promise<void> {
	await fetch(`http://localhost:1337/pictures?rover=${rover}&date=${date}`)
		.then(response => response.json())
		.then(data => {
			setPicturesHandle(data.images);
		});
}

export function convertDateFromPickerToApiFormat(date:any):string {
	let dateTime = date ? new Date(date.toString()) : new Date();
	if (dateTime.getFullYear().toString() === 'NaN') {
		dateTime = new Date();
	}
	return `${dateTime.getFullYear().toString().padStart(4, '0')}-${(dateTime.getMonth() + 1).toString().padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')}`;
}

const Pictures = function () {
	const [ date, setDate ] = React.useState<any>();
	const [ pictures, setPictures ] = React.useState<string[]>();
	const [ rover, setRover ] = React.useState<string>('');

	const handleClick = () => {
		getPictures(rover, convertDateFromPickerToApiFormat(date), setPictures);
	};

	return (
		<div>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
				<h1>NASA Rover Picture Viewer</h1>
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
					<FormControl style={{ width: 150 }}>
						<InputLabel id="demo-simple-select-label">Rover</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={rover}
							label="Rover"
							onChange={event => { setRover(event.target.value); }}
						>
							<MenuItem value="curiosity">Curiosity</MenuItem>
							<MenuItem value="opportunity">Opportunity</MenuItem>
							<MenuItem value="spirit">Spirit</MenuItem>
						</Select>
					</FormControl>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Date"
							value={date}
							onChange={(newValue:any) => {
								setDate(newValue);
							}}
							renderInput={(params:any) => <TextField {...params} />}
						/>
					</LocalizationProvider>
					<Button variant="contained" style={{ margin: 12 }} onClick={() => handleClick()}>Search</Button>
				</div>
			</div>
			{ pictures && pictures.length === 0 &&
			<p>No Pictures for that day</p>}
			{ pictures && pictures.length > 0 && (
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
					{pictures.map((pictureBase64, index) => (
						<img alt="" src={`${pictureBase64}`} style={{ maxWidth: '100%' }} />
					))}
				</div>
			)}
		</div>
	);
};

export default Pictures;
