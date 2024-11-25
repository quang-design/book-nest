import { OPENAI_API_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	const { base64 } = await request.json();

	const response = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `In the given image there will be one or many books displayed. What you need to do is to give me back JSON and nothing else.
	                Please only give me back the valid JSON since this will programmatically handled and it will crash if the JSON is not valid.
	                What I need as information is the books that you can see in the image  in this format:
	                {
	                "bookTitle": string // Example: "Harry Potter and the deadly hallows"
	                "author": string // Example: "J.K. Rowling"
	                }
	                Please also make sure that you return an array even if there is only one book in the image.
	                `
					},
					{
						type: 'image_url',
						image_url: {
							url: `data:image/jpeg;base64,${base64}`,
							detail: 'low'
						}
					}
				]
			}
		]
	});

	const bookArrayString = response.choices[0].message.content?.replace(/```json|```/g, '').trim();

	const bookArray = JSON.parse(bookArrayString || '[]');

	// const bookArray = [
	// 	{
	// 		bookTitle: 'The most effective dog',
	// 		author: 'M. Burkhart'
	// 	},
	// 	{
	// 		bookTitle: 'RESILIENT ME',
	// 		author: 'Sam Owen'
	// 	},
	// 	{
	// 		bookTitle: 'The New Baby',
	// 		author: 'M. K. Dorken'
	// 	},
	// 	{
	// 		bookTitle: 'Black Box Thinking',
	// 		author: 'Matthew Syed'
	// 	},
	// 	{
	// 		bookTitle: 'Edinburgh',
	// 		author: 'Unknown'
	// 	},
	// 	{
	// 		bookTitle: 'New York City',
	// 		author: 'Unknown'
	// 	}
	// ];

	return json({
		bookArray
	});
};
