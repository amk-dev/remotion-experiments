import {z} from 'zod';
import {CodingPage} from './CodingCompositionModular';
import {TransitionSeries} from '@remotion/transitions';

const stepsWithComments = [
	{
		code: '',
		narration:
			'So on my video on Array.concat, Manas Sasidaran asked me if the spread operator is a shorthand for the concat method. No, its not. concat is a method available specifically for Arrays, but spread operator is a javascript language feature. So in this video, lets learn about the spread operator.',
	},
	{
		code: '// Spread Operator',
		narration:
			'Spread operator can be used in many places with different semantics but the same syntax.',
	},
	{
		code: `// With Arrays
		// With Objects
		// With Functions`,
		narration: 'We can use it with arrays, objects and functions.',
	},
	{
		code: '// Spread Operator With Arrays',
		narration: "First let's start with arrays.",
	},
	{
		code: `const names = ["john", "jane", "joe"];`,
		narration: 'Here we create an array called names.',
	},
	{
		code: `// you can spread an array to add elements to another array
		const updatedNames = ["kate", "james", ...names, "josh"]; 
		// updatedNames: ["kate", "james", "john", "jane", "joe", "josh"]`,
		narration:
			"Next, I want to add the elements of the 'names' array to the 'updatedNames' array. To do this. I'm using the spread operator to spread the 'names' array into the 'updatedNames' array. This adds the elements of 'names' to 'updatedNames'.",
	},
].map((step, index) => ({
	id: `step-${index}`,
	...step,
}));

const stepsSpreadObject = [
	{
		code: '// Spread Operator With Objects',
		narration: "Now let's see how we can use the spread operator with objects.",
	},
	{
		code: `const akash = {
  name: "akash",
  profession: "software engineer",
};`,
		narration:
			"We have an object 'akash' with properties 'name' and 'profession'.",
	},
	{
		code: `// create a new object with the same properties as akash, but with additional properties
const akashWithAdditionalInfo = {
			// copy all properties of akash
  ...akash,
  homeTown: "Kannur",
  currentlyIn: "Bangalore",
  lastReadBook: "Project Hail Mary",
};
// akashWithAdditionalInfo: {
//   name: "akash",
//   profession: "software engineer",
//   homeTown: "Kannur",
//   currentlyIn: "Bangalore",
//   lastReadBook: "Project Hail Mary",
// }`,
		narration:
			"Using the spread operator, we create 'akashWithAdditionalInfo' by spreading 'akash' and adding more properties.",
	},
].map((step, index) => ({
	id: `step-${stepsWithComments.length + index}`,
	...step,
}));

const stepsSpreadFunction = [
	{
		code: '// Spread Operator With Functions',
		narration:
			"Now let's explore how the spread operator can be used with functions.",
	},
	{
		code: ` // a function that takes 4 arguments and logs them
		const printNumbers = (num1, num2, num3, num4) => {
  console.log(\`num1: \${num1}, num2: \${num2}, num3: \${num3}, num4: \${num4}\`);
};`,
		narration:
			"We have a function 'printNumbers' that takes four arguments and logs them.",
	},
	{
		code: `// we'll use this array elements as arguments to printNumbers
		const numbersToPrint = [1, 2, 3, 4];`,
		narration:
			"Instead of passing arguments directly, we can use the spread operator with an array, like 'numbersToPrint'.",
	},
	{
		code: `printNumbers(...numbersToPrint);
		// prints
		// num1: 1, num2: 2, num3: 3, num4: 4`,
		narration:
			"Using the spread operator, we pass 'numbersToPrint' as arguments to 'printNumbers'. Each element of the array matches an argument of the function.",
	},
	{
		code: `const someNumbers = [4, 2];`,
		narration:
			"The array doesn't need to contain all arguments. Here 'someNumbers' has only two.",
	},
	{
		code: `printNumbers(6, ...someNumbers, 9);
		// prints
		// num1: 6, num2: 4, num3: 2, num4: 9`,
		narration:
			"We can mix the spread operator with regular arguments, as in this call to 'printNumbers' with both 'someNumbers' and individual values.",
	},
].map((step, index) => ({
	id: `step-${stepsWithComments.length + stepsSpreadObject.length + index}`,
	...step,
}));

const finalSteps = [
	{
		code: `// Spread Operator is a language feature
		// Spread Operator can be used with arrays, objects and functions`,
		narration:
			"So that's all you need to know to start using spread operator. Follow for more javascript content.",
	},
].map((step, index) => ({
	id: `step-${
		stepsWithComments.length +
		stepsSpreadObject.length +
		stepsSpreadFunction.length +
		index
	}`,
	...step,
}));

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
				steps={[
					stepsWithComments,
					stepsSpreadObject,
					stepsSpreadFunction,
					finalSteps,
				]}
				creationName="spread-operator-with-arrays"
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
