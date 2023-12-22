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

export const parseSRT = (srt: string) => {
	const pattern =
		/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?(?=\n\n|\n*$))/g;
	const subtitles: {
		number: string;
		start: string;
		end: string;
		text: string;
		durationInFrames: number;
	}[] = [];

	const matchResult = srt.matchAll(pattern);

	for (const match of matchResult) {
		const subtitle = {
			number: match[1],
			start: match[2],
			end: match[3],
			text: match[4],
		};

		const durationInFrames = calculateDurationForSubtitle(subtitle, 30);

		subtitles.push({
			...subtitle,
			durationInFrames,
		});
	}

	return subtitles;
};

const calculateDurationForSubtitle = (
	subtitle: {
		start: string;
		end: string;
	},
	fps: number
) => {
	console.group('calculateDurationForSubtitle');
	console.log('Start', subtitle.start);
	console.log('End', subtitle.end);

	const startSeconds = timeToSeconds(subtitle.start);
	const endSeconds = timeToSeconds(subtitle.end);

	console.log('Start Second', startSeconds);
	console.log('End Second', endSeconds);

	const durationInSeconds = endSeconds - startSeconds;
	const durationInFrames = Math.round(durationInSeconds * fps);

	console.log('Duration in seconds', durationInSeconds);
	console.log('Duration in frames', durationInFrames);

	console.groupEnd();
	return durationInFrames;
};

function timeToSeconds(time: string) {
	const parts = time.split(':');
	const hours = parseInt(parts[0], 10);
	const minutes = parseInt(parts[1], 10);

	const secondsAndMilliseconds = parts[2].split(',');
	const seconds = parseInt(secondsAndMilliseconds[0], 10);
	const milliseconds = parseInt(secondsAndMilliseconds[1], 10);

	return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}
