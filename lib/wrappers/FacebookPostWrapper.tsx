import { Box } from '@mui/material';
import axios from 'axios';
import { FacebookPost } from '../../types/myTypes';

interface Props {
	data: FacebookPost;
}

const FacebookPostWrapper = ({ data }: Props) => {
	return (
		<Box alignItems={'center'} id={data.id}>
			<Box>{data.message}</Box>
			<Box>
				{new Date(data.created_time).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
				})}
			</Box>
		</Box>
	);
};

export default FacebookPostWrapper;
