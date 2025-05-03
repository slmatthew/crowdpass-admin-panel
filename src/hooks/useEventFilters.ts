import { useState, useEffect } from 'react';

export interface Filters {
  search: string;
  organizer: string;
  category: string;
  location: string;
  sort: 'soonest' | 'latest' | 'az' | 'za';
	futureOnly: boolean;
  page: number;
}

const defaultFilters: Filters = {
	search: '',
	organizer: '',
	category: '',
	location: '',
	sort: 'soonest',
	futureOnly: true,
	page: 1,
};

export function useEventFilters() {
	const [filters, setFilters] = useState<Filters>(() => {
		const saved = localStorage.getItem('event-filters');
		return saved ? JSON.parse(saved) : defaultFilters;
	});

	useEffect(() => {
		localStorage.setItem('event-filters', JSON.stringify(filters));
	}, [filters]);

	const update = (updates: Partial<Filters>) => {
		setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
	};

	const reset = () => setFilters(defaultFilters);

	const goToPage = (page: number) => setFilters((prev) => ({ ...prev, page }));

	return { filters, update, reset, goToPage };
}