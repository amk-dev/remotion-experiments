import {z} from 'zod';
import {CodingPage} from './CodingCompositionModular';
import {TransitionSeries} from '@remotion/transitions';

let lastID = 0;

const sceneWithIDs = (scene: {code: string; narration: string}[]) => {
	return scene.map((step) => ({
		id: `step-${lastID++}`,
		...step,
	}));
};

import data from './array-join.remotion.json';

// Create a zod schema for tailwind gradient
export const AllCompositionsSchema = z.object({
	tailwindGradient: z.number(),
});

export const AllCompositions: React.FC<
	z.infer<typeof AllCompositionsSchema>
> = ({tailwindGradient}) => {
	return (
		<>
			<CodingPage
				tailwindGradient={tailwindGradient}
				steps={data.steps}
				backgroundColor={data.meta.backgroundColor}
				forgroundColor={data.meta.foregroundColor}
				creationName="rest-operator-0"
			/>

			{/* <CodingPage
				tailwindGradient={tailwindGradient}
				steps={stepsSpreadObject}
				creationName="spread-operator-with-objects"
			/> */}

			{/* <CodingPage
				tailwindGradient={tailwindGradient}
				steps={stepsSpreadFunction}
				creationName="spread-operator-with-functions"
			/> */}
		</>
	);
};
