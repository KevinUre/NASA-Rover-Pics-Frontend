import { getPictures, convertDateFromPickerToApiFormat } from './Pictures';

afterEach(() => {
	jest.restoreAllMocks();
});

test('convertDateFromPickerToApiFormat works correctly when fed a real date', () => {
	const date = 'Thu Nov 13 2021 00:24:49 GMT-0500 (Eastern Standard Time)';

	const actual = convertDateFromPickerToApiFormat(date);

	expect(actual).toBe('2021-11-13');
});

test('convertDateFromPickerToApiFormat uses today if date is missing', () => {
	const actual = convertDateFromPickerToApiFormat(undefined);

	expect(actual).toContain((new Date()).getFullYear().toString());
	expect(actual).toContain(((new Date()).getMonth() + 1).toString());
	expect(actual).toContain((new Date()).getDate().toString());
});

test('convertDateFromPickerToApiFormat uses today if date is garbage', () => {
	const date = 'spaghetti';

	const actual = convertDateFromPickerToApiFormat(date);

	expect(actual).toContain((new Date()).getFullYear().toString());
	expect(actual).toContain(((new Date()).getMonth() + 1).toString());
	expect(actual).toContain((new Date()).getDate().toString());
});

test('getPictures calls the API with correct params and sets state with the results', async () => {
	const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
		json: jest.fn().mockResolvedValue({ images: [ 'someImageData' ] }),
	} as unknown as Response);
	const callback = jest.fn();

	await getPictures('red-rover', 'YYYY-MM-DD', callback);

	expect(fetchSpy).toHaveBeenCalledWith('http://localhost:1337/pictures?rover=red-rover&date=YYYY-MM-DD');
	expect(callback).toHaveBeenCalledWith([ 'someImageData' ]);
});
