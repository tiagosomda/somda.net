// URL mappings: key -> target URL
let urlMappings = {
    'thales-1': 'https://thales-1.com',
    'thales-2': 'https://thales-2.com',
	'hh-expense':'https://docs.google.com/forms/d/e/1FAIpQLSdFULHWvk6a-VSa2cNLaynbMcEXxwDzPEL_gk7PAqEqjkmoew/viewform'
};

// Fetch dynamic mappings from Google Sheets
(function fetchSheetData() {
	const sheetID = "1iW3W2G0v4esMLB2ybsh9dWU2oPAY1SRT2S4CY_Ocuxk";
	const sheetName = "Sheet1"; // Change if needed
	const query = encodeURIComponent("SELECT *");
	const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}&tq=${query}`;

	fetch(url)
		.then(res => res.text())
		.then(rep => {
			const jsonData = JSON.parse(rep.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1]);
			const rows = jsonData.table.rows;

			const newMappings = {};
			rows.slice(1).forEach(row => { // Skip the first item (header)
				const key = row.c[0]?.v;
				const value = row.c[1]?.v;
				if (key && value) {
					newMappings[key] = value; // Replace existing mapping if it exists
				}
			});

			urlMappings = { ...urlMappings, ...newMappings };
			console.log("Updated URL mappings:", urlMappings);

			// Indicate that Google Sheets fetch is complete
			window.googleSheetsFetchComplete = true;
		})
		.catch(err => {
			console.error("Error fetching sheet data:", err);

			// Ensure the flag is set even if the fetch fails
			window.googleSheetsFetchComplete = true;
		});
})();
