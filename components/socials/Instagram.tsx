import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import InstagramPostWrapper from '../../lib/wrappers/InstagramPostWrapper';
import { InstagramPost } from '../../types/myTypes';

const Instagram = () => {
	const [postsData, setPostsData] = useState<InstagramPost[]>([]);

	const fetchData = useCallback(async () => {
		try {
			const res = await axios.get('/api/social/instagram/get-user-feed', {
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
				<InstagramPostWrapper key={post.id} data={post} />
			))}
		</>
	);
};

export default Instagram;
