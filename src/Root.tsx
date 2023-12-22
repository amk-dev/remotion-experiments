import {Composition} from 'remotion';

import {MyComposition} from './CodingComposition';

import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={180}
				fps={30}
				width={1080}
				height={1920}
			/>
		</>
	);
};
