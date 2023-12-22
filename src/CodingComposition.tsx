// Import {Audio} from 'remotion';
import {delayRender, continueRender, useVideoConfig, spring} from 'remotion';
import {
	Sequence,
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	Audio,
} from 'remotion';
import {useEffect} from 'react';

import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

import {useState} from 'react';
import {parseSRT, processStep} from './shiki-api';

export const MyComposition: React.FC = () => {
	// Const [handle] = useState(() => delayRender());

	const [codeHTMLs, setCode] = useState<
		{
			html: string;
			// BackgroundColor: string;
			audio_base64: string;
			subtitles: {
				start: string;
				end: string;
				text: string;
				durationInFrames: number;
			}[];
		}[]
	>([]);

	const steps = [
		{
			id: 'step1',
			code: 'const examplePromise = new Promise((resolve, reject) => {\n    // Promise logic here\n});',
			narration:
				'A Promise in JavaScript is an object representing the eventual completion or failure of an asynchronous operation. Here, we have a basic structure of a promise.',
		},
		{
			id: 'step2',
			code: 'Promise.all(iterable)',
			narration:
				'`Promise.all()` is a method that takes an iterable of promises and returns a single Promise. It resolves when all promises in the iterable resolve, or rejects if any promise rejects.',
		},
		{
			id: 'step3',
			code: 'function promptForDishChoice() {\n    return new Promise((resolve, reject) => {\n        // Logic to prompt user for dish choice\n    });\n}\n\nfunction fetchPrices() {\n    return new Promise((resolve, reject) => {\n        // Logic to fetch prices\n    });\n}',
			narration:
				"Let's create two functions returning promises. `promptForDishChoice` simulates a user choosing a dish, and `fetchPrices` represents fetching dish prices from a server.",
		},
		{
			id: 'step4',
			code: 'async function getPriceSequentially() {\n    const choice = await promptForDishChoice();\n    const prices = await fetchPrices();\n    return prices[choice];\n}',
			narration:
				"Here's how you might use these promises sequentially. Notice how `fetchPrices` only starts after `promptForDishChoice` completes, which could be inefficient.",
		},
		{
			id: 'step5',
			code: 'async function getPriceConcurrently() {\n    const [choice, prices] = await Promise.all([\n        promptForDishChoice(),\n        fetchPrices(),\n    ]);\n    return prices[choice];\n}',
			narration:
				'By using `Promise.all`, we can execute `promptForDishChoice` and `fetchPrices` concurrently, improving efficiency. If any promise rejects, `Promise.all` will reject.',
		},
		{
			id: 'step6',
			code: 'Promise.all([promise1, promise2])\n    .then((values) => {\n        // Handle resolved values\n    })\n    .catch((error) => {\n        // Handle rejection\n    });',
			narration:
				'`Promise.all` can handle rejections too. If any promise in the iterable rejects, the entire `Promise.all` rejects, and we handle it in the catch block.',
		},
		{
			id: 'step7',
			// eslint-disable-next-line no-template-curly-in-string
			code: 'getPriceConcurrently().then((price) => {\n    console.log(`The price of your selected dish is: ${price}`);\n}).catch((error) => {\n    console.error(`An error occurred: ${error.message}`);\n});',
			narration:
				'Finally, in our scenario, we use `getPriceConcurrently` to get the price of the selected dish. We handle the final result or error accordingly.',
		},
	];

	const [handle] = useState(() => delayRender());

	useEffect(() => {
		const processAllCode = async () => {
			const codeHTMLs: {
				html: string;
				// BackgroundColor: string;
				audio_base64: string;
				subtitles: {
					start: string;
					end: string;
					text: string;
					durationInFrames: number;
				}[];
			}[] = [];
			const res = await processStep('promises-test', steps);

			res.forEach((step) => {
				codeHTMLs.push({
					html: step.code,
					// BackgroundColor: step.backgroundColor,
					// eslint-disable-next-line camelcase
					audio_base64: step.audio_base64,
					subtitles: parseSRT(step.subtitles),
				});
			});

			console.log(codeHTMLs);

			// Add total duration to each step

			setCode(codeHTMLs);
			continueRender(handle);
		};

		processAllCode();
	}, []);

	return (
		<AbsoluteFill>
			<TransitionSeries>
				{codeHTMLs.map((codeHTML, index) => {
					// Find the total duration from subtitles

					const totalDuration = codeHTML.subtitles.reduce((total, subtitle) => {
						total += subtitle.durationInFrames;
						return total;
					}, 0);

					console.log(totalDuration);

					return (
						<>
							<TransitionSeries.Sequence
								key={index}
								durationInFrames={totalDuration}
							>
								<div
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{
										__html: codeHTML.html,
									}}
									className="w-full h-full text-[2rem] p-12"
									style={{
										backgroundColor:
											extractBackgroundColor(codeHTML.html) ?? undefined,
									}}
								/>

								<Audio src={`data:audio/mp3;base64,${codeHTML.audio_base64}`} />
							</TransitionSeries.Sequence>
							<TransitionSeries.Transition
								timing={linearTiming({
									durationInFrames: 12,
								})}
								presentation={fade()}
							/>
						</>
					);
				})}
			</TransitionSeries>

			{/* add the audios */}
			{/* {codeHTMLs.map((codeHTML, index) => {
				// Convert the audio base64 to a format that can be used with html audio src
				const audioSource = `data:audio/mp3;base64,${codeHTML.audio_base64}`;

				// Extract this to a function, because we need it in two places
				const totalDuration = codeHTML.subtitles.reduce((total, subtitle) => {
					total += subtitle.durationInFrames;
					return total;
				}, 0);

				return (
					<Sequence key={index} from={totalDuration}>
						<Audio src={audioSource} />
					</Sequence>
				);
			})} */}

			{/* <Sequence
				className="justify-center items-center"
				from={120}
				durationInFrames={60}
				style={{opacity: imgOpacity2}}
			>
				<Img className="h-2/4" src={staticFile('organized-table.png')} />
			</Sequence> */}

			{/* <Audio src={staticFile('console-table.wav')} /> */}
		</AbsoluteFill>
	);
};

// Remove later, just a quick hack to get the background color to test
function extractBackgroundColor(htmlString: string) {
	// Regular expression to match the style attribute of the first <pre> tag
	const regex = /<pre[^>]*style="[^"]*background-color:\s*([^;"]+)/i;

	// Execute the regular expression on the HTML string
	const match = regex.exec(htmlString);

	// Check if a match was found
	if (match && match[1]) {
		// Return the matched background color
		return match[1];
	}
	// Return a default value or null if no match is found
	return null;
}
