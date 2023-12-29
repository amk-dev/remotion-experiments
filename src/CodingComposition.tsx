// Import {Audio} from 'remotion';
import {
	delayRender,
	continueRender,
	useVideoConfig,
	spring,
	Series,
} from 'remotion';
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

import {z} from 'zod';

import {v4 as uuidv4} from 'uuid';

export const MyCompositionSchema = z.object({
	tailwindGradient: z.number(),
});

const tailwindGradients = [
	'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
	'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
	'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
	'bg-gradient-to-r from-gray-700 via-gray-900 to-black',
	'bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100',
	'bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100',
	'bg-gradient-to-r from-blue-500 to-blue-600',
];

const previousCode = '';

const steps = [
	{
		id: 'step-0',
		code: '// Array.at',
		narration:
			"In this video, we'll learn about the at method of javascript arrays.",
	},
	{
		id: 'step-1',
		code: `const fruits = [
		"apple",
		"banana",
		"orange",
		"grapefruit",
		"mango",
		"kiwi",
		"pineapple",
	];`,
		narration:
			'I have an array of fruits. I want to get the last fruit in the array.',
	},
	{
		id: 'step-2',
		code: `fruits[fruits.length - 1];
	// output: pineapple`,
		narration:
			'usually we would find the length of the array and subtract 1 to get the index of the last fruit and then get the last fruit, but there is a better way',
	},
	{
		id: 'step-3',
		code: `fruits.at(-1);
	// output: pineapple`,
		narration:
			'I can use the Array.at method to get the last fruit, this will give me pineapple',
	},
	{
		id: 'step-4',
		code: `fruits.at(-2);
	// output: kiwi`,
		narration:
			'if i want to get the second last fruit, I can use the at method with -2 argument. this will give me kiwi',
	},
	{
		id: 'step-5',
		code: `fruits.at(-3);
	// output: mango`,
		narration:
			'for third last fruit, I can use the at method with -3 argument. this will give me mango',
	},
	{
		id: 'step-6',
		code: `fruits.at(0);
	// output: apple`,
		narration:
			'we can also use positive indexes to get the fruits. to get the first fruit, we can use the at method with 0 argument, and it will give me apple',
	},
	{
		id: 'step-7',
		code: `fruits.at(1);
	// output: banana`,
		narration:
			'to get the second fruit, we can use the at method with 1 argument, and it will give me banana. so, next time you want to get the last element in an array, use the at method',
	},
];

// .map((step) => {
// 	// Very hacky and mvp way to decide if i should add one \n or two \n\n
// 	const isOutput = step.code.includes('// output');

// 	const previousCodeWithCurrentCode = `${previousCode}${
// 		isOutput ? '\n' : '\n\n'
// 	}${step.code}`;

// 	previousCode = previousCodeWithCurrentCode;

// 	return {
// 		...step,
// 		code: previousCodeWithCurrentCode,
// 	};
// });

