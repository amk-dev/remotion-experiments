import {Composition} from 'remotion';

import {MyComposition, MyCompositionSchema} from './CodingComposition';

import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				defaultProps={{
					tailwindGradient: 1,
				}}
				durationInFrames={2008}
				fps={30}
				width={1080}
				height={1920}
				schema={MyCompositionSchema}
			/>
		</>
	);
};
