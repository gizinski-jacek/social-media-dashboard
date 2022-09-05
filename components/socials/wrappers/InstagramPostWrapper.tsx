import { Card, Typography } from '@mui/material';
import { InstagramPost } from '../../../types/myTypes';

interface Props {
	data: InstagramPost;
}

const InstagramPostWrapper = ({ data }: Props) => {
	return (
		<Card
			sx={{
				m: 2,
				mb: 0,
				minHeight: 80,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
			id={data.id}
		>
			<Typography variant='subtitle1'>{data.caption}</Typography>
			<Typography variant='h6'>{data.media_type}</Typography>
			<Typography variant='h6'>{data.media_url}</Typography>
			<Typography variant='h6'>{data.permalink}</Typography>
			<Typography variant='subtitle2'>{data.username}</Typography>
			<Typography variant='caption'>
				{new Date(data.timestamp).toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
				})}
			</Typography>
		</Card>
	);
};

export default InstagramPostWrapper;