export const MyComposition: React.FC<z.infer<typeof MyCompositionSchema>> = ({
	tailwindGradient,
}) => {
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
			const res = await processStep(
				'array-map-4',
				steps.map((step) => ({
					...step,
				}))
			);

			console.group('res');
			console.log(res);
			console.groupEnd();

			let count = 0;

			let previousCode = '';

			res.forEach((step) => {
				const dom = new DOMParser().parseFromString(step.code, 'text/html');

				const lines = dom.querySelectorAll('.line');

				lines.forEach((line) => {
					line.classList.add('line-focus');
				});

				console.group('dom ' + count++);

				console.group('dom.body.innerHTML');
				console.log(dom.body.innerHTML);
				console.groupEnd();

				console.group('previousCode');
				console.log(previousCode);
				console.groupEnd();

				console.groupEnd();

				const previousCodeStrippedOfLineFocus = new DOMParser().parseFromString(
					previousCode,
					'text/html'
				);

				previousCodeStrippedOfLineFocus
					.querySelectorAll('.line-focus')
					.forEach((line) => {
						line.classList.remove('line-focus');
					});

				const spanForMargin = document.createElement('br');

				codeHTMLs.push({
					html:
						previousCodeStrippedOfLineFocus.body.innerHTML +
						dom.body.innerHTML +
						spanForMargin.outerHTML,
					// BackgroundColor: step.backgroundColor,
					// eslint-disable-next-line camelcase
					audio_base64: step.audio_base64,
					subtitles: parseSRT(step.subtitles),
				});

				// Remove the line-focus class
				previousCode += dom.body.innerHTML + spanForMargin.outerHTML;
			});

			console.log(codeHTMLs);

			// Add total duration to each step

			setCode(codeHTMLs);
			continueRender(handle);
		};

		processAllCode();
	}, []);

	return (
		<AbsoluteFill id="total-thing">
			<TransitionSeries>
				<TransitionSeries.Sequence
					key="initial-background"
					durationInFrames={40}
				>
					<div
						className={`w-full h-full p-2 ${tailwindGradients[tailwindGradient]}`}
					>
						<div
							className="w-full h-full text-[2rem] p-12 flex flex-col gap-12 rounded-3xl"
							style={{
								backgroundColor:
									extractBackgroundColor(codeHTMLs[0]?.html) ?? undefined,
							}}
						>
							<div className="flex gap-2">
								<div className="bg-[#FE5F57] w-8 h-8 rounded-full" />
								<div className="bg-[#FDBC2C] w-8 h-8 rounded-full" />
								<div className="bg-[#29C740] w-8 h-8 rounded-full" />
							</div>
							<div // eslint-disable-next-line react/no-danger
								className="flex-grow"
							/>
						</div>
					</div>
				</TransitionSeries.Sequence>

				{codeHTMLs.map((codeHTML, index) => {
					// Find the total duration from subtitles

					console.group('codeHTML');
					console.log(codeHTML);
					console.groupEnd();

					const totalDuration = codeHTML.subtitles.reduce((total, subtitle) => {
						total += subtitle.durationInFrames;
						return total;
					}, 0);

					return (
						<>
							<TransitionSeries.Transition
								timing={linearTiming({
									durationInFrames: 12,
								})}
								presentation={fade()}
							/>
							<TransitionSeries.Sequence
								key={index}
								durationInFrames={totalDuration + 40}
							>
								<div
									className={`w-full h-full p-2 ${tailwindGradients[tailwindGradient]}`}
								>
									<div
										className="w-full h-full text-[2rem] p-12 flex flex-col gap-12 rounded-3xl"
										style={{
											backgroundColor:
												extractBackgroundColor(codeHTML.html) ?? undefined,
										}}
									>
										<div className="flex gap-2">
											<div className="bg-[#FE5F57] w-8 h-8 rounded-full" />
											<div className="bg-[#FDBC2C] w-8 h-8 rounded-full" />
											<div className="bg-[#29C740] w-8 h-8 rounded-full" />
										</div>
										<div // eslint-disable-next-line react/no-danger
											dangerouslySetInnerHTML={{
												__html: codeHTML.html,
											}}
											className="flex-grow"
										/>
									</div>
								</div>
								<Audio
									name="Narration"
									src={`data:audio/mp3;base64,${codeHTML.audio_base64}`}
								/>

								<TransitionSeries>
									{codeHTML.subtitles.map((subtitle, index) => {
										return (
											<>
												<TransitionSeries.Sequence
													key={index}
													name="subtitle"
													className="flex flex-col-reverse p-12 pb-24"
													durationInFrames={subtitle.durationInFrames}
												>
													<p className="text-6xl font-black  leading-snug text-gray-300  p-12 rounded-3xl text-center">
														{subtitle.text}
													</p>
												</TransitionSeries.Sequence>
												<TransitionSeries.Transition
													timing={linearTiming({
														durationInFrames: 2,
													})}
													presentation={fade()}
												/>
											</>
										);
									})}
								</TransitionSeries>
							</TransitionSeries.Sequence>
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
