const baseUrl = 'http://localhost:5000';

// Export const codeToHtml = async (code: string) => {
// 	const response = await fetch(`${baseUrl}/shiki/code-to-html`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({code}),
// 	});
// 	const {html, backgroundColor} = await response.json();
// 	return {
// 		html,
// 		backgroundColor,
// 	};
// };

/**
 * Curl -X POST http://localhost:5000/shiki/process-step \
     -H "Content-Type: application/json" \
     -d '{
           "creation_name": "exampleCreation",
           "steps": [
             {
               "id": "step1",
               "code": "console.log('Hello, world!');",
               "narration": "This is a simple JavaScript console log statement."
             },
             {
               "id": "step2",
               "code": "let a = 5; let b = 10; console.log(a + b);",
               "narration": "Here we declare two variables and log their sum."
             }
           ]
         }'

 */
// function to execute the curl command, response will be { code, audio, subtitles }[]

type Step = {
	id: string;
	code: string;
	narration: string;
};

export const processStep = async (creationName: string, steps: Step[]) => {
	const response = await fetch(`${baseUrl}/shiki/process-step`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		// eslint-disable-next-line camelcase
		body: JSON.stringify({creation_name: creationName, steps}),
	});

	// Extract data from the response
	// the response will be of type { code, audio, audio_base64, subtitles }[]

	// todo, handle errors
	const data = await response.json();

	return data.steps as {
		code: string;
		audio: Blob;
		audio_base64: string;
		subtitles: string;
	}[];

	// Const {html, backgroundColor} = await response.json();
	// return {
	// 	html,
	// 	backgroundColor,
	// };
};

processStep('exampleCreation', [
	{
		id: 'step1',
		code: "console.log('Hello, world!');",
		narration: 'This is a simple JavaScript console log statement.',
	},
	{
		id: 'step2',
		code: 'let a = 5; let b = 10; console.log(a + b);',
		narration: 'Here we declare two variables and log their sum.',
	},
]).then((data) => {
	data.forEach((step) => {
		console.log({
			...step,
			subtitles: parseSRT(step.subtitles),
		});
	});
});

const parseSRT = (srt: string) => {
	const pattern =
		/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?(?=\n\n|\n*$))/g;
	const subtitles: {
		number: string;
		start: string;
		end: string;
	}[] = [];

	const matchResult = srt.matchAll(pattern);

	for (const match of matchResult) {
		subtitles.push({
			number: match[1],
			start: match[2],
			end: match[3],
		});
	}

	return subtitles;
};
