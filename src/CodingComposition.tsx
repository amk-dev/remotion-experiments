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
		code: '',
		narration:
			'So on my video on Array.concat, Manas Sasidaran asked me if the spread operator is a shorthand for the concat method. No, its not. concat is a method available specifically for Arrays, but spread operator is a javascript language feature. So in this video, lets learn about the spread operator. Spread operator can be used in many places with different semantics but the same syntax.',
	},
	{
		id: 'step-1',
		code: '// Spread Operator With Arrays',
		narration: "First let's start with arrays.",
	},
	{
		id: 'step-2',
		code: `const names = ["john", "jane", "joe"];`,
		narration: 'Here we create an array called names.',
	},
	{
		id: 'step-3',
		code: /* js */ `  
		const updatedNames = ["kate", "james", ...names, "josh"]; 
		// updatedNames: ["kate", "james", "john", "jane", "joe", "josh"]`,
		narration:
			"Next, I want to add the elements of the 'names' array to the 'updatedNames' array. To do this. I'm using the spread operator to spread the 'names' array into the 'updatedNames' array. This adds the elements of 'names' to 'updatedNames'.",
	},
	{
		id: 'step-4',
		code: /* js */ `// you can spread it in the beginning 
		const moreNames = [...names, "kevin", "kyle", "kelly"]; 
		// moreNames: ["john", "jane", "joe", "kevin", "kyle", "kelly"]`,
		narration:
			"We can also use the spread operator to add elements to the beginning of an array, as shown with the 'moreNames' array.",
	},
	{
		id: 'step-5',
		code: /* js */ `// or you can spread it in the end, or anywhere for that matter 
		const evenMoreNames = ["kevin", "kyle", "kelly", ...names]; // evenMoreNames: ["kevin", "kyle", "kelly", "john", "jane", "joe"]`,
		narration:
			"Alternatively, we can add elements to the end or anywhere in an array using the spread operator, as seen in 'evenMoreNames'.",
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

	const currentFrame = useCurrentFrame();

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
				'spread-arrays',
				steps.map((step) => ({
					...step,
				}))
			);

			// Temp hack. do this from the backend
			res.sort((a, b) => {
				const numA = parseInt(a.id.split('-')[1], 10);
				const numB = parseInt(b.id.split('-')[1], 10);
				return numA - numB;
			});

			const count = 0;

			let previousCode = '';
			debugger;

			res.forEach((step) => {
				debugger;
				const dom = new DOMParser().parseFromString(step.code, 'text/html');

				const lines = dom.querySelectorAll('.line');

				lines.forEach((line) => {
					line.classList.add('line-focus');
				});

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

			setCode(codeHTMLs);
			continueRender(handle);
		};

		processAllCode();
	}, []);

	const translateY = interpolate(currentFrame, [2062, 2092], [0, -456], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	console.log('processing currentFrame', currentFrame);
	console.log(steps);

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
					debugger;
					// Find the total duration from subtitles

					const totalDuration = codeHTML.subtitles.reduce((total, subtitle) => {
						total += subtitle.durationInFrames;
						return total;
					}, 0);

					return (
						<>
							<TransitionSeries.Transition
								key={`transition-${index}`}
								timing={linearTiming({
									durationInFrames: 12,
								})}
								presentation={fade()}
							/>
							<TransitionSeries.Sequence
								key={`scene-${index}`}
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
											overflow: 'hidden',
										}}
									>
										<div className="flex gap-2 z-10">
											<div className="bg-[#FE5F57] w-8 h-8 rounded-full" />
											<div className="bg-[#FDBC2C] w-8 h-8 rounded-full" />
											<div className="bg-[#29C740] w-8 h-8 rounded-full" />
										</div>
										<div // eslint-disable-next-line react/no-danger
											dangerouslySetInnerHTML={{
												__html: codeHTML.html,
											}}
											className="flex-grow code-container"
										/>
									</div>
								</div>
								<Audio
									name="Narration"
									src={`data:audio/mp3;base64,${codeHTML.audio_base64}`}
									volume={1}
								/>

								<TransitionSeries>
									{codeHTML.subtitles.map((subtitle, index) => {
										if (subtitle.durationInFrames === 0) {
											console.log('skipping subtitle');
										}

										if (subtitle.durationInFrames === 0) {
											return null;
										}

										return (
											<>
												<TransitionSeries.Sequence
													key={index}
													name="subtitle"
													className={
														currentFrame > 1537
															? `flex flex-col p-12 pt-24`
															: `flex flex-col-reverse p-12 pb-24`
													}
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
