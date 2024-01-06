// Import {Audio} from 'remotion';
import {
	delayRender,
	continueRender,
	useVideoConfig,
	spring,
	Series,
	Easing,
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

import {loadFont} from '@remotion/google-fonts/PlayfairDisplay';

import {v4 as uuidv4} from 'uuid';

const {fontFamily} = loadFont();

export const MyCompositionSchema = z.object({
	tailwindGradient: z.number(),
	steps: z.array(
		z.array(
			z.object({
				id: z.string(),
				code: z.string(),
				narration: z.string(),
			})
		)
	),
	creationName: z.string(),
});

export const UpdatedMyCompositionSchema = z.object({
	tailwindGradient: z.number(),
	steps: z.array(
		z.array(
			z.object({
				id: z.string(),
				code: z.string(),
				subtitles: z.string(),
				// eslint-disable-next-line camelcase
				audio_base64: z.string(),
				codeType: z.union([
					z.literal('snippet'),
					z.literal('output'),
					z.literal('intro'),
				]),
			})
		)
	),
	backgroundColor: z.string(),
	forgroundColor: z.string(),
	creationName: z.string(),
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

export const CodingPage: React.FC<
	z.infer<typeof UpdatedMyCompositionSchema>
> = ({tailwindGradient, steps, backgroundColor, forgroundColor}) => {
	console.log('steps', steps);

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
			codeType: 'snippet' | 'output' | 'intro';
		}[]
	>([]);

	const currentFrame = useCurrentFrame();

	const [handle] = useState(() => delayRender());

	useEffect(() => {
		const processAllCode = async () => {
			const codeHTMLs: {
				id: string;
				html: string;
				// BackgroundColor: string;
				audio_base64: string;
				subtitles: {
					start: string;
					end: string;
					text: string;
					durationInFrames: number;
				}[];
				codeType: 'snippet' | 'output' | 'intro';
			}[] = [];

			const stepProcessings = steps.map(async (sceneSteps, index) => {
				// Const res = await processStep(
				// 	`${creationName}-scene-${index}`,
				// 	sceneSteps.map((step) => ({
				// 		...step,
				// 	}))
				// );

				let previousCode = '';

				// Res.sort((stepA, stepB) => {
				// 	const numA = parseInt(stepA.id.split('-')[1], 10);
				// 	const numB = parseInt(stepB.id.split('-')[1], 10);
				// 	return numA - numB;
				// });

				sceneSteps.forEach((step) => {
					const dom = new DOMParser().parseFromString(step.code, 'text/html');

					if (step.codeType === 'intro') {
						codeHTMLs.push({
							id: step.id,
							html: dom.body.innerHTML,
							// BackgroundColor: step.backgroundColor,
							// eslint-disable-next-line camelcase
							audio_base64: step.audio_base64,
							subtitles: parseSRT(step.subtitles),
							codeType: step.codeType,
						});
						return;
					}

					const lines = dom.querySelectorAll('.line');

					lines.forEach((line) => {
						line.classList.add('line-focus');
					});

					const previousCodeStrippedOfLineFocus =
						new DOMParser().parseFromString(previousCode, 'text/html');

					previousCodeStrippedOfLineFocus
						.querySelectorAll('.line-focus')
						.forEach((line) => {
							line.classList.remove('line-focus');
						});

					const spanForMargin = document.createElement('br');

					const outputText =
						step.codeType === 'output'
							? `<div>
							<span style="color: ${forgroundColor}" >Output</span>
						</div>`
							: '';

					codeHTMLs.push({
						id: step.id,
						html:
							previousCodeStrippedOfLineFocus.body.innerHTML +
							outputText +
							dom.body.innerHTML +
							spanForMargin.outerHTML,
						// BackgroundColor: step.backgroundColor,
						// eslint-disable-next-line camelcase
						audio_base64: step.audio_base64,
						subtitles: parseSRT(step.subtitles),
						codeType: step.codeType,
					});

					// Remove the line-focus class
					previousCode +=
						outputText + dom.body.innerHTML + spanForMargin.outerHTML;
				});
			});

			await Promise.all(stepProcessings);

			// Temp hack. do this from the backend
			codeHTMLs.sort((stepA, stepB) => {
				const numA = parseInt(stepA.id.split('-')[1], 10);
				const numB = parseInt(stepB.id.split('-')[1], 10);
				return numA - numB;
			});

			console.log('codeHTMLs', codeHTMLs);

			setCode(codeHTMLs);
			continueRender(handle);
		};

		processAllCode();
	}, []);

	const translateY = interpolate(currentFrame, [1604, 1664], [0, -800], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.elastic(),
	});

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
							className="w-full h-full text-[2rem] flex flex-col gap-12 rounded-3xl"
							style={{
								backgroundColor,
							}}
						>
							<div className="flex p-12 rounded-3xl gap-2">
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

					const totalDuration = codeHTML.subtitles.reduce((total, subtitle) => {
						total += subtitle.durationInFrames;
						return total;
					}, 0);

					const isIntro = codeHTML.codeType === 'intro';

					let introText = '';

					if (isIntro) {
						const dom = new DOMParser().parseFromString(
							codeHTML.html,
							'text/html'
						);

						introText = dom.body.innerText;
					}

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
										className="w-full h-full text-[2rem] flex flex-col gap-12 rounded-3xl"
										style={{
											backgroundColor:
												extractBackgroundColor(codeHTML.html) ?? undefined,
											overflow: 'hidden',
										}}
									>
										<div className="flex gap-2 z-10 p-12 pb-0">
											<div className="bg-[#FE5F57] w-8 h-8 rounded-full" />
											<div className="bg-[#FDBC2C] w-8 h-8 rounded-full" />
											<div className="bg-[#29C740] w-8 h-8 rounded-full" />
										</div>

										{codeHTML.codeType === 'intro' ? (
											<div
												style={{
													color: forgroundColor,
													fontFamily,
												}}
												className="font-black text-9xl leading-snug text-center  h-full flex p-12"
											>
												<span className="mt-52">{introText}</span>
											</div>
										) : (
											<div // eslint-disable-next-line react/no-danger
												dangerouslySetInnerHTML={{
													__html: codeHTML.html,
												}}
												className="flex-grow code-container text-[2.5rem] px-12"
												// Style={{
												// 	transform: `translateY(${translateY}px)`,
												// }}
											/>
										)}
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
														// CurrentFrame > 730
														// 	? `flex flex-col p-12 pt-24`
														`flex flex-col-reverse p-12 pb-24`
													}
													durationInFrames={subtitle.durationInFrames}
												>
													<p className="text-6xl font-black  leading-snug text-gray-300  p-12 rounded-3xl text-center subtitle">
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
