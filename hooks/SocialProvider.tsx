import { createContext, useState } from 'react';

interface Props {
	children: React.ReactNode;
}

type SocialProps = {
	social: string | null;
	updateSocial: (value: string | null) => void;
};

const SocialContext = createContext<SocialProps>({
	social: null,
	updateSocial: (value) => null,
});

const SocialContextProvider = ({ children }: Props) => {
	const [social, setSocial] = useState<string | null>(null);

	const updateSocial = (value: string | null) => {
		if (value) {
			setSocial(value.toLowerCase());
		} else {
			setSocial(value);
		}
	};

	return (
		<SocialContext.Provider value={{ social, updateSocial }}>
			{children}
		</SocialContext.Provider>
	);
};

export { SocialContext, SocialContextProvider };
