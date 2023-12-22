// Import {Audio} from 'remotion';
import {delayRender, continueRender, useVideoConfig, spring} from 'remotion';
import {Sequence, AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useEffect} from 'react';

import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

import {useState} from 'react';

export const MyComposition: React.FC = () => {
	// Const [handle] = useState(() => delayRender());

	const [codeHTMLs, setCode] = useState<
		{
			html: string;
			backgroundColor: string;
		}[]
	>([]);

	const [handle] = useState(() => delayRender());

	useEffect(() => {
		const processAllCode = async () => {
			const codeHTMLs: {
				html: string;
				backgroundColor: string;
			}[] = [];
			for (const code of codes) {
				const {html, backgroundColor} = await codeToHtml(code);
				codeHTMLs.push({
					html,
					backgroundColor,
				});
			}

			setCode(codeHTMLs);
			continueRender(handle);
		};

		processAllCode();
	}, []);

	return (
		<AbsoluteFill>
			<TransitionSeries>
				{codeHTMLs.map((codeHTML, index) => {
					return (
						<>
							<TransitionSeries.Sequence key={index} durationInFrames={60}>
								<div
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{
										__html: codeHTML.html,
									}}
									className="w-full h-full text-[2rem] p-12"
									style={{
										backgroundColor: codeHTML.backgroundColor,
									}}
								/>
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
