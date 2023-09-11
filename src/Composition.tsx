import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Sequence,
	staticFile,
	OffthreadVideo,
	Audio,
	Img,
} from 'remotion';

import {loadFont} from '@remotion/google-fonts/LuckiestGuy';

const {fontFamily} = loadFont();

export const MyComposition: React.FC = () => {
	const subtitleEntries1 = [
		{
			text: 'HOW',
			length: 6,
		},
		{
			text: 'TO',
			length: 4,
		},
		{
			text: 'TURN',
			length: 5,
		},
		{
			text: 'MESSY',
			length: 16,
		},
		{
			text: 'OBJECTS',
			length: 9,
		},
		{
			text: 'LIKE',
			length: 7,
		},
		{
			text: 'THIS',
			length: 10,
		},
	];

	const subtitleEntries2 = [
		{
			text: 'INTO',
			length: 11,
		},
		{
			text: 'EASY',
			length: 15,
		},
		{
			text: 'TO',
			length: 3,
		},
		{
			text: 'VIEW',
			length: 17,
		},
		{
			text: 'ORGANIZED',
			length: 27,
		},
		{
			text: 'TABLES',
			length: 10,
		},
		{
			text: 'LIKE',
			length: 10,
		},
		{
			text: 'THIS',
			length: 7,
		},
	];

	const startSubtitles = getSubtitleElements(subtitleEntries1);
	const endSubtitles = getSubtitleElements(
		subtitleEntries2,
		'justify-center items-start pt-80',
		57
	);

	const currentFrame = useCurrentFrame();
	const imgOpacity1 = interpolate(currentFrame, [49, 55], [0, 1]);
	const imgOpacity2 = interpolate(currentFrame, [109, 115], [0, 1]);

	return (
		<AbsoluteFill className="bg-transparent">
			{startSubtitles}
			{endSubtitles}

			<Sequence
				className="justify-center items-center"
				from={49}
				durationInFrames={71}
				style={{opacity: imgOpacity1}}
			>
				<Img className="h-2/4" src={staticFile('messy-object.png')} />
			</Sequence>

			<Sequence
				className="justify-center items-center"
				from={120}
				durationInFrames={60}
				style={{opacity: imgOpacity2}}
			>
				<Img className="h-2/4" src={staticFile('organized-table.png')} />
			</Sequence>

			<Audio src={staticFile('console-table.wav')} />
		</AbsoluteFill>
	);
};

function getSubtitleElements(
	subtitleEntries: {text: string; length: number}[],
	wrapperClasses?: string,
	currentLength = 0
) {
	let totalLength = currentLength;

	return subtitleEntries.map((entry) => {
		const subtitleElement = (
			<Sequence
				key={entry.text}
				className={wrapperClasses ?? 'justify-center items-center'}
				durationInFrames={entry.length}
				from={totalLength}
			>
				<h2 style={{fontFamily}} className="title text-8xl text-gray-100">
					{entry.text}
				</h2>
			</Sequence>
		);

		totalLength += entry.length;

		return subtitleElement;
	});
}
