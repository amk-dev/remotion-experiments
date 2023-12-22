export type FocusAnnotation = {
	type: 'focus';
	lines: number[];
};

export type HighlightAnnotation = {
	type: 'highlight';
	columns: {
		line: number;
		columnValues?: number[];
		columnRange?: {
			startColumn: number;
			endColumn: number;
		};
	};
};

type Annotation = FocusAnnotation | HighlightAnnotation;

type Step = {
	id: string;
	type: 'code';
	code: string;
	annotations?: Annotation[];
};

const step1: Step = {
	id: 'step1',
	type: 'code',
	code: /* js */ `
    const numbers = [1,2,3,4,5,6]
  `,
};

// // Step 1

// // we have an array of numbers, and we want to double each number
// const numbers = [1, 2, 3, 4, 5, 6];

// const numbers = [1,2,3,4,5,6]
// // we can use the map function to double each element in the array
// const doubledNumbers = numbers.map((number) => number * 2);

// // here the important details are,

// // the array we are mapping over
// [1,2,3,4,5,6]

// // the function to apply to each element
// (number) => number * 2

// // the result of the map function
// []

const step2: Step = {
	id: 'step2',
	type: 'code',
	code: /* js */ `
    const numbers = [1,2,3,4,5,6]

    const doubledNumbers = numbers.map((number) => number * 2);
    `,
};

const step3: Step = {
	id: 'step3',
	type: 'code',
	code: /* js */ `

    // the array we are mapping over
    [1,2,3,4,5,6]

    // the function to apply to each element
    (number) => number * 2

    // the result of the map function
    []
    `,
	annotations: [
		{
			type: 'focus',
			lines: [3, 4],
		},
	],
};

const step4: Step = {
	id: 'step4',
	type: 'code',
	code: /* js */ `

    // the array we are mapping over
    [1,2,3,4,5,6]

    // the function to apply to each element
    (number) => number * 2

    // the result of the map function
    []
      `,
	annotations: [
		{
			type: 'focus',
			lines: [6, 7],
		},
	],
};

const step5: Step = {
	id: 'step5',
	type: 'code',
	code: /* js */ `

    // the array we are mapping over
    [1,2,3,4,5,6]

    // the function to apply to each element
    (number) => number * 2

    // the result of the map function
    []
      `,
	annotations: [
		{
			type: 'focus',
			lines: [9, 10],
		},
	],
};

const mappingSteps = [1, 2, 3, 4, 5, 6]
	.map((number, index): Step[] => {
		const mappedValues = [1, 2, 3, 4, 5, 6]
			.slice(0, index)
			.map((number) => number * 2);

		const mappedValuesWithCurrentNumber = [...mappedValues, number * 2];

		const currentNumberColumn = index === 0 ? 2 : 2 + index * 2;

		return [
			{
				id: `step${index + 1}`,
				type: 'code',
				code: /* js */ `
      
    // the array we are mapping over
    [1,2,3,4,5,6]
    
    // the function to apply to each element
    (number) => number * 2
    
    // the result of the map function
    [${mappedValues.join(', ')}]
      `,
				annotations: [
					{
						type: 'highlight',
						columns: {
							line: 4,
							columnValues: [1, currentNumberColumn, 13],
						},
					},
				],
			},
			{
				id: `step${index + 2}`,
				type: 'code',
				code: /* js */ `
      
    // the array we are mapping over
    [1,2,3,4,5,6]
    
    // the function to apply to each element
    (${number}) => ${number} * 2
    
    // the result of the map function
    [${mappedValues.join(', ')}]
      `,
				annotations: [
					{
						type: 'highlight',
						columns: {
							line: 4,
							columnValues: [1, currentNumberColumn, 13],
						},
					},
				],
			},
			{
				id: `step${index + 2}`,
				type: 'code',
				code: /* js */ `
      
    // the array we are mapping over
    [1,2,3,4,5,6]
    
    // the function to apply to each element
    (${number}) => ${number} * 2 // evaluate to ${number * 2}
    
    // the result of the map function
    [${mappedValues.join(', ')}]
      `,
				annotations: [
					{
						type: 'highlight',
						columns: {
							line: 4,
							columnValues: [1, currentNumberColumn, 13],
						},
					},
				],
			},
			{
				id: `step${index + 3}`,
				type: 'code',
				code: /* js */ `
      
    // the array we are mapping over
    [1,2,3,4,5,6]
    
    // the function to apply to each element
    (${number}) => ${number} * 2 // evaluate to ${number * 2}
    
    // the result of the map function
    [${mappedValuesWithCurrentNumber.join(', ')}]
      `,
				annotations: [
					{
						type: 'highlight',
						columns: {
							line: 4,
							columnValues: [1, currentNumberColumn, 13],
						},
					},
				],
			},
		];
	})
	.flat();

const stepSetDoubledNumbers: Step = {
	id: 'stepSetDoubledNumbers',
	type: 'code',
	code: /* js */ `
      const numbers = [1,2,3,4,5,6]
  
      // the result from the mapping function is assigned to the variable doubledNumbers
      const doubledNumbers = numbers.map((number) => number * 2);
        `,
	annotations: [
		{
			type: 'focus',
			lines: [4, 5],
		},
		// {
		//   type: "highlight",
		//   columns: {
		//     line: 5,
		//     columnRange: {
		//       startColumn: 8,
		//       endColumn: 21,
		//     },
		//   },
		// },
	],
};

const highlightMapPart: Step = {
	id: 'highlightMapPart',
	type: 'code',
	code: /* js */ `
    const numbers = [1,2,3,4,5,6]

    // the result from the mapping function is assigned to the variable doubledNumbers
    const doubledNumbers = numbers.map((number) => number * 2);
      `,
	annotations: [
		{
			type: 'focus',
			lines: [5],
		},
		{
			type: 'highlight',
			columns: {
				line: 5,
				columnRange: {
					startColumn: 8,
					endColumn: 21,
				},
			},
		},
	],
};

const replaceNumbersResult: Step = {
	id: 'replaceNumbersResult',
	type: 'code',
	code: /* js */ `
    const numbers = [1,2,3,4,5,6]

    // the result from the mapping function is assigned to the variable doubledNumbers
    const doubledNumbers = [2, 4, 6, 8, 10, 12];
      `,
	annotations: [
		{
			type: 'focus',
			lines: [5],
		},
		{
			type: 'highlight',
			columns: {
				line: 5,
				columnRange: {
					startColumn: 7,
					endColumn: 21,
				},
			},
		},
	],
};

const printDoubledNumbers: Step = {
	id: 'printDoubledNumbers',
	type: 'code',
	code: /* js */ `
    const numbers = [1,2,3,4,5,6]

    // the result from the mapping function is assigned to the variable doubledNumbers
    const doubledNumbers = numbers.map((number) => number * 2);

    console.log(doubledNumbers); // [2, 4, 6, 8, 10, 12]
      `,
};

export const generateSteps = function* () {
	// Const steps = [step1, step2, step3, step4, step5, step6, step7];
	const steps = [
		step1,
		step2,
		step3,
		step4,
		step5,
		...mappingSteps,
		stepSetDoubledNumbers,
		highlightMapPart,
		replaceNumbersResult,
		printDoubledNumbers,
	];

	for (const step of steps) {
		yield step;
	}
};
