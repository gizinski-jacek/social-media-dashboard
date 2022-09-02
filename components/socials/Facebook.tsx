import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FacebookPost } from '../../types/myTypes';
import FacebookPostWrapper from '../../lib/wrappers/FacebookPostWrapper';

const Facebook = () => {
	const [postsData, setPostsData] = useState<FacebookPost[]>([]);

	const fetchData = useCallback(async () => {
		try {
			const res = await axios.get('/api/social/facebook/get-user-feed', {
				withCredentials: true,
			});
			setPostsData(res.data);
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			{postsData?.map((post) => (
				<FacebookPostWrapper key={post.id} data={post} />
			))}
		</>
	);
};

export default Facebook;
