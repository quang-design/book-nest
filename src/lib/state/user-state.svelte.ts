import { goto } from '$app/navigation';
import type { Database } from '$lib/types/database.types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';

interface UserStateProps {
	session: Session | null;
	supabase: SupabaseClient | null;
	user: User | null;
}

export interface Book {
	author: string | null;
	cover_image: string | null;
	created_at: string;
	description: string | null;
	finished_read: string | null;
	finished_reading_on: string | null;
	genre: string | null;
	id: number;
	rating: number | null;
	started_reading_on: string | null;
	title: string;
	user_id: string;
}

export interface OpenAIBook {
	bookTitle: string;
	author: string;
}

type UpdateableBookFields = Omit<Book, 'id' | 'user_id' | 'created_at'>;

export class UserState {
	session = $state<Session | null>(null);
	supabase = $state<SupabaseClient<Database> | null>(null);
	user = $state<User | null>(null);
	allBooks = $state<Book[]>([]);
	userName = $state<string | null>(null);

	constructor(data: UserStateProps) {
		this.updateState(data);
	}

	updateState(data: UserStateProps) {
		this.session = data.session;
		this.supabase = data.supabase;
		this.user = data.user;
		this.fetchUserData();
	}

	async fetchUserData() {
		if (!this.user || !this.supabase) {
			return;
		}

		const userId = this.user.id;

		const [booksResponse, userNameResponse] = await Promise.all([
			this.supabase.from('books').select('*').eq('user_id', this.user.id),
			this.supabase.from('user_names').select('name').eq('user_id', userId).single()
		]);

		if (
			booksResponse.error ||
			!booksResponse.data ||
			userNameResponse.error ||
			!userNameResponse.data
		) {
			console.error('Error fetching user data');
			console.error({
				booksError: booksResponse.error,
				userNameError: userNameResponse.error
			});
			return;
		}

		this.allBooks = booksResponse.data;
		this.userName = userNameResponse.data.name;
	}

	getHighestRatedBooks() {
		return this.allBooks
			.filter((book) => book.rating)
			.toSorted((a, z) => z.rating! - a.rating!)
			.slice(0, 9);
	}

	getUnreadBooks() {
		return this.allBooks
			.filter((book) => !book.started_reading_on)
			.toSorted((a, z) => new Date(z.created_at).getTime() - new Date(a.created_at).getTime())
			.slice(0, 9);
	}

	getFavoriteGenreBooks() {
		if (this.allBooks.filter((book) => book.genre).length === 0) {
			return '';
		}

		const genreCounts: { [key: string]: number } = {};

		this.allBooks.forEach((book) => {
			const genres = book.genre ? book.genre.split(',') : [];

			genres.forEach((genre) => {
				const trimmedGenre = genre.trim();
				if (trimmedGenre) {
					if (!genreCounts[trimmedGenre]) {
						genreCounts[trimmedGenre] = 1;
					} else {
						genreCounts[trimmedGenre]++;
					}
				}
			});
		});

		// console.log(genreCounts);

		const mostCommonGenre = Object.keys(genreCounts).reduce((a, z) =>
			genreCounts[a] > genreCounts[z] ? a : z
		);

		// console.log(mostCommonGenre);

		return mostCommonGenre || null;
	}

	getBooksFromFavoriteGenre() {
		const favoriteGenre = this.getFavoriteGenreBooks();
		return favoriteGenre ? this.allBooks.filter((book) => book.genre?.includes(favoriteGenre)) : [];
	}

	getBookById(bookId: number) {
		return this.allBooks.find((book) => book.id === bookId);
	}

	async updateBook(bookId: number, updateObject: Partial<UpdateableBookFields>) {
		if (!this.supabase) {
			return;
		}

		const { status, error } = await this.supabase
			.from('books')
			.update(updateObject)
			.eq('id', bookId);

		if (status === 204 && !error) {
			this.allBooks = this.allBooks.map((book) => {
				if (book.id === bookId) {
					return { ...book, ...updateObject };
				}
				return book;
			});
		}
	}

	async uploadBookCover(file: File, bookId: number) {
		if (!this.supabase || !this.user) {
			return;
		}

		const filePath = `${this.user.id}/${new Date().getTime()}_${file.name}`;
		const { error: uploadError } = await this.supabase.storage
			.from('book-covers')
			.upload(filePath, file);

		if (uploadError) {
			return console.log(uploadError);
		}

		const {
			data: { publicUrl }
		} = this.supabase.storage.from('book-covers').getPublicUrl(filePath);

		await this.updateBook(bookId, { cover_image: publicUrl });
	}

	async deleteBook(bookId: number) {
		if (!this.supabase) {
			return;
		}

		const { error, status } = await this.supabase.from('books').delete().eq('id', bookId);

		if (!error && status === 204) {
			this.allBooks = this.allBooks.filter((book) => book.id !== bookId);
		}

		goto('/private/dashboard');
	}

	async addBooksToLibrary(booksToAdd: OpenAIBook[]) {
		if (!this.supabase || !this.user) {
			return;
		}

		const userId = this.user.id;

		const processedBooks = booksToAdd.map((book) => ({
			title: book.bookTitle,
			author: book.author,
			user_id: userId
		}));

		const { error } = await this.supabase.from('books').insert(processedBooks);

		if (error) {
			throw new Error(error.message);
		} else {
			await this.fetchUserData();
		}
	}

	async updateAccountData(email: string, userName: string) {
		if (!this.session) {
			return;
		}

		try {
			const response = await fetch('/api/update-account', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.session.access_token}`
				},
				body: JSON.stringify({
					email,
					userName
				})
			});

			if (response) {
				this.userName = userName;
			}
		} catch (error) {
			console.log(`Failed to update account data`, error);
		}
	}

	async logout() {
		await this.supabase?.auth.signOut();
	}

	async deleteAccount() {
		if (!this.session) {
			return;
		}

		try {
			const response = await fetch('/api/delete-account', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.session.access_token}`
				}
			});

			if (response) {
				await this.logout();
				goto('/');
			}
		} catch (error) {
			console.log(`Failed to delete account`, error);
		}
	}
}

const USER_STATE_KEY = Symbol('USER_STATE');

export function setUserState(data: UserStateProps) {
	return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
	return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}
