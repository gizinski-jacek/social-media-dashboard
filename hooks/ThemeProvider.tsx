import { createContext, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';

interface Props {
	children: React.ReactNode;
}

type ThemeProps = {
	theme: 'dark' | 'light';
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeProps>({
	theme: 'light',
	toggleTheme: () => null,
});

const ThemeContextProvider = ({ children }: Props) => {
	const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'light');
	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	};

	useEffect(() => {
		const defaultLight = window.matchMedia(
			'(prefers-color-scheme: light)'
		).matches;
		setTheme(defaultLight ? 'light' : 'dark');
	}, [setTheme]);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export { ThemeContext, ThemeContextProvider };
