import {Composition} from 'remotion';

import {MyComposition, MyCompositionSchema} from './CodingComposition';

import './style.css';
import {AllCompositions, AllCompositionsSchema} from './AllCompositions';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={AllCompositions}
				defaultProps={{
					tailwindGradient: 1,
				}}
				durationInFrames={6339}
				fps={60}
				width={1080}
				height={1920}
				schema={AllCompositionsSchema}
			/>
		</>
	);
};
